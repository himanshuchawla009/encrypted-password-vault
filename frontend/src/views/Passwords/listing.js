/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Table } from "antd";
import { CopyOutlined, ShareAltOutlined, SettingOutlined, EyeOutlined } from "@ant-design/icons";
import SharePassword from "./sharePassword";
import Settings from "./settings";

function listPasswords() {
  const [shareModalVisible, toggleShareModal] = useState(false);
  const [settingsModalVisible, toggleSettingsModal] = useState(false);

  const onSharePassword = () => {
    toggleShareModal(!shareModalVisible);
  };

  const onSettingsClick = () => {
    toggleSettingsModal(!settingsModalVisible);
  };

  const renderContent = (value, row, index, type = "text") => (
    <div style={{ display: "flex", flexDirection: "row", padding: 10 }}>
      {type === "password" ? <a>{"***********"}</a> : <a>{value}</a>}
      {type === "password" && <EyeOutlined style={{ cursor: "pointer", marginLeft: 5 }} />}
      <CopyOutlined style={{ cursor: "pointer", marginLeft: 5 }} />
    </div>
  );

  const renderActions = (text, record) => (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
      <ShareAltOutlined onClick={onSharePassword} />
      <SettingOutlined onClick={onSettingsClick} />
    </div>
  );

  const columns = [
    {
      title: "Domain",
      dataIndex: "domain",
      render: (value, row, index) => renderContent(value, row, index),
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (value, row, index) => renderContent(value, row, index),
    },
    {
      title: "Password",
      dataIndex: "password",
      render: (value, row, index) => renderContent(value, row, index, "password"),
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
  return (
    <div>
      <SharePassword isModalVisible={shareModalVisible} closeModal={onSharePassword} />
      <Settings isModalVisible={settingsModalVisible} closeModal={onSettingsClick} />
      <Table columns={columns} dataSource={data} bordered style={{ marginTop: 10 }} />
    </div>
  );
}

export default listPasswords;
