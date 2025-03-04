class Logger {
  static logLevels = {
    error: "error",
    info: "info",
  };

  static enabledLevels: string[] = [Logger.logLevels.info, Logger.logLevels.error];

  static log(message: string, level: string = Logger.logLevels.info, error: Error | null = null): void {
    if (Logger.enabledLevels.includes(level)) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      if (error && error.message) {
        console[level](logMessage + `: ${error.message}`);
      } else {
        console[level](logMessage);
      }
    }
  }
}

export = Logger;
