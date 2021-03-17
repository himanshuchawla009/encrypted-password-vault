import React from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/icon.jsx";
import "./style.scss";

const Error = (props) => {
  const { heading, subheaading, infoText } = props;
  return (
    <div className="errorContainer">
      {heading ? <span className="heading">{heading}</span> : <span className="heading">{"Something went wrong"}</span>}
      {subheaading && <span className="subheading">{subheaading}</span>}
      <div className="iconWrapper" style={{ marginTop: 10 }}>
        <Icon name="error" />
      </div>
      {infoText && <span className="text">{infoText}</span>}
    </div>
  );
};
Error.propTypes = {
  heading: PropTypes.string,
  subheaading: PropTypes.string,
  infoText: PropTypes.string,
};
export default Error;
