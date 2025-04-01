const FuelRest = require("fuel-rest");
const logger = require("./logger");

// Required environment variables
const {
  SFMC_MID,
  SFMC_TENANT,
  SFMC_CLIENT,
  SFMC_SECRET,
  SFMC_SENT_LOG_DE,
  SFMC_PUBLISH_LOG_DE,
  SFMC_ERROR_LOG_DE,
} = process.env;

const SFMC_MIDs = SFMC_MID.split(",");
const SFMC_TENANTs = SFMC_TENANT.split(",");
const SFMC_CLIENTs = SFMC_CLIENT.split(",");
const SFMC_SECRETs = SFMC_SECRET.split(",");
const SFMC_SENT_LOG_DEs = SFMC_SENT_LOG_DE.split(",");
const SFMC_PUBLISH_LOG_DEs = SFMC_PUBLISH_LOG_DE.split(",");
const SFMC_ERROR_LOG_DEs = SFMC_ERROR_LOG_DE.split(",");

// Default variables
let sfmcClients = [];

const returnDEKey = (actionName) => {
  const deKeys = {
    sent: SFMC_SENT_LOG_DEs,
    publish: SFMC_PUBLISH_LOG_DEs,
    error: SFMC_ERROR_LOG_DEs,
  };
  return deKeys[actionName];
};

SFMC_MIDs.forEach((mid, key) => {
  // Connect to client(s)
  sfmcClients[mid] = new FuelRest({
    auth: {
      authOptions: {
        authVersion: 2,
        accountId: mid,
      },
      clientId: SFMC_CLIENTs[key],
      clientSecret: SFMC_SECRETs[key],
      authUrl: `https://${SFMC_TENANTs[key]}.auth.marketingcloudapis.com/v2/token`,
    },
  });

  // Test connection(s)
  sfmcClients[mid].get(
    { uri: "/platform/v1/tokenContext" },
    (error, response) => {
      if (error) {
        logger.error(
          `[sfmc.js] mid: ${mid} | catch: ${JSON.stringify(error.res)}`
        );
      } else {
        logger.info(
          `[sfmc.js] mid: ${mid} | tokenContext: ${response.res.body}`
        );
      }
    }
  );
});

module.exports = {
  logDE: (actionName) => ({
    externalKey: returnDEKey(actionName),
  }),
  getJourney: (mid, definitionId) =>
    new Promise((resolve, reject) => {
      sfmcClients[mid].get(
        {
          uri: `/interaction/v1/interactions/${definitionId}`,
          json: true,
        },
        (error, response) => {
          if (error) {
            reject(error);
          } else if ([403, 400].includes(response.res.statusCode)) {
            const errorMessage =
              response.res.body === "InteractionStudio"
                ? "Insufficient privileges to complete this action."
                : response.res.body;
            reject({ message: errorMessage });
          } else {
            resolve(response.body);
          }
        }
      );
    }),
  postDataExtensionRows: (actionName, deRows) => {
    const deExternalKey = returnDEKey(actionName);
    if (!deExternalKey) return Promise.resolve({ message: "No DE Key found" });
    return new Promise((resolve, reject) => {
      sfmcClients[SFMC_MID].post(
        {
          uri: `/data/v1/async/dataextensions/key:${deExternalKey}/rows`,
          json: true,
          body: { items: deRows },
        },
        (error, response) => {
          if (error) {
            reject(error);
          } else if ([403, 400].includes(response.res.statusCode)) {
            reject(response.res.body);
          } else {
            resolve(response.body);
          }
        }
      );
    }).catch((error) => {
      logger.error(`[sfmc.js] postDataExtensionRows: ${JSON.stringify(error)}`);
    });
  },
};
