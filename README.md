# TaskFlow – To-Do List Mobile App [Nelith Nethsanda]

A personal to-do list app built with **React Native (Expo)** and **Redux Toolkit**, featuring per-user task storage, profile avatars, and local persistence via AsyncStorage.

> Coding Challenge 1 – To-Do List Mobile App  
> Platform: **React Native (TypeScript + Expo)**

---

## Overview

TaskFlow lets a user:

- Create a simple profile (name + optional avatar image or image URL)
- Add, edit, delete tasks with:
  - Title  
  - Description  
  - Due date
- Mark tasks as complete / incomplete
- Filter tasks by:
  - Status: All / Active / Done  
  - Due date: Any / Today / This week / This month / Overdue
- Persist tasks **per user** locally (based on the profile name)
- See tasks sorted by due date (ascending)

The UI is kept clean and minimal, optimized for mobile screens and smooth scrolling.

---

## Tech Stack

**Platform**

- React Native (Expo)
- TypeScript

**State Management & Architecture**

- **Redux Toolkit** (slice-based state, selectors)
- Pattern: **MVVM-ish with Redux**
  - Screens/components = View
  - Redux slice/selectors = ViewModel + state
  - AsyncStorage = data layer

**Persistence**

- `@react-native-async-storage/async-storage`  
  - Tasks stored per profile: `@taskflow/tasks/<profile_slug>`  
  - Last used profile stored as `@taskflow/profile`
  - Profile data per name stored as `@taskflow/profile/byName/<profile_slug>`

**Navigation**

- `@react-navigation/native`
- `@react-navigation/native-stack`

**UI & Utilities**

- `@expo/vector-icons` (Feather, Ionicons, MaterialIcons, FontAwesome5)
- `@react-native-community/datetimepicker` for due dates
- `expo-image-picker` for profile avatar from gallery

**Testing**

- Jest
- `ts-jest` + Babel transform for TypeScript
- Unit test for core sorting logic in `src/utils/taskSort.test.ts`

---

## Features

### Core Features (per requirements)

- **Add, Edit, Delete Tasks**
  - Implemented via `AddEditTaskScreen` and Redux actions (`addTask`, `updateTask`, `deleteTask`).

- **Task Fields**
  - `title` (required)
  - `description` (optional)
  - `dueAt` (ISO string, selected via `DateTimePicker`)

- **Complete / Incomplete Toggle**
  - `TaskCard` shows a circle / check icon.
  - Toggle handled via `toggleComplete` action.

- **Local Persistence**
  - Custom Redux middleware saves `tasks.items` to AsyncStorage on each mutation.
  - Key is **per profile**, so each user sees only their own tasks.

- **Tasks Sorted by Due Date (Ascending)**
  - Selector `selectAllSorted` in `src/store/taskSlice.ts` uses `sortTasksByDueDate` helper:
    ```ts
    export const selectAllSorted = createSelector(
      [selectItems],
      (items) => sortTasksByDueDate(items)
    );
    ```

### Architecture & Separation of Concerns

- `src/screens/`
  - `OnboardingScreen` – intro and “Get Started” button
  - `ProfileSetupScreen` – enter name, pick avatar from gallery or paste URL
  - `HomeScreen` – main task list, filters, profile display, logout
  - `AddEditTaskScreen` – form for adding/editing tasks
  - `TaskDetailsScreen` – read-only view of a task with an edit shortcut

- `src/components/`
  - `TaskCard` – custom reusable card showing title, description, due date, status, and Overdue badge.

- `src/store/`
  - `taskSlice.ts` – Redux Toolkit slice for tasks
  - `index.ts` – configure store, persistence middleware, and `loadTasksForProfile(...)`

- `src/utils/`
  - `taskSort.ts` – pure function that sorts tasks by `dueAt` ascending

- `src/theme/`
  - `colors.ts` – central palette and color tokens for consistent styling

- `src/types/`
  - `task.ts` – Task type definition

This keeps **UI**, **state/business logic**, and **data persistence** clearly separated.

---

## Per-User Tasks & Avatar Handling

The app is **user-based** without a backend:

- When a user enters their name on the **ProfileSetup** screen:
  - A slug is created from the name (e.g. `"Nelith"` → `"nelith"`).
  - Profile is stored under:
    - Last used: `@taskflow/profile`
    - Per-name: `@taskflow/profile/byName/<slug>`
  - Tasks are loaded from `@taskflow/tasks/<slug>` via `loadTasksForProfile(profileName, dispatch)`.

- On next launch:
  - When the same name is typed again, the screen looks up
    `@taskflow/profile/byName/<slug>` and pre-loads the **previous avatar**.
  - The user can keep or change the avatar.
  - Only tasks for that profile name are loaded.

Example:

- User **“Nelith”**  
  - Adds avatar + 10 tasks  
  - Logs out  
  - Later types “Nelith” again → same avatar shown, and only Nelith’s 10 tasks appear.

- User **“Nimal”**  
  - Uses a different name → different profile key, different tasks storage.

---

## Performance Considerations

- **FlatList** is used in `HomeScreen` for rendering tasks – optimized for scrolling.
- **Selectors + useMemo/useCallback**
  - `createSelector` avoids unnecessary recomputation of derived task lists.
  - `useMemo` is used for filtering by status and due date.
  - `useCallback` is used for `renderItem` in `FlatList` and handlers to reduce re-renders.
- **AsyncStorage** writes are small JSON arrays; operations are done via a lightweight middleware.

Edge cases handled:

- **Empty states** – custom illustration text for All / Active / Done when there are no tasks.
- **Invalid input**
  - Title is required; primary CTA is disabled until there is a non-empty title.
  - Name must be at least 2 characters.
  - Image URL is validated with a simple regex (`https://...png/jpg/gif/webp/svg`).
- **Overdue tasks** – tasks whose due date is before today (and not completed) are shown in red with an `Overdue` badge.

---

## UI / UX

- Simple, clean design with:
  - Navy header background
  - Card-based task layout (`TaskCard`)
  - Clear segmentation of filters (All / Active / Done)
  - Date filter dropdown (Any / Today / Week / Month / Overdue)
- Custom UI components:
  - **TaskCard** – custom styled component with:
    - Title, description
    - Calendar icon + due date
    - Overdue badge
    - Edit/Delete icons
  - **Avatar** chip for profile in header

Navigation:

- `OnboardingScreen` → `ProfileSetupScreen` → `HomeScreen`
- From Home:
  - `AddEditTaskScreen` for Add/Edit
  - `TaskDetailsScreen` on tapping a task card

---

## Setup & Installation

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Expo CLI (via `npx` is fine)
- Android emulator / iOS simulator / physical device with Expo Go

### 1. Clone the repository

```bash
git clone "https://github.com/nelith-2002/To-Do-List-Mobile-App.git"
cd To-Do-List-Mobile-App
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the app

```bash
npm start
# or
yarn start
```

- In the Expo terminal:
  - Press **`a`** for Android emulator  
  - Press **`i`** for iOS simulator (macOS)  
  - Or scan the QR code with **Expo Go** on your device

---

## Running Tests

This project uses **Jest + ts-jest + Babel** for unit tests.

### Run all tests

```bash
npm test
# or
yarn test
```

### Implemented Unit Test

- File: `src/utils/taskSort.test.ts`
- Target: `sortTasksByDueDate` in `src/utils/taskSort.ts`
- What it tests:
  - Tasks are **sorted by `dueAt` ascending**.
  - The original array is **not mutated** (the test checks the original order remains unchanged before comparing the sorted IDs).

This satisfies the requirement:

> “Write modular, testable code with at least one unit test for a core function (e.g., task sorting or persistence logic).”

---

## Folder Structure (simplified)

```text
src/
  components/
    TaskCard.tsx
  screens/
    OnboardingScreen.tsx
    ProfileSetupScreen.tsx
    HomeScreen.tsx
    AddEditTaskScreen.tsx
    TaskDetailsScreen.tsx
  store/
    index.ts           # configureStore, AsyncStorage middleware, loadTasksForProfile
    taskSlice.ts       # Redux Toolkit slice for tasks + selectors
  utils/
    taskSort.ts        # pure sorting helper
    taskSort.test.ts   # Jest unit test
  theme/
    colors.ts          # PALETTE + COLORS tokens
  types/
    task.ts            # Task type
App.tsx                # Navigation + Provider setup
```

---

## Architectural Choices & Why

- **React Native + Expo**
  - Fast to iterate, good developer experience.
  - Easy testing on both Android and iOS.
- **Redux Toolkit**
  - Clear global state management for tasks.
  - Built-in immutability and dev-friendly APIs.
- **AsyncStorage**
  - Simple local persistence layer for offline usage.
  - Good fit for the requirement: “Persist tasks locally using the platform’s recommended storage solution.”
- **Selectors + Utils**
  - Business logic such as sorting moved into `utils` (e.g., `sortTasksByDueDate`), making it easy to unit test and reuse.

---

## Challenges & How They Were Addressed

1. **Per-user task separation**
   - Challenge: Make sure tasks for “Nelith” and “Nimal” don’t mix.
   - Solution: Use a per-profile key (`@taskflow/tasks/<slug>`), derived from the profile name. On continue, `loadTasksForProfile(name, dispatch)` loads the correct tasks into Redux.

2. **Profile avatar persistence per name**
   - Challenge: When user types their name again later, show their previous avatar (but allow changes).
   - Solution: Store profile per name under `@taskflow/profile/byName/<slug>`. On typing a valid name, `ProfileSetupScreen` looks up that entry and sets `imgUri` if found.

3. **TypeScript & Jest**
   - Challenge: Jest initially failed on modern ESM packages.
   - Solution: Configure Jest with `ts-jest` and proper `transformIgnorePatterns` to avoid transforming certain node modules; then focus tests on a pure utility function.

---

## Future Improvements

- Add search by task title.
- Add more advanced validation (e.g., prevent duplicate titles).
- Add light/dark theme switch.
- Add optional reminders/notifications for upcoming due dates.
- Add more tests (Redux reducers, components with React Native Testing Library).
