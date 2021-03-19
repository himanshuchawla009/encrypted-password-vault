/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { message } from "antd";
import { useLocation, useHistory } from "react-router";
import { parse } from "query-string";
import Icon from "../../components/Icon/icon.jsx";
import Error from "../../components/Error/error.jsx";
import Loader from "../../components/Loader/loader.jsx";
import PasswordList from "../../views/Passwords/listing";
import AddPassword from "../../views/Passwords/addPassword";
import "./style.scss";

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
  const [isloading, setLoadingState] = useState(false);

  const { search } = useLocation();
  const history = useHistory();
  const [sdk, setSdk] = useState(undefined);
  useEffect(() => {
    async function initializeSdk() {
      try {
        if (sdk) return;
        setLoadingState(true);
        const sdkInstance = new OpenLogin({ clientId: verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
        // eslint-disable-next-line no-undef
        window.openlogin = sdkInstance;
        await sdkInstance.init();
        setSdk(sdkInstance);
        setLoadingState(false);

        if (sdkInstance.privKey) {
          console.log("private key: ", sdkInstance.privKey);
          // eslint-disable-next-line no-undef
          window.sessionStorage.setItem("privateKey", sdkInstance.privKey);
          history.push("/dashboard");
        }
      } catch (error) {
        console.log("Error", error);
        setLoadingState(false);
        message.error(error.message ? error.message : "Something broke!");
      }
    }

    // eslint-disable-next-line no-undef
    const privateKey = window.sessionStorage.getItem("privateKey");
    console.log(privateKey, "private key");
    if (privateKey) {
      history.push("/dashboard");
    } else {
      initializeSdk();
    }
  }, []);

  async function triggerLogin() {
    // let sdkInstance = sdk;
    // if (!sdkInstance) {
    //   sdkInstance = new OpenLogin({ clientId: verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
    //   // eslint-disable-next-line no-undef
    //   window.openlogin = sdkInstance;
    //   setSdk(sdkInstance);
    // }
    await sdk.login({
      loginProvider: "google",
      redirectUrl: "http://localhost:3020",
    });
    console.log("private key: ", sdk.privKey);
  }
  async function handleLogin() {
    await triggerLogin();
  }
  return (
    <div className="loginContainer">
      {isloading ? (
        <Loader isDone={!isloading} />
      ) : (
        <div className="loginContainer">
          <h1 style={{ textAlign: "center" }}>Protects and remembers passwords for you</h1>
          <div onClick={handleLogin} className="btn">
            Login
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
