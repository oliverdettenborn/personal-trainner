import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { signIn } from "../../src/services/authService";
import LoginScreen from "../login";

jest.mock("../../src/services/authService", () => ({
  signIn: jest.fn(),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText(/ÁREA DO/)).toBeTruthy();
    expect(getByPlaceholderText("seu@email.com")).toBeTruthy();
    expect(getByPlaceholderText("••••••••")).toBeTruthy();
    expect(getByText("Entrar")).toBeTruthy();
  });

  it("shows error when fields are empty", async () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(getByText("Por favor, preencha todos os campos.")).toBeTruthy();
    });
    expect(signIn).not.toHaveBeenCalled();
  });

  it("calls signIn with email and password", async () => {
    (signIn as jest.Mock).mockResolvedValue({ id: "u1" });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("seu@email.com"),
      "test@test.com",
    );
    fireEvent.changeText(getByPlaceholderText("••••••••"), "password123");
    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("test@test.com", "password123");
    });
  });

  it("shows error on failed login", async () => {
    (signIn as jest.Mock).mockRejectedValue(new Error("Invalid"));
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("seu@email.com"),
      "test@test.com",
    );
    fireEvent.changeText(getByPlaceholderText("••••••••"), "wrong");
    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(getByText("E-mail ou senha inválidos.")).toBeTruthy();
    });
  });
});
