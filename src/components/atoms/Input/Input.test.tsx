import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { Input } from "./Input";

describe("Input", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(<Input placeholder="Type here" />);
    expect(getByPlaceholderText("Type here")).toBeTruthy();
  });

  it("updates value when text changes", () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Search" onChangeText={onChangeTextMock} />,
    );

    fireEvent.changeText(getByPlaceholderText("Search"), "Hello");
    expect(onChangeTextMock).toHaveBeenCalledWith("Hello");
  });

  it("renders with label if provided", () => {
    const { getByText } = render(<Input label="Name" />);
    expect(getByText("Name")).toBeTruthy();
  });

  it("renders error message when error prop is provided", () => {
    const { getByText } = render(
      <Input placeholder="Weight" error="O peso é obrigatório" />,
    );
    expect(getByText("O peso é obrigatório")).toBeTruthy();
  });

  it("does not render error text when error is undefined", () => {
    const { queryByText } = render(<Input placeholder="Weight" />);
    expect(queryByText("O peso é obrigatório")).toBeNull();
  });
});
