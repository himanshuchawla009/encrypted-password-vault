/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from "uuid";
import { generatePrivate, getPublic } from "@toruslabs/eccrypto";
import { post } from "@toruslabs/http-helpers";
import { SERVER_URL } from "../utils/constants";
import { decrypt, encrypt } from "../utils/helpers";
import log from "../utils/logger";
import IpfsManager from "./ipfs";
import { storePwd, listPasswords, fetchUser } from "./apiManager";

export default class PasswordManager {
  constructor(rawPassword, domain, ownerEmail, username, privateKey, pubKey, access = "owner", masterKey = null) {
    this.rawPassword = rawPassword;
    this.domain = domain;
    this.ownerEmail = ownerEmail;
    this.username = username;
    this.privateKey = privateKey;
    this.publicKey = pubKey;
    this.masterKey = masterKey;
    this.access = access;
    // IpfsManager.connect();
    // this.IpfsManager = IpfsManager;
  }

  async savePassword() {
    // eslint-disable-next-line no-undef
    const { CryptoJS } = window;
    // generate a symetric master key
    this.masterKey = this.masterKey ? this.masterKey : uuidv4();

    // encrypt pwd with master key
    const ciphertext = CryptoJS.AES.encrypt(this.rawPassword, this.masterKey).toString();
    // encrypt master key with pub key
    const encMasterKey = await encrypt(Buffer.from(this.publicKey, "hex"), Buffer.from(this.masterKey));
    console.log("master", this.masterKey, ciphertext);
    // save enc master key and password in ipfs
    let ipfsData = {
      encMasterKey,
      encPassword: ciphertext,
    };
    ipfsData = ipfsData.toString();
    const hash = ipfsData.toString("hex");
    // const hash = await this.IpfsManager.uploadToIpfs(ipfsData);
    // save enc master key , enc pwd and ipfs hash in db
    const res = await storePwd(
      ciphertext,
      // eslint-disable-next-line no-undef
      window.btoa(JSON.stringify(encMasterKey)),
      this.publicKey,
      this.ownerEmail,
      this.username,
      this.ownerEmail,
      hash,
      this.domain
    );
    return res;
  }

  async showPassword(encMasterKey, encPassword) {
    // eslint-disable-next-line no-undef
    const { CryptoJS } = window;
    if (!encMasterKey) {
      throw new Error("Invalid master key");
    }
    // decrypt master key with private key
    const decMasterKey = await decrypt(Buffer.from(this.privateKey, "hex"), encMasterKey);
    // decrypt password with master key and return
    const rawPwd = CryptoJS.AES.decrypt(encPassword, decMasterKey.toString());
    this.rawPassword = CryptoJS.enc.Latin1.stringify(rawPwd);
    this.masterKey = decMasterKey;
    return this.rawPassword;
  }

  // async changePassword(newPassword){

  // }

  async sharePassword(userEmail) {
    // eslint-disable-next-line no-undef
    const { CryptoJS } = window;
    if (this.access !== "owner") {
      throw new Error("Only password owner can share password");
    }
    if (!this.masterKey) {
      throw new Error("Invalid master key");
    }
    // fetch user pub key
    const existingUser = await fetchUser(userEmail);
    if (existingUser.data.length === 0) {
      throw new Error("Invalid user, user must be registered before password can be shared");
    }
    const userDetails = {
      publicKey: existingUser.data[0].publicKey,
    };
    // encrypt pwd with master key
    const ciphertext = CryptoJS.AES.encrypt(this.rawPassword, this.masterKey).toString();
    // encrypt master key with pub key
    const encMasterKey = await encrypt(Buffer.from(userDetails.publicKey, "hex"), Buffer.from(this.masterKey));
    // save enc master key and password in ipfs
    let ipfsData = {
      encMasterKey,
      encPassword: ciphertext,
    };
    ipfsData = ipfsData.toString("hex");
    // const hash = await this.IpfsManager.uploadToIpfs(ipfsData);

    // save enc master key , enc pwd and ipfs hash in db
    const res = await storePwd(
      ciphertext,
      // eslint-disable-next-line no-undef
      window.btoa(JSON.stringify(encMasterKey)),
      userDetails.publicKey,
      this.ownerEmail,
      userEmail,
      this.username,
      ipfsData,
      this.domain,
      "user"
    );
    return res;
  }

  // async deletePassword(){

  // }

  async checkAccess() {
    return this.access;
  }
}
