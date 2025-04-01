require("dotenv").config();

const express = require("express");
const logger = require("./lib/logger");
const bodyParser = require("body-parser");
const history = require("connect-history-api-fallback");

const cors = require("cors");
const helmet = require("helmet");

// Optional environment variables
const PORT = process.env.PORT || 8080;

const NODE_ENV = process.env.NODE_ENV || "development";
const NODE_VERSION = process.env.NODE_VERSION || "20.9.0";

const app = express();
app.use(history());

// Configure middleware & parsers
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    xFrameOptions: false,
  })
);
app.use(express.json());
app.use(bodyParser.json());

// Configure client route
app.use(express.static(`${__dirname}/dist/`));

// Configure server routes
app.use("/check-image-size", require("./routes/checkImageSize"));
app.get("/config.json", require("./routes/config"));
app.post("/publish", require("./routes/publish"));
app.post("/execute", require("./routes/execute"));
app.post("/validate", (req, res) => {
  return res.status(200).json({});
});

// Configure client route
app.use(express.static(`${__dirname}/dist/`));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`[app.js] error: ${err.message}`);
  res.status(500).send("Internal Server Error");
});

// Start server
app.listen(PORT, (error) => {
  if (error) {
    logger.error(`[app.js] catch: ${JSON.stringify(error)}`);
  } else {
    logger.info(`[app.js] port: ${PORT} | node_env: ${NODE_ENV} | node_version: ${NODE_VERSION}`);
  }
});
