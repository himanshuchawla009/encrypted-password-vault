/* eslint-disable no-unused-vars */
import { generatePrivate, getPublic } from "@toruslabs/eccrypto";
import { post, get } from "@toruslabs/http-helpers";
import { SERVER_URL } from "../utils/constants";
import { decrypt, encrypt } from "../utils/helpers";
import log from "../utils/logger";

const BASE_URL = `${SERVER_URL}/api/v1/passwordManager`;

export async function listPasswords(ownerEmail, userEmail, pubKey, access) {
  const finalUrl = `${BASE_URL}/fetchPasswords?pubKey=${pubKey}&access=${access}&ownerEmail=${ownerEmail}&userEmail=${userEmail}`;
  const res = await get(finalUrl);
  return res;
}

export async function storePwd(encPwd, encMasterKey, pubKey, ownerEmail, userEmail, username, hash, domain, access = "owner") {
  const finalUrl = `${BASE_URL}/savePassword`;
  const data = {
    encPwd,
    encMasterKey,
    pubKey,
    ownerEmail,
    userEmail,
    access,
    username,
    hash,
    domain,
  };
  const res = await post(finalUrl, data);
  return res;
}

export async function fetchUser(userEmail, pubKey) {
  const finalUrl = `${BASE_URL}/fetchUser?pubKey=${pubKey}&email=${userEmail}`;
  const res = await get(finalUrl);
  return res;
}

export async function fetchPasswordsByText(encryptedPassword) {
  const finalUrl = `${BASE_URL}/fetchPasswordsByText?encryptedPassword=${encryptedPassword}`;
  const res = await get(finalUrl);
  return res;
}

export async function registerUser(userEmail, pubKey) {
  const data = {
    email: userEmail,
    pubKey,
  };
  const finalUrl = `${BASE_URL}/registerUser`;
  const res = await post(finalUrl, data);
  return res;
}
