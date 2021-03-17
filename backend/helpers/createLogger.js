const Sentry = require("@sentry/node");
const { createLogger } = require("@toruslabs/loglevel-sentry");

module.exports = (name) => createLogger(name, Sentry);
