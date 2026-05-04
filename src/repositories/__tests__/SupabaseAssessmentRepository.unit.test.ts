import { SupabaseAssessmentRepository } from "../supabase/SupabaseAssessmentRepository";

import { Assessment } from "@/src/types/assessment";

const mockEq = jest.fn().mockResolvedValue({ error: null });
const mockIn = jest.fn().mockReturnValue({ eq: mockEq });
const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
const mockInsert = jest.fn().mockResolvedValue({ error: null });
const mockUpsert = jest.fn().mockResolvedValue({ error: null });
const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });

const mockFrom = jest.fn().mockReturnValue({
  select: jest.fn().mockReturnValue({ order: mockOrder }),
  insert: mockInsert,
  upsert: mockUpsert,
  delete: mockDelete,
});

const mockClient = { from: mockFrom } as any;
const USER_ID = "user-456";

describe("SupabaseAssessmentRepository", () => {
  let repo: SupabaseAssessmentRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ in: mockIn });
    mockIn.mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({ order: mockOrder }),
      insert: mockInsert,
      upsert: mockUpsert,
      delete: mockDelete,
    });
    repo = new SupabaseAssessmentRepository(mockClient, USER_ID);
  });

  it("findAll returns empty array when no assessments", async () => {
    mockOrder.mockResolvedValueOnce({ data: [], error: null });
    expect(await repo.findAll()).toEqual([]);
  });

  it("findAll maps db row + snapshots + feedback to flat Assessment", async () => {
    mockOrder.mockResolvedValueOnce({
      data: [
        {
          id: "a_1",
          student_id: "s_1",
          user_id: USER_ID,
          created_at: 1000,
          notes: "ok",
          next_goal: null,
          snapshots: [
            {
              id: "sn1",
              side: "front",
              moment: "before",
              photo_url: "http://img",
              date: "2024-01-01",
              weight: 80,
            },
          ],
          feedback: [
            { id: "fb1", category: "positive", content: "Bom", position: 0 },
            {
              id: "fb2",
              category: "adjustment",
              content: "Melhorar",
              position: 0,
            },
          ],
          metrics: [],
        },
      ],
      error: null,
    });
    const result = await repo.findAll();
    expect(result[0]).toMatchObject({
      id: "a_1",
      studentId: "s_1",
      createdAt: 1000,
      notes: "ok",
      photo_front_before: "http://img",
      front_before_date: "2024-01-01",
      front_before_weight: "80",
      positive_items: ["Bom"],
      adjustment_items: ["Melhorar"],
    });
    expect(result[0]).not.toHaveProperty("user_id");
    expect(result[0]).not.toHaveProperty("student_id");
  });

  it("findAll backfills cintura from metrics", async () => {
    mockOrder.mockResolvedValueOnce({
      data: [
        {
          id: "a_2",
          student_id: "s_1",
          user_id: USER_ID,
          created_at: 2000,
          notes: null,
          next_goal: null,
          snapshots: [],
          feedback: [],
          metrics: [
            {
              id: "m1",
              name: "front_before_cintura",
              value: 85,
              unit: "cm",
              position: 0,
            },
          ],
        },
      ],
      error: null,
    });
    const result = await repo.findAll();
    expect(result[0].front_before_cintura).toBe("85");
  });

  it("insert calls assessments table with user_id injected", async () => {
    const assessment: Assessment = {
      id: "a_2",
      studentId: "s_1",
      createdAt: 2000,
      notes: "test",
    };
    await repo.insert(assessment);
    expect(mockFrom).toHaveBeenCalledWith("assessments");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "a_2",
        student_id: "s_1",
        user_id: USER_ID,
        created_at: 2000,
      }),
    );
  });

  it("insert throws when supabase returns error", async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: "fk violation" } });
    await expect(
      repo.insert({ id: "a_3", studentId: "s_1", createdAt: 3000 }),
    ).rejects.toMatchObject({ message: "fk violation" });
  });

  it("delete calls from('assessments').delete().eq('id', id)", async () => {
    await repo.delete("a_1");
    expect(mockFrom).toHaveBeenCalledWith("assessments");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", "a_1");
  });
});
