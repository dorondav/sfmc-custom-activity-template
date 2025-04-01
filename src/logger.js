import { createLogger, StringifyAndParseObjectsHook } from "vue-logger-plugin";

const logger = createLogger({
  enabled: true,
  level: "debug",
  callerInfo: true,
  beforeHooks: [StringifyAndParseObjectsHook],

  prefixFormat: ({ level }) => `${level}:`,
});

export default logger;
