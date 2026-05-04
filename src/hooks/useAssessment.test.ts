import { act, renderHook } from "@testing-library/react-native";

import { useAssessment } from "./useAssessment";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn(),
}));

describe("useAssessment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds an assessment and auto-selects it", async () => {
    const { result } = renderHook(() => useAssessment());

    let firstId: string = "";
    let secondId: string = "";

    await act(async () => {
      firstId = result.current.addAssessment("student-1");
    });
    await act(async () => {
      secondId = result.current.addAssessment("student-1");
    });

    expect(result.current.currentAssessmentId).toBe(secondId);
    expect(result.current.studentAssessments("student-1").length).toBe(2);
    expect(result.current.studentAssessments("student-1").map((a) => a.id)).toContain(firstId);
  });

  it("selects next assessment when removing current one", async () => {
    const { result } = renderHook(() => useAssessment());

    let firstId: string = "";
    let secondId: string = "";

    await act(async () => {
      firstId = result.current.addAssessment("student-1");
    });
    await act(async () => {
      secondId = result.current.addAssessment("student-1");
    });

    expect(result.current.currentAssessmentId).toBe(secondId);

    await act(async () => {
      result.current.removeAssessment(secondId);
    });

    expect(result.current.currentAssessmentId).toBe(firstId);
  });

  it("cleanupStudentData removes all assessments for a student", async () => {
    const { result } = renderHook(() => useAssessment());

    await act(async () => {
      result.current.addAssessment("student-1");
      result.current.addAssessment("student-1");
      result.current.addAssessment("student-2");
    });

    await act(async () => {
      result.current.cleanupStudentData("student-1");
    });

    expect(result.current.studentAssessments("student-1").length).toBe(0);
    expect(result.current.studentAssessments("student-2").length).toBe(1);
  });

  it("calls AsyncStorage.setItem when saveManual is called", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    const { result } = renderHook(() => useAssessment());

    await act(async () => {
      result.current.saveManual();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@caio_oliver_db",
      expect.any(String),
    );
  });
});
