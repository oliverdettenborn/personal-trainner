import { SetPasswordForm } from "@organisms/SetPasswordForm";
import { updatePassword } from "@services/authService";
import { AuthTemplate } from "@templates/AuthTemplate";
import { useRouter } from "expo-router";
import React from "react";

export default function SetPasswordScreen() {
  const router = useRouter();

  const handleSubmit = async (password: string) => {
    await updatePassword(password);
    router.replace("/");
  };

  return (
    <AuthTemplate>
      <SetPasswordForm onSubmit={handleSubmit} />
    </AuthTemplate>
  );
}
