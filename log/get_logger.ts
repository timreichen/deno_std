// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { Logger } from "./logger.ts";
import { state } from "./_state.ts";

/** Get a logger instance. If not specified `name`, get the default logger. */
export function getLogger(name = "default"): Logger {
  const result = state.loggers.get(name);
  if (!result) {
    if (name === "default") {
      throw new Error(
        `"default" logger must be set for getting logger without name`,
      );
    }
    const logger = new Logger(name, "NOTSET", { handlers: [] });
    state.loggers.set(name, logger);
    return logger;
  }
  return result;
}
