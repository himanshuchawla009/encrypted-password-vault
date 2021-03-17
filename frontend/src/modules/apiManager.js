/* eslint-disable no-unused-vars */
import { generatePrivate, getPublic } from "@toruslabs/eccrypto";
import { post, get } from "@toruslabs/http-helpers";
import { SERVER_URL } from "../utils/constants";
import { decrypt, encrypt } from "../utils/helpers";
import log from "../utils/logger";

const BASE_URL = `${SERVER_URL}/api/v1/auth`;

export async function listPasswords(publicKey, access = "all") {
  const finalUrl = `${BASE_URL}/listPasswords?publicKey=${publicKey}&access=${access}`;
  const res = await get(finalUrl);
  return res;
}

export async function storePwd(encPwd, encMasterKey, pubKey, ownerEmail, access = "owner") {
  const finalUrl = `${BASE_URL}/savePassword`;
  const data = {
    encPwd,
    encMasterKey,
    pubKey,
    ownerEmail,
    access,
  };
  const res = await post(finalUrl, data);
  return res;
}
