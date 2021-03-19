/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Table, message } from "antd";
import { CopyOutlined, ShareAltOutlined, SettingOutlined, EyeOutlined } from "@ant-design/icons";
import SharePassword from "./sharePassword";
import Settings from "./settings";
import PasswordManager from "../../modules/passwordManager";
import { decrypt } from "../../utils/helpers";
import { fetchPasswordsByText } from "../../modules/apiManager";
// const PUBKEY = "042bef885573621fc4f62c748cde80f0acb92cdb39e5b1de0a8b371bf8bfb48be2a120842939edd48eacf88d0ac4d9cf4b365cf3c02e8481776a28a4ca874ba7f7";
// const PRIVATE_KEY = "3b05ede11ae205e587ec1c8baf3fe24d18f62eb34bee617bd3e8927ae1a8ca89";
function listPasswords(props) {
  const [shareModalVisible, toggleShareModal] = useState(false);
  const [settingsModalVisible, toggleSettingsModal] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [sharedUsers, setSharedUsers] = useState([]);

  const onSharePassword = () => {
    toggleShareModal(!shareModalVisible);
  };
  const handleSharePassword = async (values) => {
    try {
      console.log("valu", values, currentRow);
      const pwdManager = new PasswordManager(
        null,
        currentRow.domain,
        currentRow.ownerEmail,
        currentRow.username,
        props.userInfo.PRIVATE_KEY,
        props.userInfo.PUBKEY,
        currentRow.access,
        null
      );
      // eslint-disable-next-line no-undef
      const masterKey = JSON.parse(window.atob(currentRow.encryptedMasterKey));
      const pwd = await pwdManager.showPassword(masterKey, currentRow.encryptedPassword);
      const decMasterKey = await decrypt(Buffer.from(props.userInfo.PRIVATE_KEY, "hex"), masterKey);
      const sharePwdInstance = new PasswordManager(
        pwd,
        currentRow.domain,
        currentRow.ownerEmail,
        currentRow.username,
        props.userInfo.PRIVATE_KEY,
        props.userInfo.PUBKEY,
        "owner",
        decMasterKey.toString()
      );
      const res = await sharePwdInstance.sharePassword(values.userEmail);
      if (res.success) {
        message.success("Encrypted password shared successfully");
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
      if (error.message) {
        message.error(error.message);
      } else {
        message.error("Something broken");
      }
    }
  };

  const onSettingsClick = async () => {
    const res = await fetchPasswordsByText(currentRow.encryptedPassword);
    if (res.success) {
      setSharedUsers(res.data);
    } else {
      setSharedUsers([]);
      message.error("Something went wrong");
    }
    toggleSettingsModal(!settingsModalVisible);
  };

  const onCopy = async (value, row, type = "text") => {
    if (type === "text") {
      // eslint-disable-next-line no-undef
      await window.navigator.clipboard.writeText(value);
      message.success(`${type} copied`);
      return;
    }
    console.log("value", value, row);
    const pwdManager = new PasswordManager(null, row.domain, row.ownerEmail, row.username, props.userInfo.PRIVATE_KEY, props.userInfo.PUBKEY, null);
    // eslint-disable-next-line no-undef
    const masterKey = JSON.parse(window.atob(row.encryptedMasterKey));
    const pwd = await pwdManager.showPassword(masterKey, value);
    console.log("raw", pwd);
    // eslint-disable-next-line no-undef
    await window.navigator.clipboard.writeText(pwd);
    message.success(`${type} copied`);
  };

  const onViewPassword = async (value, row) => {
    console.log("value", value, row);
    const pwdManager = new PasswordManager(null, row.domain, row.ownerEmail, row.username, props.userInfo.PRIVATE_KEY, props.userInfo.PUBKEY, null);
    // eslint-disable-next-line no-undef
    const masterKey = JSON.parse(window.atob(row.encryptedMasterKey));
    const pwd = await pwdManager.showPassword(masterKey, value);
    console.log("raw", pwd);
    message.info(`Password: ${pwd}`, 5);
  };

  const renderContent = (value, row, index, type = "text", copy = true) => (
    <div style={{ display: "flex", flexDirection: "row", padding: 10 }}>
      {type === "password" ? <a>{"***********"}</a> : <a>{value}</a>}
      {type === "password" && <EyeOutlined style={{ cursor: "pointer", marginLeft: 5 }} onClick={() => onViewPassword(value, row, type)} />}
      {copy && <CopyOutlined style={{ cursor: "pointer", marginLeft: 5 }} onClick={() => onCopy(value, row, type)} />}
    </div>
  );

  const renderActions = (text, record) => {
    setCurrentRow(record);
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
        {record.access === "owner" && <ShareAltOutlined onClick={onSharePassword} />}
        {record.access === "owner" && <SettingOutlined onClick={onSettingsClick} />}
      </div>
    );
  };

  const columns = [
    {
      title: "Domain",
      key: "id",
      dataIndex: "domain",
      render: (value, row, index) => renderContent(value, row, index),
    },
    {
      title: "Username",
      key: "id",
      dataIndex: "username",
      render: (value, row, index) => renderContent(value, row, index),
    },
    {
      title: "Password",
      key: "id",
      dataIndex: "encryptedPassword",
      render: (value, row, index) => renderContent(value, row, index, "password"),
    },
    {
      title: "Access",
      key: "id",
      dataIndex: "access",
      render: (value, row, index) => renderContent(value, row, index, "text", false),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 100,
      render: renderActions,
    },
  ];

  const data = [
    {
      key: "1",
      domain: "www.google.com",
      username: "himanshuchawla2014@gmail.com",
      password: "0571-22098909",
    },
    {
      key: "2",
      domain: "www.google.com",
      username: "himanshuchawla2014@gmail.com",
      password: "0571-22098909",
    },
    {
      key: "3",
      domain: "www.google.com",
      username: "himanshuchawla2014@gmail.com",
      password: "0571-22098909",
    },
    {
      key: "4",
      domain: "www.google.com",
      username: "himanshuchawla2014@gmail.com",
      password: "0571-22098909",
    },
    {
      key: "5",
      domain: "www.google.com",
      username: "himanshuchawla2014@gmail.com",
      password: "0571-22098909",
    },
  ];
  console.log("props", props.passwords);
  return (
    <div>
      <SharePassword isModalVisible={shareModalVisible} closeModal={onSharePassword} handleSharePassword={handleSharePassword} />
      <Settings data={sharedUsers} isModalVisible={settingsModalVisible} closeModal={onSettingsClick} />
      <Table columns={columns} dataSource={props.passwords} bordered style={{ marginTop: 10 }} pagination={{ pageSize: 5 }} />
    </div>
  );
}

export default listPasswords;
