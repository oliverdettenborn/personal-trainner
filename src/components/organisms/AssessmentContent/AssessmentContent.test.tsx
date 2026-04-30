import { render } from "@testing-library/react-native";
import React from "react";

import { AssessmentContent } from "./AssessmentContent";
import { Assessment } from "../../../types/assessment";

jest.mock("react-native-svg", () => {
  const { View: MockView } = require("react-native");
  return {
    Svg: (props: any) => <MockView {...props} />,
    Path: (props: any) => <MockView {...props} />,
  };
});

jest.mock("../../molecules/PhotoSection/PhotoSection", () => {
  const { View: MockView } = require("react-native");
  return { PhotoSection: () => <MockView testID="mock-photo" /> };
});

const mockAssessment: Assessment = {
  id: "a1",
  studentId: "s1",
  createdAt: Date.now(),
  front_before_date: "",
  front_before_weight: "75",
  front_before_cintura: "",
  back_before_date: "",
  back_before_weight: "",
  back_before_cintura: "",
  photo_front_before: "",
  photo_front_after: "",
  photo_back_before: "",
  photo_back_after: "",
};

const mockOnUpdate = jest.fn();
const mockRef = { current: null };

describe("AssessmentContent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders desktop layout by default", () => {
    const { toJSON } = render(
      <AssessmentContent
        assessment={mockAssessment}
        onUpdate={mockOnUpdate}
        captureRef={mockRef}
        isMobile={false}
      />,
    );

    const tree = JSON.stringify(toJSON());
    // desktop layout uses maxWidth 900 and no horizontal scroll
    expect(tree).toContain('"maxWidth":900');
    expect(tree).not.toContain('"horizontal":true');
  });

  it("renders mobile layout with horizontal scroll", () => {
    const { toJSON } = render(
      <AssessmentContent
        assessment={mockAssessment}
        onUpdate={mockOnUpdate}
        captureRef={mockRef}
        isMobile
      />,
    );

    const tree = JSON.stringify(toJSON());
    // mobile layout uses horizontal ScrollView with width 900
    expect(tree).toContain('"horizontal":true');
  });
});
