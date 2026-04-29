import { act, renderHook } from "@testing-library/react-native";

import { useAssessment } from "./useAssessment";

// Mock do AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("useAssessment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds a student and auto-creates/selects an assessment", async () => {
    const { result } = renderHook(() => useAssessment(null));

    let studentId: string = "";
    await act(async () => {
      studentId = result.current.addStudent("John Doe");
    });

    expect(result.current.currentStudentId).toBe(studentId);
    expect(result.current.db.students[studentId]).toBeDefined();
    expect(result.current.currentAssessmentId).toBeDefined();
    expect(result.current.studentAssessments.length).toBe(1);
  });

  it("adds an assessment and auto-selects it", async () => {
    const { result } = renderHook(() => useAssessment(null));

    let studentId: string = "";
    let secondAssessmentId: string = "";

    await act(async () => {
      studentId = result.current.addStudent("John Doe");
    });

    await act(async () => {
      secondAssessmentId = result.current.addAssessment(studentId);
    });

    expect(result.current.currentAssessmentId).toBe(secondAssessmentId);
    expect(result.current.studentAssessments.length).toBe(2);
    expect(result.current.studentAssessments.map((a) => a.id)).toContain(
      secondAssessmentId,
    );
  });

  it("clears selection when removing current student", async () => {
    const { result } = renderHook(() => useAssessment(null));

    let studentId: string = "";
    await act(async () => {
      studentId = result.current.addStudent("John Doe");
    });

    await act(async () => {
      result.current.removeStudent(studentId);
    });

    expect(result.current.currentStudentId).toBeNull();
    expect(result.current.currentAssessmentId).toBeNull();
  });

  it("selects next assessment when removing current one", async () => {
    const { result } = renderHook(() => useAssessment(null));

    let studentId: string = "";
    let firstId: string = "";
    let secondId: string = "";

    await act(async () => {
      studentId = result.current.addStudent("John Doe");
    });

    firstId = result.current.currentAssessmentId!;

    await act(async () => {
      secondId = result.current.addAssessment(studentId);
    });

    expect(result.current.currentAssessmentId).toBe(secondId);

    await act(async () => {
      result.current.removeAssessment(secondId);
    });

    expect(result.current.currentAssessmentId).toBe(firstId);
  });
});
