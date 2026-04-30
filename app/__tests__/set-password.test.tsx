import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { updatePassword } from "../../src/services/authService";
import SetPasswordScreen from "../set-password";

jest.mock("../../src/services/authService", () => ({
  updatePassword: jest.fn(),
}));

describe("SetPasswordScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<SetPasswordScreen />);

    expect(getByText(/DEFINA SUA/)).toBeTruthy();
    expect(getByPlaceholderText("Mínimo 8 caracteres")).toBeTruthy();
    expect(getByPlaceholderText("Repita a senha")).toBeTruthy();
    expect(getByText("Salvar senha")).toBeTruthy();
  });

  it("shows error when fields are empty", async () => {
    const { getByText } = render(<SetPasswordScreen />);

    fireEvent.press(getByText("Salvar senha"));

    await waitFor(() => {
      expect(getByText("Por favor, preencha todos os campos.")).toBeTruthy();
    });
  });

  it("shows error when password is too short", async () => {
    const { getByText, getByPlaceholderText } = render(<SetPasswordScreen />);

    fireEvent.changeText(getByPlaceholderText("Mínimo 8 caracteres"), "123");
    fireEvent.changeText(getByPlaceholderText("Repita a senha"), "123");
    fireEvent.press(getByText("Salvar senha"));

    await waitFor(() => {
      expect(
        getByText("A senha deve ter no mínimo 8 caracteres."),
      ).toBeTruthy();
    });
  });

  it("shows error when passwords do not match", async () => {
    const { getByText, getByPlaceholderText } = render(<SetPasswordScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Mínimo 8 caracteres"),
      "password123",
    );
    fireEvent.changeText(getByPlaceholderText("Repita a senha"), "password456");
    fireEvent.press(getByText("Salvar senha"));

    await waitFor(() => {
      expect(getByText("As senhas não coincidem.")).toBeTruthy();
    });
  });

  it("calls updatePassword on valid submission", async () => {
    (updatePassword as jest.Mock).mockResolvedValue({});
    const { getByText, getByPlaceholderText } = render(<SetPasswordScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Mínimo 8 caracteres"),
      "password123",
    );
    fireEvent.changeText(getByPlaceholderText("Repita a senha"), "password123");
    fireEvent.press(getByText("Salvar senha"));

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith("password123");
    });
  });
});
