/* eslint-disable import/no-dynamic-require */
const express = require("express");
const glob = require("glob");

const router = express.Router();

const controllers = glob.sync("app/v1/modules/**/route.js");

controllers.forEach(async (controller) => {
  // eslint-disable-next-line security/detect-non-literal-require
  const controllerFunction = require(`../../${controller}`);
  controllerFunction(router);
});

module.exports = router;
