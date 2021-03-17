import React from "react";
import PropTypes from "prop-types";
import MailIcon from "../../assets/icons/mail.svg";
import ErrorIcon from "../../assets/icons/error.svg";

const icons = {
  mail: MailIcon,
  error: ErrorIcon,
};
const Icon = (props) => {
  const { name, iconStyle } = props;
  const iconSrc = icons[name];
  return (
    <div>
      <img src={iconSrc} alt={`"${name}"`} style={{ ...iconStyle }} />
    </div>
  );
};
Icon.propTypes = {
  name: PropTypes.string,
  iconStyle: PropTypes.object,
};
export default Icon;
