import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useAssessment } from "./useAssessment";

const mockRepo = {
  findAll: jest.fn().mockResolvedValue([]),
  insert: jest.fn().mockResolvedValue(undefined),
  upsert: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
};

jest.mock("@repositories/index", () => ({
  createAssessmentRepository: jest.fn(() => mockRepo),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue("1"), // migration already done
  setItem: jest.fn(),
}));

const USER_ID = "user-test";

async function renderLoaded() {
  const hook = renderHook(() => useAssessment(USER_ID));
  // Wait for the async init effect (repo.findAll) to complete before testing
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook;
}

describe("useAssessment", () => {
  beforeEach(() => jest.clearAllMocks());

  it("adds an assessment and auto-selects it", async () => {
    const { result } = await renderLoaded();

    let firstId = "";
    let secondId = "";

    await act(async () => {
      firstId = result.current.addAssessment("s-1");
    });
    await act(async () => {
      secondId = result.current.addAssessment("s-1");
    });

    expect(result.current.currentAssessmentId).toBe(secondId);
    expect(result.current.studentAssessments("s-1")).toHaveLength(2);
    expect(result.current.studentAssessments("s-1").map((a) => a.id)).toContain(
      firstId,
    );
  });

  it("selects next assessment when removing current one", async () => {
    const { result } = await renderLoaded();

    let firstId = "";
    let secondId = "";

    await act(async () => {
      firstId = result.current.addAssessment("s-1");
    });
    await act(async () => {
      secondId = result.current.addAssessment("s-1");
    });

    await act(async () => {
      result.current.removeAssessment(secondId);
    });

    expect(result.current.currentAssessmentId).toBe(firstId);
  });

  it("cleanupStudentData removes assessments from local state without calling repo.delete", async () => {
    const { result } = await renderLoaded();

    await act(async () => {
      result.current.addAssessment("s-1");
      result.current.addAssessment("s-1");
      result.current.addAssessment("s-2");
    });

    const deleteCallsBefore = mockRepo.delete.mock.calls.length;

    await act(async () => {
      result.current.cleanupStudentData("s-1");
    });

    expect(result.current.studentAssessments("s-1")).toHaveLength(0);
    expect(result.current.studentAssessments("s-2")).toHaveLength(1);
    expect(mockRepo.delete.mock.calls.length).toBe(deleteCallsBefore);
  });

  it("saveManual calls repo.upsert with current assessment", async () => {
    const { result } = await renderLoaded();

    await act(async () => {
      result.current.addAssessment("s-1");
    });
    await act(async () => {
      result.current.saveManual();
    });

    expect(mockRepo.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ studentId: "s-1" }),
    );
  });
});
