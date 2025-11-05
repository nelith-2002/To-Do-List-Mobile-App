import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/taskSlice";
import type { Middleware } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVE_KEY_BASE = "@taskflow/tasks";

const makeTasksKeyForProfile = (name: string) => {
  const slug = name.trim().toLowerCase().replace(/\s+/g, "_");
  return `${SAVE_KEY_BASE}/${slug}`;
};

let currentTasksKey = `${SAVE_KEY_BASE}/default`;

export const setActiveProfileForTasks = (profileName: string | null | undefined) => {
  currentTasksKey = profileName ? makeTasksKeyForProfile(profileName) : `${SAVE_KEY_BASE}/default`;
};

export const getCurrentTasksKey = () => currentTasksKey;

// persist middleware (lightweight)
const persistMiddleware: Middleware = (storeApi) => (next) => async (action) => {
  const result = next(action);
  const state = storeApi.getState() as RootState;
  try {
    await AsyncStorage.setItem(currentTasksKey, JSON.stringify(state.tasks.items));
  } catch {}
  return result;
};

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  middleware: (getDefault) => getDefault().concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// load on app start
export async function loadTasksForProfile(profileName: string, dispatch: AppDispatch) {
  const key = makeTasksKeyForProfile(profileName);
  currentTasksKey = key;

  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      const items = JSON.parse(raw);
      dispatch({ type: "tasks/hydrate", payload: items });
    }else{
      dispatch({ type: "tasks/hydrate", payload: [] });
    }
  } catch {}
}
