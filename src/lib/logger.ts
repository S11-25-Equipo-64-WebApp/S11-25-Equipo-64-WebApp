if (typeof process !== "undefined" && process.env.NODE_ENV !== "test") {
  await import("server-only");
}

import fs from "fs";
import path from "path";
import pino from "pino";
import pretty from "pino-pretty";
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const logDir = process.env.LOG_DIR ?? path.join(process.cwd(), "log");
const resolvedLogDir = path.isAbsolute(logDir)
  ? logDir
  : path.join(process.cwd(), logDir);
const logFile = path.join(resolvedLogDir, "app.log");

// --- STREAMS ---
const streams: pino.DestinationStream[] = [];

if (isTest) {
  streams.push(pino.destination(1));
} else if (isProduction) {
  // write to stdout
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

  // ensure log folder exists before writing to file
  try {
    fs.mkdirSync(resolvedLogDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create log directory", { resolvedLogDir, error });
  }

  // write to file
  streams.push(pino.destination(logFile));
}

// --- CONFIG ---
const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? (isTest ? "silent" : isProduction ? "info" : "debug"),
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
