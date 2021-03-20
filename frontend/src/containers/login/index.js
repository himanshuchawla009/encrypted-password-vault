/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router";
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
  const history = useHistory();
  async function handleLogin() {
    history.push({
      pathname: "/dashboard",
    });
  }
  return (
    <div className="loginContainer">
      <div className="loginContainer">
        <h1 style={{ textAlign: "center" }}>Protects and remembers passwords for you</h1>
        <div onClick={handleLogin} className="btn">
          Login
        </div>
      </div>
    </div>
  );
}

export default Login;
