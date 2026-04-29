import { render } from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

import { AssessmentTemplate } from "./AssessmentTemplate";

// Mocking components to isolate the template test
jest.mock("../../organisms/Sidebar/Sidebar", () => {
  const { View: MockView } = require("react-native");
  return {
    Sidebar: () => <MockView testID="mock-sidebar" />,
  };
});
jest.mock("../../organisms/AssessmentForm/AssessmentForm", () => {
  const { View: MockView } = require("react-native");
  return {
    AssessmentForm: () => <MockView testID="mock-assessment-form" />,
  };
});

describe("AssessmentTemplate", () => {
  it("renders children correctly", () => {
    const { getByTestId } = render(
      <AssessmentTemplate>
        <View testID="child-content" />
      </AssessmentTemplate>,
    );

    expect(getByTestId("child-content")).toBeTruthy();
  });
});
