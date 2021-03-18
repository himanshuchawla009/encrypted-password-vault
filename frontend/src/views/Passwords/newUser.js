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

function newUser(props) {
  const onFinish = (values) => {
    console.log("Success:", values);
    props.registerUser(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal title="Share Password" visible={props.isModalVisible} footer={null}>
      <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="Username" name="email" rules={[{ required: true, message: "Please add your username" }]}>
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default newUser;
