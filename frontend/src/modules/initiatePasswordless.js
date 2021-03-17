import { generatePrivate, getPublic } from "@toruslabs/eccrypto";
import { io } from "socket.io-client";
import { post } from "@toruslabs/http-helpers";
import { METADATA_SERVER_URL, AUTH_SERVER_URL } from "../utils/constants";
import { queryToJson, decrypt, jsonToHash } from "../utils/helpers";
import log from "../utils/logger";

export default class PasswordLess {
  constructor(currentHref) {
    this.SOCKET_CONN = io(METADATA_SERVER_URL, {
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 10,
    });

    this.authStartApi = `${AUTH_SERVER_URL}/api/v1/auth/passwordless/start`;
    this.passwordlessParams = queryToJson(currentHref);
    console.log(this.passwordlessParams, "params");
    this.LINK_EXPIRY_TIME = 300000;
    this.expiryTimer = null;
    this.tempPrivateKey = null;
  }

  async waitForVerification() {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      // disconnect polling after timeout
      this.expiryTimer = setTimeout(() => {
        const ev = {
          error: "Magic link expired",
          data: undefined,
        };
        this.SOCKET_CONN.disconnect();
        resolve(ev);
      }, this.LINK_EXPIRY_TIME);

      // update window status on success message
      this.SOCKET_CONN.on("success", async (encryptedMessage) => {
        console.log("received socket res", encryptedMessage);
        const decryptedData = await decrypt(this.tempPrivateKey, encryptedMessage);
        const decryptedJson = JSON.parse(decryptedData.toString());
        const data = {
          state: decryptedJson.state,
          access_token: "",
          id_token: decryptedJson.id_token,
        };
        const ev = {
          error: undefined,
          data,
        };
        this.SOCKET_CONN.disconnect();
        clearTimeout(this.expiryTimer);
        resolve(ev);
      });

      // update window status on error message
      this.SOCKET_CONN.on("error", (err) => {
        const ev = {
          error: err,
          data: undefined,
        };
        this.SOCKET_CONN.disconnect();
        clearTimeout(this.expiryTimer);
        resolve(ev);
      });
    });
  }

  async handleStartWindow() {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this.tempPrivateKey = generatePrivate();
      const tempPubKey = getPublic(this.tempPrivateKey);
      const finalParams = {
        ...this.passwordlessParams,
        tempPubKey: tempPubKey.toString("hex"),
      };

      // send email request and start polling for authentication status
      if (this.SOCKET_CONN.connected) {
        post(this.authStartApi, finalParams)
          .then((response) => {
            console.log("posted", response);
            this.SOCKET_CONN.emit("check_auth_status", tempPubKey.toString("hex"));
            const ev = {
              error: undefined,
              data: "Verification link sent",
            };
            resolve(ev);
          })
          .catch((error) => {
            log.error(error);
            reject(error);
          });
      } else {
        this.SOCKET_CONN.on("connect", async () => {
          post(this.authStartApi, finalParams)
            .then((response) => {
              console.log("posted", response);
              this.SOCKET_CONN.emit("check_auth_status", tempPubKey.toString("hex"));
              // disconnect polling after timeout
              const ev = {
                error: undefined,
                data: "Verification link sent",
              };
              resolve(ev);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        });
      }

      // handles connection failure after max reconnection retries
      this.SOCKET_CONN.io.on("reconnect_failed", () => {
        log.error("Socket connection max attempts");
        resolve({ error: "Something went wrong!", data: undefined });
      });
      this.SOCKET_CONN.io.on("connect_timeout", (timeout) => {
        log.error("Socket connection timeout", timeout);
        resolve({ error: "Something went wrong!", data: undefined });
      });
    });
  }

  redirectToClient(jsonData) {
    const redirectUri = this.passwordlessParams.redirect_uri;
    const redirectionUrl = jsonToHash(redirectUri, jsonData);
    // eslint-disable-next-line no-undef
    window.location.href = redirectionUrl;
  }
}
