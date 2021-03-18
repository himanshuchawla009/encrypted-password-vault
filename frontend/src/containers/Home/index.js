/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { parse } from "query-string";
import Icon from "../../components/Icon/icon.jsx";
import Error from "../../components/Error/error.jsx";
import Loader from "../../components/Loader/loader.jsx";
import PasswordList from "../../views/Passwords/listing";
import AddPassword from "../../views/Passwords/addPassword";
import "./style.scss";

function Start() {
  const { search } = useLocation();

  return (
    <div className="container">
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "80%" }}>
        <h1 style={{ textAlign: "center" }}>Passwords</h1>
        <AddPassword />
      </div>
      <PasswordList />
    </div>
  );
}

export default Start;
