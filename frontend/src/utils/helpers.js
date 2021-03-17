import { encrypt as ecEncrypt, decrypt as ecDecrypt } from "@toruslabs/eccrypto";

export async function encrypt(publicKey, msg) {
  const encryptedDetails = await ecEncrypt(publicKey, msg);

  return {
    ciphertext: encryptedDetails.ciphertext.toString("hex"),
    ephemPublicKey: encryptedDetails.ephemPublicKey.toString("hex"),
    iv: encryptedDetails.iv.toString("hex"),
    mac: encryptedDetails.mac.toString("hex"),
  };
}

export async function decrypt(privKey, msg) {
  const bufferEncDetails = {
    ciphertext: Buffer.from(msg.ciphertext, "hex"),
    ephemPublicKey: Buffer.from(msg.ephemPublicKey, "hex"),
    iv: Buffer.from(msg.iv, "hex"),
    mac: Buffer.from(msg.mac, "hex"),
  };

  return ecDecrypt(privKey, bufferEncDetails);
}

export function jsonToQuery(url, jsonData) {
  const finalUrl = new URL(url);
  Object.keys(jsonData).forEach((key) => {
    if (jsonData[key]) finalUrl.searchParams.append(key, jsonData[key]);
  });

  return finalUrl;
}

export function jsonToHash(url, jsonData) {
  const params = new URLSearchParams();

  Object.keys(jsonData).forEach((key) => {
    if (jsonData[key]) params.append(key, jsonData[key]);
  });
  const finalUrl = `${url}/#${params}`;
  return finalUrl;
}

export function queryToJson(url) {
  const finalUrl = new URL(url);
  const { searchParams } = finalUrl;
  const jsonParams = {};
  searchParams.forEach((val, key) => {
    jsonParams[key] = val;
  });
  return jsonParams;
}
