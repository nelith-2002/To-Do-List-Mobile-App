import { sortTasksByDueDate } from "./taskSort";
import type { Task } from "../types/task";

describe("sortTasksByDueDate", () => {
  it("sorts tasks by dueAt ascending", () => {
    const tasks: Task[] = [
      {
        id: "2",
        title: "Second",
        description: "B",
        dueAt: "2025-01-03T00:00:00.000Z",
        completed: false,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "1",
        title: "First",
        description: "A",
        dueAt: "2025-01-01T00:00:00.000Z",
        completed: false,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "3",
        title: "Third",
        description: "C",
        dueAt: "2025-01-05T00:00:00.000Z",
        completed: false,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
    ];

    const sorted = sortTasksByDueDate(tasks);
    
    expect(tasks[0].id).toBe("2");

    expect(sorted.map((t) => t.id)).toEqual(["1", "2", "3"]);
  });
});
