const { redactData } = require("@toruslabs/loglevel-sentry");

const reURL = /\/auth\/.*/i;

module.exports = (event) => {
  if (!event.request) return event;

  if (reURL.test(event.request.url)) {
    // Redact body for sentitive URLs.
    event.request.data = "***";
  }

  // Redact sensitive headers.
  event.request.headers = redactData(event.request.headers);

  return event;
};
