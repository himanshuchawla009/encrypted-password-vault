/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function sharePassword(props) {
  const handleCancel = () => {
    props.closeModal();
  };
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal title="Share Password" visible={props.isModalVisible} onCancel={handleCancel} footer={null}>
      <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="User email" name="userEmail" rules={[{ required: true, message: "Please enter a valid user email eg: user@gmail.com" }]}>
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Share
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default sharePassword;
