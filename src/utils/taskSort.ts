import type { Task } from "../types/task";

export function sortTasksByDueDate(tasks: Task[]): Task[] {
  return tasks
    .slice()
    .sort(
      (a, b) =>
        new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    );
}
