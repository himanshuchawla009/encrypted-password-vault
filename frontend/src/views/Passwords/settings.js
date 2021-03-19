/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function sharePassword(props) {
  const handleCancel = () => {
    props.closeModal();
  };

  const renderActions = (text, record) => (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
      <DeleteOutlined style={{ color: "red", cursor: "pointer" }} disabled />
    </div>
  );
  const renderContent = (value, row, index, type = "text") => (
    <div style={{ display: "flex", flexDirection: "row", padding: 10 }}>
      <a>{value}</a>
    </div>
  );
  const columns = [
    {
      title: "User",
      dataIndex: "username",
      render: (value, row, index) => renderContent(value, row, index),
    },
    {
      title: "Shared At",
      dataIndex: "created_at",
      render: (value, row, index) => renderContent(value, row, index),
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
      user: "himanshu@tor.us",
      created_at: "7-march-2021",
    },
    {
      key: "2",
      domain: "www.google.com",
      user: "himanshuchawla2014@gmail.com",
      created_at: "7-march-2021",
    },
  ];
  return (
    <Modal title="Share Password" visible={props.isModalVisible} onCancel={handleCancel} footer={null}>
      <Table columns={columns} dataSource={props.data} bordered style={{ marginTop: 10 }} />
    </Modal>
  );
}

export default sharePassword;
