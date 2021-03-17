const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const log = require("loglevel");
const { errors } = require("celebrate");
const Sentry = require("@sentry/node");
const redact = require("./helpers/redactSentry");

const v1Router = require("./app/v1/mainRouter");
// setup app
const app = express();

// setup Sentry
const isSentryConfigured = process.env.SENTRY_DSN && process.env.SENTRY_DSN.length > 0;
if (isSentryConfigured) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    sampleRate: 0.5,
    beforeSend(event) {
      return redact(event);
    },
  });
  app.use(
    Sentry.Handlers.requestHandler({
      request: ["public_address", "data", "headers", "method", "query_string", "url"],
    })
  );
}

// Setup environment
require("dotenv").config();

if (process.env.NODE_ENV === "development") {
  log.enableAll();
} else {
  log.setDefaultLevel("info");
}

app.locals.rootPath = __dirname;
app.set("rootPath", __dirname);

// setup middleware
const corsOptions = {
  // origin: ["http://localhost:3000","http://localhost:3001", /\.tor\.us$/],
  origin: true,
  credentials: false,
  allowedHeaders: ["Content-Type", "x-api-key", "x-embed-host"],
  methods: "GET,POST",
  maxAge: 86400,
};

app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") app.use(morgan("tiny")); // HTTP logging
app.use(cors(corsOptions)); // middleware to enables cors
app.use(helmet()); // middleware which adds http headers
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" })); // middleware which parses body
app.use(bodyParser.json({ limit: "10mb" })); // converts body to json
// bring all routes here
app.use("/api/v1", v1Router);
app.use(errors());

const port = process.env.PORT || 3040;
app.listen(port, () => log.info(`Server running on port: ${port}`));
