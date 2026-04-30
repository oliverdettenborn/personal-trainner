import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { AssessmentForm } from "./AssessmentForm";
import { Assessment } from "../../../types/assessment";

// Mocking react-native-svg
jest.mock("react-native-svg", () => {
  const { View: MockView } = require("react-native");
  return {
    Svg: (props: any) => <MockView {...props} />,
    Path: (props: any) => <MockView {...props} />,
  };
});

// Mocking child components
jest.mock("../../molecules/PhotoSection/PhotoSection", () => {
  const { View: MockView, Text: MockText } = require("react-native");
  return {
    PhotoSection: ({ assessmentData }: any) => (
      <MockView testID="mock-photo-section">
        <MockText>{assessmentData?.front_before_date || "No Date"}</MockText>
      </MockView>
    ),
  };
});

jest.mock("../../molecules/FeedbackPanel/FeedbackPanel", () => {
  const { View: MockView, Text: MockText } = require("react-native");
  return {
    FeedbackPanel: ({ title, highlightedTitle, dotColor }: any) => (
      <MockView testID={`mock-feedback-panel-${dotColor}`}>
        <MockText>
          {title} {highlightedTitle}
        </MockText>
      </MockView>
    ),
  };
});

const mockAssessment: Assessment = {
  id: "a1",
  studentId: "s1",
  createdAt: Date.now(),
  positive_items: ["Good work"],
};

describe("AssessmentForm", () => {
  it("renders PhotoSection and FeedbackPanels correctly", () => {
    const { getByTestId } = render(
      <AssessmentForm assessment={mockAssessment} onUpdate={jest.fn()} />,
    );

    expect(getByTestId("mock-photo-section")).toBeTruthy();
    expect(getByTestId("mock-feedback-panel-green")).toBeTruthy();
    expect(getByTestId("mock-feedback-panel-red")).toBeTruthy();
  });

  it("renders header with title", () => {
    const { getByText } = render(
      <AssessmentForm assessment={mockAssessment} onUpdate={jest.fn()} />,
    );

    expect(getByText(/ACOMPANHAMENTO/)).toBeTruthy();
  });

  it("renders observations and meta sections", () => {
    const { getByPlaceholderText } = render(
      <AssessmentForm assessment={mockAssessment} onUpdate={jest.fn()} />,
    );

    expect(getByPlaceholderText(/Anotações gerais/)).toBeTruthy();
    expect(getByPlaceholderText(/Meta para o próximo/)).toBeTruthy();
  });

  it("calls onUpdate when notes are changed", () => {
    const onUpdate = jest.fn();
    const { getByPlaceholderText } = render(
      <AssessmentForm assessment={mockAssessment} onUpdate={onUpdate} />,
    );

    fireEvent.changeText(getByPlaceholderText(/Anotações gerais/), "New notes");
    expect(onUpdate).toHaveBeenCalledWith("notes", "New notes");
  });

  it("calls onUpdate when next_goal is changed", () => {
    const onUpdate = jest.fn();
    const { getByPlaceholderText } = render(
      <AssessmentForm assessment={mockAssessment} onUpdate={onUpdate} />,
    );

    fireEvent.changeText(
      getByPlaceholderText(/Meta para o próximo/),
      "New goal",
    );
    expect(onUpdate).toHaveBeenCalledWith("next_goal", "New goal");
  });
});
