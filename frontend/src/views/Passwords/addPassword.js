/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function addPassword(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    console.log("opening");

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    props.handleSavePassword(values);
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="iconWrapper" style={{ cursor: "pointer" }}>
      <PlusCircleOutlined style={{ fontSize: "45px", color: "#08c" }} onClick={showModal} />
      <Modal title="Add Password" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item label="Domain" name="domain" rules={[{ required: true, message: "Please enter a valid domain eg: mail.gmail.com" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter a valid username eg: user@gmail.com" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default addPassword;
