require("dotenv").config();
const colors = require("colors");
const express = require("express");
const cors = require("cors");
const documentRoutes = require("./routes/documents");
const app = express();
const port = 3001;

app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization,Access-Control-Allow-Origin",
}));

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

app.listen(port, '0.0.0.0' ,() => {
  console.log("\n🚀 Server is running!".green);
  console.log("URL: ".yellow, `http://localhost:${port}/api/test`.blue);
  console.log("\nPress Ctrl+C to stop the server\n".gray);
});

module.exports = app;
