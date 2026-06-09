// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4e7f93d187f0699161fe093fa789a4b4@o4511532485509120.ingest.de.sentry.io/4511532490424400",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
    integrations: [
    Sentry.vercelAIIntegration,
    Sentry.consoleLoggingIntegration({
      levels:[
        "log",
        "warn",
        "error"
      ]
    }),
  ],
});
