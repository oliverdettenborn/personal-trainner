import { render } from "@testing-library/react-native";
import React from "react";

import { EmptyState } from "./EmptyState";

jest.mock("react-native-svg", () => {
  const { View: MockView } = require("react-native");
  return {
    Svg: (props: any) => <MockView {...props} />,
    Path: (props: any) => <MockView {...props} />,
  };
});

describe("EmptyState", () => {
  it("renders the message text", () => {
    const { getByText } = render(
      <EmptyState message="Selecione um aluno para começar." />,
    );

    expect(getByText("Selecione um aluno para começar.")).toBeTruthy();
  });

  it("applies testID when provided", () => {
    const { getByTestId } = render(
      <EmptyState message="Test" testID="empty-state" />,
    );

    expect(getByTestId("empty-state")).toBeTruthy();
  });

  it("renders SVG icon", () => {
    const { UNSAFE_getByType } = render(<EmptyState message="Hello" />);
    const { Svg } = require("react-native-svg");

    expect(UNSAFE_getByType(Svg)).toBeTruthy();
  });
});
