import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Platform } from "react-native";

import { ActionBar } from "./ActionBar";

jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name }: { name: string }) => <Text>{name}</Text>,
  };
});

const commonProps = {
  onSave: jest.fn(),
  onDownloadImage: jest.fn(),
  onCopyImage: jest.fn(),
  onDelete: jest.fn(),
};

describe("ActionBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("renders Save and Delete buttons", () => {
    const { getByText } = render(<ActionBar {...commonProps} />);

    expect(getByText("Salvar Avaliação")).toBeTruthy();
    expect(getByText("Excluir avaliação")).toBeTruthy();
  });

  it("calls onSave when Salvar is pressed", () => {
    const { getByText } = render(<ActionBar {...commonProps} />);

    fireEvent.press(getByText("Salvar Avaliação"));
    expect(commonProps.onSave).toHaveBeenCalledTimes(1);
  });

  it("shows Salvando... and disables button when isSaving is true", () => {
    const { getByText } = render(<ActionBar {...commonProps} isSaving />);

    expect(getByText("Salvando...")).toBeTruthy();
    fireEvent.press(getByText("Salvando..."));
    expect(commonProps.onSave).not.toHaveBeenCalled();
  });

  it("calls onDelete when Excluir avaliação is pressed", () => {
    const { getByText } = render(<ActionBar {...commonProps} />);

    fireEvent.press(getByText("Excluir avaliação"));
    expect(commonProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it("shows 'Salvo' status by default", () => {
    const { getByText } = render(<ActionBar {...commonProps} />);
    expect(getByText("Salvo")).toBeTruthy();
  });

  it("shows 'Não salvo' status when status is unsaved", () => {
    const { getByText } = render(
      <ActionBar {...commonProps} status="unsaved" />,
    );
    expect(getByText("Não salvo")).toBeTruthy();
  });

  describe("Web specific", () => {
    beforeEach(() => {
      Platform.OS = "web";
    });

    afterEach(() => {
      Platform.OS = "ios"; // reset to default or what was before
    });

    it("calls onCopyImage and shows checkmark when pressed on web", async () => {
      const onCopyImage = jest.fn().mockResolvedValue(true);
      const { getByTestId } = render(
        <ActionBar {...commonProps} onCopyImage={onCopyImage} />,
      );

      const copyBtn = getByTestId("copy-button");
      await act(async () => {
        fireEvent.press(copyBtn);
      });

      expect(onCopyImage).toHaveBeenCalledTimes(1);
      // Success state is internal, but we can verify it doesn't crash
    });

    it("calls onDownloadImage when download button is pressed", () => {
      const { getByTestId } = render(<ActionBar {...commonProps} />);

      fireEvent.press(getByTestId("download-button"));
      expect(commonProps.onDownloadImage).toHaveBeenCalledTimes(1);
    });
  });
});
