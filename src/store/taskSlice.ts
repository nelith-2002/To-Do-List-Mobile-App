import { createSlice, PayloadAction, nanoid, createSelector } from "@reduxjs/toolkit";
import type { Task } from "../types/task";
import type { RootState } from "./index";

type TasksState = { items: Task[] };
const initialState: TasksState = { items: [] };

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
    },
    addTask: {
      prepare(payload: { title: string; description?: string; dueAt: string }) {
        const now = new Date().toISOString();
        return {
          payload: {
            id: nanoid(),
            title: payload.title.trim(),
            description: payload.description?.trim(),
            dueAt: payload.dueAt,
            completed: false,
            createdAt: now,
            updatedAt: now,
          } as Task,
        };
      },
      reducer(state, action: PayloadAction<Task>) {
        state.items.push(action.payload);
      },
    },
    updateTask(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Omit<Task, "id" | "createdAt">> }>
    ) {
      const t = state.items.find((x) => x.id === action.payload.id);
      if (t) {
        Object.assign(t, action.payload.changes);
        t.updatedAt = new Date().toISOString();
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x.id !== action.payload);
    },
    toggleComplete(state, action: PayloadAction<string>) {
      const t = state.items.find((x) => x.id === action.payload);
      if (t) {
        t.completed = !t.completed;
        t.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleComplete } = slice.actions;
export default slice.reducer;


const selectItems = (state: RootState) => state.tasks.items;


export const selectAllSorted = createSelector([selectItems], (items) =>
  items.slice().sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
);

export const makeSelectFiltered = (filter: "all" | "active" | "done") =>
  createSelector([selectAllSorted], (items) => {
    if (filter === "active") return items.filter((t) => !t.completed);
    if (filter === "done") return items.filter((t) => t.completed);
    return items.slice();
  });
