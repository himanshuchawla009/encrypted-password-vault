/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router";
import { parse } from "query-string";
import Icon from "../../components/Icon/icon.jsx";
import Error from "../../components/Error/error.jsx";
import Loader from "../../components/Loader/loader.jsx";
import PasswordList from "../../views/Passwords/listing";
import AddPassword from "../../views/Passwords/addPassword";
import "./style.scss";

function Login() {
  const { search } = useLocation();
  const history = useHistory();

  function handleLogin() {
    history.push("/dashboard");
  }
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Protects and remembers passwords for you</h1>
      <div onClick={handleLogin} className="btn">
        Login
      </div>
    </div>
  );
}

export default Login;
