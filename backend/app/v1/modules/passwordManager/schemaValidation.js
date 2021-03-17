const { Joi } = require("celebrate");

/**
 * Request validator middleware for the api end for services
 */
const schemaValidator = {
  fetchPasswords: {
    query: Joi.object().keys({
      access: Joi.string().valid("owner", "user"),
      pubKey: Joi.string(),
      ownerEmail: Joi.string().email(),
      userEmail: Joi.string().email(),
    }),
  },
  savePassword: {
    body: Joi.object().keys({
      encPwd: Joi.string().required(),
      encMasterKey: Joi.string().required(),
      pubKey: Joi.string().required(),
      ownerEmail: Joi.string().email().required().messages({
        "string.email": "'email' should be a valid email",
        "string.empty": "'email' cannot be an empty field",
        "any.required": "'email' is a required field",
      }),
      access: Joi.string().valid("owner", "user"),
    }),
  },
};

module.exports = schemaValidator;
