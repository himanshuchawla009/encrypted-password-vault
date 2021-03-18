/* eslint-disable no-undef */
import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/login";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.scss";

function App() {
  useEffect(() => {
    const cryptoJsScript = document.createElement("script");
    cryptoJsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js";
    cryptoJsScript.async = true;

    document.body.appendChild(cryptoJsScript);

    const ipfsClientScript = document.createElement("script");
    ipfsClientScript.src = "https://cdn.jsdelivr.net/npm/ipfs-http-client/dist/index.min.js";
    ipfsClientScript.async = true;
    document.body.appendChild(ipfsClientScript);
  });
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/dashboard" exact>
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
