/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { parse } from "query-string";
import Icon from "../../components/Icon/icon.jsx";
import Error from "../../components/Error/error.jsx";
import Loader from "../../components/Loader/loader.jsx";
import "./style.scss";

function Start() {
  const { search } = useLocation();

  return (
    <div>
      <h1>start</h1>
    </div>
  );
}

export default Start;
