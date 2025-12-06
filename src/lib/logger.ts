import "server-only";

import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
  base: undefined,
  messageKey: "message",
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export type AppLogger = typeof logger;
