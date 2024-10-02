import React from "react";

import { AuthPage } from "@refinedev/antd";

import { Title } from "@/dashboard/components";

export const ForgotPasswordPage: React.FC = () => {
  return <AuthPage type="forgotPassword" title={<Title collapsed={false} />} />;
};
