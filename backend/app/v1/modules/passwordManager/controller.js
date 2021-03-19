/* eslint-disable no-extra-boolean-cast */
/* eslint-disable dot-notation */
const { knexRead, knexWrite } = require("../../../../database");
const createLogger = require("../../../../helpers/createLogger");

const log = createLogger("authentication/controller.js");

const controller = Object.create(null);

const TABLE_NAME = "passwords";
const USERS_TABLE_NAME = "users";

controller.registerUser = async (req, res) => {
  try {
    const { pubKey, email } = req.body;
    const userExist = await knexRead(USERS_TABLE_NAME).where({ email });
    if (userExist.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with provided username already exists",
      });
    }
    const userObj = {
      publicKey: pubKey,
      email,
    };
    await knexWrite(USERS_TABLE_NAME).insert(userObj);
    return res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    log.error("Error while registering user", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong!",
    });
  }
};

controller.fetchUser = async (req, res) => {
  try {
    const queryKeys = Object.keys(req.query);
    queryKeys.forEach((key) => {
      console.log("key", req.query[key]);
      if (req.query[key] === "undefined") {
        req.query[key] = undefined;
      }
    });
    const { pubKey, email } = req.query;
    const searchParams = {};
    if (pubKey) {
      searchParams["publicKey"] = pubKey;
    }
    if (email) {
      searchParams["email"] = email;
    }
    const userExist = await knexRead(USERS_TABLE_NAME).where(searchParams);
    return res.json({
      success: true,
      data: userExist,
    });
  } catch (error) {
    log.error("Error while registering user", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong!",
    });
  }
};

controller.fetchPasswordsByText = async (req, res) => {
  try {
    const queryKeys = Object.keys(req.query);
    queryKeys.forEach((key) => {
      console.log("key", req.query[key]);
      if (req.query[key] === "undefined") {
        req.query[key] = undefined;
      }
    });
    const { encryptedPassword } = req.query;
    const searchParams = {};
    if (encryptedPassword) {
      searchParams["encryptedPassword"] = encryptedPassword;
    }

    const passwords = await knexRead(TABLE_NAME).where(searchParams);
    return res.json({
      success: true,
      data: passwords,
    });
  } catch (error) {
    log.error("Error while fetching passwords", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong!",
    });
  }
};

controller.savePassword = async (req, res) => {
  try {
    const { encPwd, encMasterKey, pubKey, ownerEmail, userEmail, access, username, domain, hash } = req.body;
    const userExist = await knexRead(USERS_TABLE_NAME).where({ email: userEmail });
    if (userExist.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User email not found, Please register first",
      });
    }
    const pwdObj = {
      encryptedPassword: encPwd,
      encryptedMasterKey: encMasterKey,
      publicKey: pubKey,
      ownerEmail,
      userEmail,
      access,
      username,
      domain,
      hash,
    };
    await knexWrite(TABLE_NAME).insert(pwdObj);
    return res.json({
      success: true,
      message: "Encrypted password saved successfully",
    });
  } catch (error) {
    log.error("Error while saving password", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong!",
    });
  }
};

// todo: need to add singature based authentication.
// todo: add pagination and sorting
// todo: get userEmail or ownerEmail from authentication token/signature
controller.fetchPasswords = async (req, res) => {
  try {
    const queryKeys = Object.keys(req.query);
    queryKeys.forEach((key) => {
      console.log("key", req.query[key]);
      if (req.query[key] === "undefined") {
        req.query[key] = undefined;
      }
    });
    const { access, pubKey, ownerEmail, userEmail } = req.query;
    const searchParams = {};

    if (!!access) {
      searchParams["access"] = access;
    }
    if (!!pubKey) {
      searchParams["publicKey"] = pubKey;
    }
    if (!!ownerEmail) {
      searchParams["ownerEmail"] = ownerEmail;
    }
    if (!!userEmail) {
      searchParams["userEmail"] = userEmail;
    }
    console.log("search parsm", searchParams);
    const data = await knexRead(TABLE_NAME).where(searchParams).orderBy("created_at", "desc");
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    log.error("Error while fetching passwords", error);
    return res.status(500).json({ error: "Failed to fetch passwords", success: false });
  }
};

module.exports = controller;
