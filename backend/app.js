require("dotenv").config();
const colors = require("colors");
const express = require("express");
const cors = require("cors");
const documentRoutes = require("./routes/documents");
const app = express();
const port = 3001;

const corsOptions = {
  origin: process.env.AWS_AMP_LINK,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/documents", documentRoutes);

app.get("/api/test", (req, res) => {
  console.log("🔵 GET Request to:".blue, "/api/test");
  res.json({
    message: "Server is up and running!",
    timestamp: new Date().toISOString(),
    status: "OK",
  });
});

app.listen(port, () => {
  console.log("\n🚀 Server is running!".green);
  console.log("URL: ".yellow, `http://localhost:${port}/api/test`.blue);
  console.log("\nPress Ctrl+C to stop the server\n".gray);
});

module.exports = app;
