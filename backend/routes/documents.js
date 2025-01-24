const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const s3 = require("../config/s3");
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

aws.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.get("/s3pu-upload", async (req, res) => {
  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: req.query.filename,
    Expires: 60 * 60,
    ContentType: req.query.mimetype,
  };
  const url = await s3.getSignedUrl("putObject", s3Params);
  res.json({ url });
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.query || "";
    const params = {
      Bucket: BUCKET_NAME,
    };

    const allFiles = [];
    let continuationToken;

    do {
      const data = await s3
        .listObjectsV2({ ...params, ContinuationToken: continuationToken })
        .promise();
      allFiles.push(...data.Contents);
      continuationToken = data.NextContinuationToken;
    } while (continuationToken);

    const matchingFiles = allFiles
      .filter((file) => file.Key.toLowerCase().includes(query.toLowerCase()))
      .map((file) => ({
        name: file.Key,
        lastModified: file.LastModified,
        size: file.Size,
      }));

    res.json({ files: matchingFiles });
  } catch (err) {
    console.error("Error searching files:", err);
    res.status(500).json({ error: "Error searching files." });
  }
});

router.get("/download/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Expires: 180,
    };

    const url = await s3.getSignedUrlPromise("getObject", params);
    res.json({
      url,
      message:
        "The download link is valid for 3 minutes. Please download the file before it expires.",
    });
  } catch (err) {
    console.error("Error generating download URL:", err);
    res.status(500).json({ error: "Error generating download URL." });
  }
});

module.exports = router