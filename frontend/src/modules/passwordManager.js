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
  constructor(rawPassword, domain, ownerEmail, privateKey, pubKey, access = "owner", masterKey = null) {
    this.rawPassword = rawPassword;
    this.domain = domain;
    this.ownerEmail = ownerEmail;
    this.privateKey = privateKey;
    this.publicKey = pubKey;
    this.masterKey = masterKey;
    this.access = access;
    IpfsManager.connect();
    this.IpfsManager = IpfsManager;
  }

  async savePassword() {
    // eslint-disable-next-line no-undef
    const { CryptoJS } = window;
    // generate a symetric master key
    this.masterKey = this.masterKey ? this.masterKey : uuidv4();

    // encrypt pwd with master key
    const ciphertext = CryptoJS.AES.encrypt(this.rawPassword, this.masterKey).toString();
    // encrypt master key with pub key
    const encMasterKey = await encrypt(this.publicKey, this.masterKey);
    // save enc master key and password in ipfs
    let ipfsData = {
      encMasterKey,
      encPassword: ciphertext,
    };
    ipfsData = ipfsData.toString();
    const hash = await this.IpfsManager.uploadToIpfs(ipfsData);
    // save enc master key , enc pwd and ipfs hash in db
    await storePwd(ciphertext, encMasterKey, this.publicKey, this.ownerEmail, this.ownerEmail);
    return hash;
  }

  async showPassword() {
    // eslint-disable-next-line no-undef
    const { CryptoJS } = window;
    if (!this.masterKey) {
      throw new Error("Invalid master key");
    }
    // decrypt master key with private key
    const decMasterKey = await decrypt(this.privateKey, this.masterKey);
    // decrypt password with master key and return
    const rawPwd = CryptoJS.AES.decrypt(this.rawPassword, decMasterKey).toString();
    return rawPwd;
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
    if (!existingUser.data) {
      throw new Error("Invalid user, user must be registered before password can be shared");
    }
    const userDetails = {
      publicKey: existingUser.data.publicKey,
    };
    // encrypt pwd with master key
    const ciphertext = CryptoJS.AES.encrypt(this.rawPassword, this.masterKey).toString();
    // encrypt master key with pub key
    const encMasterKey = await encrypt(userDetails.publicKey, this.masterKey);
    // save enc master key and password in ipfs
    let ipfsData = {
      encMasterKey,
      encPassword: ciphertext,
    };
    ipfsData = ipfsData.toString();
    const hash = await this.IpfsManager.uploadToIpfs(ipfsData);

    // save enc master key , enc pwd and ipfs hash in db
    await storePwd(ciphertext, encMasterKey, userDetails.publicKey, this.ownerEmail, userEmail, "user");
    return hash;
  }

  // async deletePassword(){

  // }

  async checkAccess() {
    return this.access;
  }
}
