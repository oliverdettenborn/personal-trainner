import { LoginForm } from "@organisms/LoginForm";
import { signIn } from "@services/authService";
import { AuthTemplate } from "@templates/AuthTemplate";
import React from "react";

export default function LoginScreen() {
  const handleSubmit = async (email: string, password: string) => {
    await signIn(email, password);
  };

  return (
    <AuthTemplate>
      <LoginForm onSubmit={handleSubmit} />
    </AuthTemplate>
  );
}
