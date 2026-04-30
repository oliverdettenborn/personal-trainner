import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { useWindowDimensions } from "react-native";

import { AppHeader } from "./AppHeader";
import { Student } from "../../../types/assessment";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  default: jest.fn(),
}));

const mockUseWindowDimensions = useWindowDimensions as jest.Mock;

const mockStudents: Student[] = [
  { id: "s1", name: "Alice", createdAt: Date.now() },
];

const commonProps = {
  currentStudentId: null as string | null,
  students: mockStudents,
  onSelectStudent: jest.fn(),
  onAddStudent: jest.fn(),
  onRemoveStudent: jest.fn(),
};

beforeEach(() => {
  mockUseWindowDimensions.mockReturnValue({ width: 1280, height: 900 });
});

describe("AppHeader", () => {
  it("renders the app title", () => {
    const { getByText } = render(<AppHeader {...commonProps} />);

    expect(getByText(/ACOMPANHAMENTO/)).toBeTruthy();
    expect(getByText("FÍSICO")).toBeTruthy();
  });

  it("calls onLogout when logout button is pressed", () => {
    const onLogout = jest.fn();
    const { getByTestId } = render(
      <AppHeader {...commonProps} onLogout={onLogout} />,
    );

    // The Ionicons is rendered inside a Pressable.
    // We can find it by its mock name if we use testID or similar,
    // but here we can look for the Pressable that contains the icon.
    // Since it's the only one with log-out-outline (mocked as string),
    // we can try to find by icon name if we set it up.
    // Let's use getByRole or just wrap it in a testID in the component if needed.
    // For now, let's see if we can find it by its icon name mock.
    const logoutBtn = getByTestId("logout-button");
    fireEvent.press(logoutBtn);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  describe("sidebar toggle button", () => {
    it("does not render toggle button when onToggleSidebar is not provided", () => {
      const { queryByText } = render(<AppHeader {...commonProps} />);

      expect(queryByText("☰")).toBeNull();
    });

    it("renders toggle button when onToggleSidebar is provided", () => {
      const { getByText } = render(
        <AppHeader
          {...commonProps}
          onToggleSidebar={jest.fn()}
          sidebarVisible={false}
        />,
      );

      expect(getByText("☰")).toBeTruthy();
    });

    it("calls onToggleSidebar when toggle button is pressed", () => {
      const onToggleSidebar = jest.fn();
      const { getByText } = render(
        <AppHeader
          {...commonProps}
          onToggleSidebar={onToggleSidebar}
          sidebarVisible={false}
        />,
      );

      fireEvent.press(getByText("☰"));

      expect(onToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it("renders both toggle and title when onToggleSidebar is provided", () => {
      const { getByText } = render(
        <AppHeader
          {...commonProps}
          onToggleSidebar={jest.fn()}
          sidebarVisible
        />,
      );

      expect(getByText("☰")).toBeTruthy();
      expect(getByText(/ACOMPANHAMENTO/)).toBeTruthy();
    });
  });

  describe("student action buttons — desktop", () => {
    it("renders text buttons on desktop", () => {
      const { getByText } = render(<AppHeader {...commonProps} />);

      expect(getByText("+ Aluno")).toBeTruthy();
    });

    it("renders Remover aluno text button when student is selected on desktop", () => {
      const { getByText } = render(
        <AppHeader {...commonProps} currentStudentId="s1" />,
      );

      expect(getByText("Remover aluno")).toBeTruthy();
    });

    it("calls onRemoveStudent when Remover aluno is pressed", () => {
      const onRemoveStudent = jest.fn();
      const { getByText } = render(
        <AppHeader
          {...commonProps}
          currentStudentId="s1"
          onRemoveStudent={onRemoveStudent}
        />,
      );

      fireEvent.press(getByText("Remover aluno"));
      expect(onRemoveStudent).toHaveBeenCalledWith("s1");
    });

    it("opens modal and calls onAddStudent when + Aluno is pressed", () => {
      const onAddStudent = jest.fn();
      const { getByText, getByPlaceholderText } = render(
        <AppHeader {...commonProps} onAddStudent={onAddStudent} />,
      );

      fireEvent.press(getByText("+ Aluno"));

      // Modal should be visible
      const input = getByPlaceholderText("Ex: João Silva");
      fireEvent.changeText(input, "New Student");

      fireEvent.press(getByText("Criar"));
      expect(onAddStudent).toHaveBeenCalledWith("New Student");
    });
  });

  describe("student action buttons — mobile", () => {
    beforeEach(() => {
      mockUseWindowDimensions.mockReturnValue({ width: 375, height: 812 });
    });

    it('does not render "+ Aluno" text on mobile', () => {
      const { queryByText } = render(<AppHeader {...commonProps} />);

      expect(queryByText("+ Aluno")).toBeNull();
    });

    it('does not render "Remover aluno" text on mobile', () => {
      const { queryByText } = render(
        <AppHeader {...commonProps} currentStudentId="s1" />,
      );

      expect(queryByText("Remover aluno")).toBeNull();
    });
  });
});
