const logger = require("../lib/logger");
// Configuration settings
logger.info("Config.js Loaded");

const CONFIG_SETTINGS = {
  appTitle: "SFMC Push notification",
  appDescription: "Marketing Cloud Journey Builder Activity",
  appURL: process.env.VITE_APP_URL.replace(/\/+$/, ""),
  timeout: 9900,
  retryCount: 0,
  retryDelay: 1000,
  concurrentRequests: 5,
};

// Configuration definition
const json = {
  workflowApiVersion: "1.1",
  metaData: {
    category: "message",
  },
  type: "REST",
  lang: {
    "en-US": {
      name: CONFIG_SETTINGS.appTitle,
      description: CONFIG_SETTINGS.appDescription || "",
    },
  },
  arguments: {
    execute: {
      timeout: CONFIG_SETTINGS.timeout,
      retryCount: CONFIG_SETTINGS.retryCount,
      retryDelay: CONFIG_SETTINGS.retryDelay,
      concurrentRequests: CONFIG_SETTINGS.concurrentRequests,
      url: `${CONFIG_SETTINGS.appURL}/execute`,
      inArguments: [],
      outArguments: [],
    },
    url: `${CONFIG_SETTINGS.appURL}/execute`,
  },
  configurationArguments: {
    // validate: {
    //   url: `${CONFIG_SETTINGS.appURL}/validate`,
    // },
    publish: {
      url: `${CONFIG_SETTINGS.appURL}/publish`,
      body: "",
    },
  },
  userInterfaces: {
    // configurationSupportsReadOnlyMode: false,
    // configInspector: {
    //   size: "scm-lg",
    //   emptyIframe: true,
    // },
    configModal: {
      width: 300,
      height: 800,
      fullscreen: true,
      url: `/`,
    },
    runningHover: {
      url: `hover`,
    },
    runningModal: {
      url: `modal`,
    },
  },
  schema: {
    arguments: {
      execute: {
        inArguments: [],
        outArguments: [],
      },
    },
  },
};

module.exports = (req, res) => {
  res.json(json);
};
