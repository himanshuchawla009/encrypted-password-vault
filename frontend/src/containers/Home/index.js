/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router";
import { getPublic } from "@toruslabs/eccrypto";
import { parse } from "query-string";
import { func } from "prop-types";
import Icon from "../../components/Icon/icon.jsx";
import Error from "../../components/Error/error.jsx";
import Loader from "../../components/Loader/loader.jsx";
import PasswordList from "../../views/Passwords/listing";
import AddPassword from "../../views/Passwords/addPassword";
import PasswordManager from "../../modules/passwordManager";
import { listPasswords, fetchUser, registerUser } from "../../modules/apiManager";
import NewUser from "../../views/Passwords/newUser";
import "./style.scss";

// const PUBKEY = "042bef885573621fc4f62c748cde80f0acb92cdb39e5b1de0a8b371bf8bfb48be2a120842939edd48eacf88d0ac4d9cf4b365cf3c02e8481776a28a4ca874ba7f7";
// const PRIVATE_KEY = "3b05ede11ae205e587ec1c8baf3fe24d18f62eb34bee617bd3e8927ae1a8ca89";
function Home() {
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
    const res = await listPasswords(undefined, OWNER_EMAIL, PUBKEY, "owner");
    setPasswords(res.data);
  };

  useEffect(() => {
    async function initializeUserInfo() {
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
        const res = await listPasswords(undefined, user.data[0].email, pubKey.toString("hex"), "owner");
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
    const { email } = values;
    setLoadingState(true);
    await registerUser(email, newUserData.PUBKEY);
    setUserInfo({
      OWNER_EMAIL: email,
      ...newUserData,
    });
    const res = await listPasswords(undefined, email, newUserData.PUBKEY, "owner");
    setPasswords(res.data);
    setNewUser(false);
    setLoadingState(false);
  };

  return (
    <div className="container">
      <NewUser isModalVisible={isNewUser} registerUser={handleRegisterUser} />
      {isloading ? (
        <Loader isDone={!isloading} />
      ) : (
        <div className="container">
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "80%" }}>
            <h1 style={{ textAlign: "center" }}>Passwords</h1>
            <AddPassword handleSavePassword={savePassword} />
          </div>
          <PasswordList passwords={passwords} userInfo={userInfo} />
        </div>
      )}
    </div>
  );
}

export default Home;
