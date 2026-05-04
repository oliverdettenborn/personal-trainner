import { SupabaseStudentRepository } from "../supabase/SupabaseStudentRepository";
import { Student } from "@/src/types/assessment";

const mockEq = jest.fn().mockResolvedValue({ error: null });
const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
const mockInsert = jest.fn().mockResolvedValue({ error: null });
const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });

const mockFrom = jest.fn().mockReturnValue({
  select: jest.fn().mockReturnValue({ order: mockOrder }),
  insert: mockInsert,
  delete: mockDelete,
});

const mockClient = { from: mockFrom } as any;
const USER_ID = "user-123";

describe("SupabaseStudentRepository", () => {
  let repo: SupabaseStudentRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({ order: mockOrder }),
      insert: mockInsert,
      delete: mockDelete,
    });
    repo = new SupabaseStudentRepository(mockClient, USER_ID);
  });

  it("findAll returns empty array when no students", async () => {
    mockOrder.mockResolvedValueOnce({ data: [], error: null });
    const result = await repo.findAll();
    expect(result).toEqual([]);
  });

  it("findAll maps db row to Student shape and omits user_id", async () => {
    mockOrder.mockResolvedValueOnce({
      data: [{ id: "s_1", name: "Ana", created_at: 1000, user_id: USER_ID }],
      error: null,
    });
    const result = await repo.findAll();
    expect(result[0]).toEqual({ id: "s_1", name: "Ana", createdAt: 1000 });
    expect(result[0]).not.toHaveProperty("user_id");
    expect(result[0]).not.toHaveProperty("created_at");
  });

  it("insert calls from('students').insert with user_id injected", async () => {
    const student: Student = { id: "s_2", name: "Bob", createdAt: 2000 };
    await repo.insert(student);
    expect(mockClient.from).toHaveBeenCalledWith("students");
    expect(mockInsert).toHaveBeenCalledWith({
      id: "s_2",
      user_id: USER_ID,
      name: "Bob",
      created_at: 2000,
    });
  });

  it("insert throws when supabase returns error", async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: "unique violation" } });
    const student: Student = { id: "s_3", name: "Carol", createdAt: 3000 };
    await expect(repo.insert(student)).rejects.toMatchObject({
      message: "unique violation",
    });
  });

  it("delete calls from('students').delete().eq('id', id)", async () => {
    await repo.delete("s_1");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", "s_1");
  });
});
