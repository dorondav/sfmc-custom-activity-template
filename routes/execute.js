const logger = require("../lib/logger");
const sfmc = require("../lib/sfmc");
const axios = require("axios");

const { FREESBE_URL, FREESBE_PASSWORD, FREESBE_USERNAME } = process.env;

const validateRequest = (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error("Invalid Request - Missing Body Parameters");
  }

  if (!req.body.inArguments || req.body.inArguments.length === 0) {
    throw new Error("Invalid Request - Missing inArguments Parameters");
  }

  if (!req.query.mid) {
    throw new Error("Invalid Request - Missing Required Parameters");
  }
};

const getBusinessUnit = (mid) => {
  const buName = {
    100008282: "Carasso Motors",
    100014071: "Alpine",
    515011822: "Chery",
    100014069: "Dacia",
    100014070: "Infiniti",
    100014072: "Freesbe",
    100014067: "Nissan",
    100014068: "Renault",
    100041130: "Xpeng",
  };
  return buName[mid];
};

const transformUrl = (inArguments, mid) => {
  let url = inArguments.url;
  if (url === "freeTextLink") {
    url = inArguments.freeTextLink;
  } else if (url === "warrantyLink") {
    const orderId = inArguments.orderId;
    const bu = getBusinessUnit(mid);
    if (!orderId || !bu) {
      throw new Error("Invalid Request - Missing orderId or bu");
    }
    const orderIdBase64Encoded = Buffer.from(orderId).toString("base64");
    url = `https://cloud.info.${bu.toLowerCase()}.co.il/WarrantyAgreement?or=${orderIdBase64Encoded}`;
  }
  return url;
};

const getPayload = (inArguments, mid) => {
  const url = transformUrl(inArguments, mid);
  const date = Date.now();
  const {
    notificationDesc,
    notificationTitle,
    licenseNumber,
    sendId,
    image,
    notificationType,
  } = inArguments;

  return JSON.stringify({
    licenseNumber,
    notificationType,
    notificationTitle,
    notificationDesc,
    date,
    url,
    sendId,
    image,
  });
};

const handleAxiosResponse = async (response, req, payload, contactKey) => {
  payload = JSON.parse(payload);
  const sentPayload = {
    ...payload,
    activityObjectID: req.body.activityObjectID,
    journeyID: req.body.journeyId,
    mid: req.query.mid,
    businessUnit: getBusinessUnit(req.query.mid),
    apiResponse: response.data,
    contactKey,
  };
  await sfmc.postDataExtensionRows("sent", [sentPayload]).then((response) => {
    logger.info(`[execute.js] SENT DE INSERT : ${JSON.stringify(response)}`);
  });
  return response.data;
};

const handleAxiosError = async (error, req, payload, contactKey) => {
  payload = JSON.parse(payload);

  const errorPayload = {
    status: error.response ? error.response.status : error.status,
    errorMsg: error.message,
    errorSource: "execute",
    journeyID: req.body.journeyId,
    mid: req.query.mid,
    businessUnit: getBusinessUnit(req.query.mid),
    apiResponse: error.response ? error.response.data : null, // Avoid circular reference
    contactKey,
    ...payload,
  };

  await sfmc.postDataExtensionRows("error", [errorPayload]).then((response) => {
    logger.info(`[execute.js] ERROR DE INSERT : ${JSON.stringify(response)}`);
  });

  logger.error(
    `[execute.js] Axios POST error: ${error.message}` // Avoid circular reference
  );
  return errorPayload;
};

module.exports = async (req, res) => {
  let statusCode, jsonResult;
  try {
    validateRequest(req);

    const payload = getPayload(req.body.inArguments[0], req.query.mid);
    const token = `${FREESBE_USERNAME}:${FREESBE_PASSWORD}`;
    const encodedToken = Buffer.from(token).toString("base64");

    const contactKey = req.body.inArguments[0].contactKey;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: FREESBE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + encodedToken,
      },
      data: payload,
    };

    axios
      .request(config)
      .then(async (response) => {
        jsonResult = await handleAxiosResponse(
          response,
          req,
          payload,
          contactKey
        );
        statusCode = 200;

        console.log(
          `[execute.js] Axios POST response: ${JSON.stringify(response.data)}`
        );
        res.status(statusCode).json({ statusCode, result: jsonResult });
      })
      .catch(async (error) => {
        jsonResult = await handleAxiosError(error, req, payload, contactKey);
        statusCode = 500;
        res.status(statusCode).json({ statusCode, jsonResult });
      });
  } catch (error) {
    statusCode = 500;
    jsonResult = { error: error.message };
    res.status(statusCode).json({ statusCode, result: jsonResult });
  }
};
