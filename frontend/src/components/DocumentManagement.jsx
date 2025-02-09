import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Description as FileIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const DocumentManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [downloadLinks, setDownloadLinks] = useState({});
  // const URL = import.meta.env.VITE_URL_1
  const URL = import.meta.env.VITE_URL_2

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const query = `query=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(`/api/documents/search?${query}`);
      const data = await res.json();

      if (res.ok) {
        setSearchResults(data.files);
      } else {
        setError(data.error || "Error searching files.");
      }
    } catch (err) {
      console.error("Error searching files:", err);
      setError("Error searching files.");
    } finally {
      setLoading(false);
    }
  };

  // Fine
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must not exceed 5MB");
      setSelectedFile(null);
      return;
    }

    const fileType = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "csv"].includes(fileType)) {
      setError("Only .xlsx and .csv files are allowed");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    setUploadSuccess("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${URL}/s3pu-upload?filename=${selectedFile.name}&mimetype=${selectedFile.type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.url) {
        const result = await fetch(data.url, {
          method: "PUT",
          headers: {
            "Content-Type": encodeURI(selectedFile.type),
          },
          body: selectedFile,
        });
        if (result.status == 200) {
          setUploadSuccess("File uploaded successfully!");
          setSelectedFile(null);
          setLoading(false);
        } else {
          setError("Failed! File NOT uploaded successfully!");
          setLoading(true);
        }
      }
    } catch (err) {
      console.error("Error uploading file: ", err);
      setError("Failed to upload file. Please try again.");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const res = await fetch(`${URL}/download/${filename}`);
      const data = await res.json();

      if (res.ok && data.url) {
        alert(
          "Note: This presigned URL will expire in 3 minutes. Use it to download the file."
        );
        setDownloadLinks((prev) => ({
          ...prev,
          [filename]: data.url,
        }));
      } else {
        setError(data.error || "Error generating download link.");
      }
    } catch (err) {
      console.error("Error generating download link:", err);
      setError("Error generating download link.");
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Retrieve Documents
          </Typography>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ display: "flex", gap: 1 }}
          >
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={loading}
            >
              Search
            </Button>
          </Box>

          {searchResults.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                maxHeight: 300,
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            >
              <List>
                {searchResults.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDownload(file.name)}
                        color="primary"
                      >
                        <DownloadIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <FileIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={
                        <>
                          Last Modified:{" "}
                          {new Date(file.lastModified).toLocaleDateString()}
                          {downloadLinks[file.name] && (
                            <Box mt={1}>
                              <Link
                                href={downloadLinks[file.name]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download Link (expires in 3 minutes)
                              </Link>
                            </Box>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Paper>
      </Grid>

      {/* Upload Section */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upload Documents
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Select File
              <input
                type="file"
                hidden
                accept=".xlsx,.csv"
                onChange={handleFileSelect}
              />
            </Button>

            {selectedFile && (
              <Typography variant="body2" color="text.secondary">
                Selected: {selectedFile.name}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <UploadIcon />
              }
            >
              Upload
            </Button>
          </Box>
        </Paper>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </Grid>
      )}

      {uploadSuccess && (
        <Grid item xs={12}>
          <Alert severity="success" sx={{ mt: 2 }}>
            {uploadSuccess}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default DocumentManagement;
