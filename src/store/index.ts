import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/taskSlice";
import type { Middleware } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVE_KEY = "@taskflow/tasks";

// persist middleware (lightweight)
const persistMiddleware: Middleware = (store) => (next) => async (action) => {
  const result = next(action);
  const state = store.getState() as RootState;
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state.tasks.items));
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
export async function loadTasksOnBoot(dispatch: AppDispatch) {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (raw) {
      const items = JSON.parse(raw);
      dispatch({ type: "tasks/hydrate", payload: items });
    }
  } catch {}
}
