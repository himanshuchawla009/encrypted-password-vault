/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { message, PageHeader, Button } from "antd";
import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router";
import { getPublic } from "@toruslabs/eccrypto";
import OpenLogin from "@toruslabs/openlogin";
import Loader from "../../components/Loader/loader.jsx";
import PasswordList from "../../views/Passwords/listing";
import AddPassword from "../../views/Passwords/addPassword";
import PasswordManager from "../../modules/passwordManager";
import { listPasswords, fetchUser, registerUser } from "../../modules/apiManager";
import NewUser from "../../views/Passwords/newUser";
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

// const PUBKEY = "042bef885573621fc4f62c748cde80f0acb92cdb39e5b1de0a8b371bf8bfb48be2a120842939edd48eacf88d0ac4d9cf4b365cf3c02e8481776a28a4ca874ba7f7";
// const PRIVATE_KEY = "3b05ede11ae205e587ec1c8baf3fe24d18f62eb34bee617bd3e8927ae1a8ca89";
function Home() {
  const [sdk, setSdk] = useState(undefined);
  const { search } = useLocation();
  const history = useHistory();
  const [isloading, setLoadingState] = useState(false);
  const [isNewUser, setNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState({});
  const [userInfo, setUserInfo] = useState({
    OWNER_EMAIL: undefined,
    PUBKEY: undefined,
    PRIVATE_KEY: undefined,
  });
  const [passwords, setPasswords] = useState([]);
  const getPasswords = async (OWNER_EMAIL, PUBKEY) => {
    const res = await listPasswords(undefined, OWNER_EMAIL, PUBKEY, undefined);
    setPasswords(res.data);
  };

  useEffect(() => {
    async function initializeUserInfo() {
      if (sdk) return;
      const sdkInstance = new OpenLogin({ clientId: verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
      // eslint-disable-next-line no-undef
      window.openlogin = sdkInstance;
      setSdk(sdkInstance);
      // eslint-disable-next-line no-undef
      const privateKey = window.sessionStorage.getItem("privateKey");
      console.log(privateKey, "private key");
      if (!privateKey) {
        history.push("/");
        return;
      }
      const pubKey = await getPublic(Buffer.from(privateKey, "hex"));
      const user = await fetchUser(undefined, pubKey.toString("hex"));
      if (user.data.length > 0) {
        setUserInfo({
          OWNER_EMAIL: user.data[0].email,
          PUBKEY: pubKey.toString("hex"),
          PRIVATE_KEY: privateKey,
        });
        const res = await listPasswords(undefined, user.data[0].email, pubKey.toString("hex"), undefined);
        setPasswords(res.data);
      } else {
        // register user first
        setNewUserData({
          PUBKEY: pubKey.toString("hex"),
          PRIVATE_KEY: privateKey,
        });
        setNewUser(true);
      }
    }
    initializeUserInfo();
  }, []);

  const savePassword = async (pwdObj) => {
    try {
      setLoadingState(true);
      const { domain, password, username } = pwdObj;
      const { OWNER_EMAIL, PRIVATE_KEY, PUBKEY } = userInfo;
      const pwManager = new PasswordManager(password, domain, username, OWNER_EMAIL, PRIVATE_KEY, PUBKEY);
      const res = await pwManager.savePassword();
      console.log("res", res);
      if (res.success) {
        message.success(res.message);
        await getPasswords(OWNER_EMAIL, PUBKEY);
      } else {
        message.error(res.message);
      }
      setLoadingState(false);
    } catch (error) {
      console.log("Error while saving password", error);
      setLoadingState(false);
      message.error("Something went wrong");
    }
  };

  const handleRegisterUser = async (values) => {
    try {
      const { email } = values;
      setLoadingState(true);
      await registerUser(email, newUserData.PUBKEY);
      setUserInfo({
        OWNER_EMAIL: email,
        ...newUserData,
      });
      const res = await listPasswords(undefined, email, newUserData.PUBKEY, undefined);
      if (res.success) {
        setPasswords(res.data);
        setNewUser(false);
        setLoadingState(false);
      } else {
        console.log(res.message, "err");
        message.error(res.message);
      }
    } catch (error) {
      console.log(error, "err");
      if (error.type === "cors") {
        const errDesc = await error.json();
        message.error(errDesc.message ? errDesc.message : "Something broke!");
      } else {
        message.error(error.message ? error.message : "Something broke!");
      }
    }
  };

  const handleLogout = async () => {
    setLoadingState(true);
    // eslint-disable-next-line no-undef
    const windowObj = window;
    await sdk.logout();
    windowObj.sessionStorage.removeItem("privateKey");
    setLoadingState(false);
    history.push("/");
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Your secrets are safe here"
        extra={[
          <Button key="1" type="primary" onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      />
      ,
      <NewUser isModalVisible={isNewUser} registerUser={handleRegisterUser} />
      {isloading ? (
        <Loader isDone={!isloading} />
      ) : (
        <div className="container">
          <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <h1 style={{ textAlign: "center", marginRight: "100px" }}>Passwords</h1>
            <AddPassword handleSavePassword={savePassword} />
          </div>
          <PasswordList passwords={passwords} userInfo={userInfo} />
        </div>
      )}
    </div>
  );
}

export default Home;
