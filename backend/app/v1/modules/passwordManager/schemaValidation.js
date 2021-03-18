const { Joi } = require("celebrate");

/**
 * Request validator middleware for the api end for services
 */
const schemaValidator = {
  fetchPasswords: {
    query: Joi.object().keys({
      access: Joi.string().valid("owner", "user"),
      pubKey: Joi.string(),
      ownerEmail: Joi.string(),
      userEmail: Joi.string(),
    }),
  },
  savePassword: {
    body: Joi.object().keys({
      encPwd: Joi.string().required(),
      encMasterKey: Joi.string().required(),
      pubKey: Joi.string().required(),
      hash: Joi.string().required(),
      username: Joi.string().required(),
      domain: Joi.string().required(),
      ownerEmail: Joi.string().required(),
      userEmail: Joi.string().required(),
      access: Joi.string().valid("owner", "user"),
    }),
  },
  registerUser: {
    body: Joi.object().keys({
      pubKey: Joi.string().required(),
      email: Joi.string().required(),
    }),
  },
  fetchUser: {
    query: Joi.object().keys({
      pubKey: Joi.string(),
      email: Joi.string(),
    }),
  },
};

module.exports = schemaValidator;
