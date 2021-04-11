/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import OpenLogin from "openlogin";
import { useLocation, useHistory } from "react-router";
import "./style.css";

const GOOGLE = "google";
const verifiers = {
  [GOOGLE]: {
    name: "Google",
    typeOfLogin: "google",
    clientId: "221898609709-obfn3p63741l5333093430j3qeiinaa8.apps.googleusercontent.com",
    verifier: "google-lrc",
  },
};

function Login() {
  const [sdk, setSdk] = useState(undefined);
  useEffect(() => {
    async function initializeUserInfo() {
      const sdkInstance = new OpenLogin({ clientId: verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
      setSdk(sdkInstance);
    }
    initializeUserInfo();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    await sdk.login({
      extraLoginOptions: {
        login_hint: e.target[0].value,
      },
      relogin: true,
      loginProvider: "email_passwordless",
      redirectUrl: `${window.origin}/dashboard`,
    });
  }
  return (
    <div className="content-center">
      <div className="loginContainer">
        <h1 style={{ textAlign: "center" }}>Protects and remembers passwords for you</h1>
        <form onSubmit={handleLogin}>
          <div className="col">
            <div style={{ marginBottom: 20 }}>
              <input type="email" required placeholder="Email" className="custom-input" />
            </div>
            <button type="submit" className="btn-light">
              Sign in with email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
