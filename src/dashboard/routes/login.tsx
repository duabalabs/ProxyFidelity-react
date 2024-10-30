import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AuthPage, useModalForm } from "@refinedev/antd";
import { useLogin } from "@refinedev/core";

import { Button, Form, Input, message, Modal, Spin } from "antd";
import Parse from "parse";

import { Title } from "@/dashboard/components";

import { Project, PROJECT_CLASSNAME } from "../lib";

type FormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  projectName: string;
  projectDescription: string;
};

type FieldConfig = {
  label: string;
  name: keyof FormValues;
  placeholder: string;
  rules: any[];
  type?: string;
  initialValue?: string;
};

// Configuration for the form fields
const formFields: FieldConfig[] = [
  {
    label: "Full Name",
    name: "fullName",
    placeholder: "Enter your full name",
    rules: [{ required: true, message: "Please enter your full name" }],
    initialValue: "Manny Opp",
  },
  {
    label: "Email",
    name: "email",
    placeholder: "Enter your email",
    rules: [
      { required: true, type: "email", message: "Please enter a valid email" },
    ],
    initialValue: "duabalabs@gmail.com",
  },
  {
    label: "Phone Number",
    name: "phoneNumber",
    placeholder: "Enter your phone number",
    rules: [{ required: true, message: "Please enter your phone number" }],
    initialValue: "+233592838383",
  },
  {
    label: "Company Name",
    name: "companyName",
    placeholder: "Enter your company name",
    rules: [{ required: true, message: "Please enter your company name" }],
    initialValue: "DuabaLabs",
  },
  {
    label: "Project Name",
    name: "projectName",
    placeholder: "Enter your project name",
    rules: [{ required: true, message: "Please enter your project name" }],
    initialValue: "FarmLand",
  },
  {
    label: "Project Description",
    name: "projectDescription",
    placeholder: "Describe your project",
    rules: [{ required: true, message: "Please enter a project description" }],
    type: "textarea",
    initialValue: "A Land to use for farming",
  },
];

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { mutate } = useLogin();
  const { formProps, modalProps, show, close, onFinish } =
    useModalForm<Project>({
      action: "create",
      resource: PROJECT_CLASSNAME,
    });

  const form = formProps.form;
  const emailFromSearchParams = searchParams.get("email");
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const [loading, setLoading] = useState(false);

  const initialValues = emailFromSearchParams
    ? { email: emailFromSearchParams }
    : {};

  useEffect(() => {
    if (accessToken && refreshToken) {
      mutate({
        accessToken,
        refreshToken,
      });
    }
  }, [accessToken, refreshToken]);

  const handleOnFinish = useCallback(
    async (values: FormValues) => {
      setLoading(true);
      console.log("values", values);
      try {
        await Parse.Cloud.run("requestProject", values);
        message.success(
          "Project request has been submitted successfully. The team will reach out to you soon!"
        );
        form.resetFields(); // Reset the form after successful addition
        close(); // Close the modal after files are added to the queue
      } catch (error) {
        console.error(`Unable to create project at this time`, error);
        message.error(
          "Unable to create project at this time. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    },
    [form, close]
  );

  return (
    <>
      <AuthPage
        type="login"
        registerLink={false}
        formProps={{
          initialValues,
        }}
        contentProps={{
          styles: {
            actions: {
              "--ant-card-actions-li-margin": "0",
            } as any,
          },
          actions: [
            <Button type="primary" size="large" block onClick={() => show()}>
              Create Your First Project
            </Button>,
          ],
        }}
        title={<Title collapsed={false} />}
      />

      {/* Project Creation Modal using useModalForm */}

      <Modal
        title="Create Your First Project"
        {...modalProps}
        onCancel={close}
        okText="Create Project"
        // okButtonProps={{ loading }} // Show loading state on button
      >
        <Spin spinning={loading}>
          <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
            {formFields.map((field) => (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                initialValue={field.initialValue}
                rules={field.rules}
              >
                {field.type === "textarea" ? (
                  <Input.TextArea placeholder={field.placeholder} rows={4} />
                ) : (
                  <Input placeholder={field.placeholder} />
                )}
              </Form.Item>
            ))}
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
