import "server-only";

import fs from "fs";
import path from "path";
import pino from "pino";
import pretty from "pino-pretty";

const isProduction = process.env.NODE_ENV === "production";

// Crear carpeta si no existe

const logDir = process.env.LOG_DIR ?? path.join(process.cwd(), "log");
const logFile = path.join(logDir, "app.log");

// --- STREAMS ---
const streams: pino.DestinationStream[] = [];

if (isProduction) {
  // wite to stdout
  streams.push(pino.destination(1));
} else {
  // pretty print (terminal)
  streams.push(
    pretty({
      colorize: true,
      ignore: "pid,hostname",
      singleLine: true,
      // destination: logFile,
    })
  );
  // write to file
  streams.push(pino.destination(logFile));
}

// --- CONFIG ---
const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
    base: undefined,
    messageKey: "message",
    formatters: {
      level: (label) => ({ level: label }),
    },
  },
  pino.multistream(streams)
);

logger.info(`Logger initialized → ${isProduction ? logDir : "pretty stdout"}`);

export { logger };
export type AppLogger = typeof logger;
