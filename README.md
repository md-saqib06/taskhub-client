# TaskHub — Frontend

A collaborative task management platform with a Kanban-style workflow, real-time activity tracking, and team collaboration features.

**Live:** [taskhub.thecraftlabs.xyz](https://taskhub.thecraftlabs.xyz)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 + Bun |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Server State | TanStack Query v5 |
| Forms | react-hook-form + Zod |
| Routing | React Router DOM v7 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| HTTP Client | Axios |
| Notifications | Sonner |
| Date Utilities | date-fns + react-day-picker |
| Typography | Noto Sans Variable (@fontsource-variable) |

---

## Project Structure

```
client/
├── src/
│   ├── api/               # Typed API call functions (axios wrappers)
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── tasks.ts
│   │   └── activity.ts
│   ├── components/
│   │   ├── Navbar.tsx     # Global navigation with user info and logout
│   │   └── ui/            # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── features/          # Feature-sliced modules
│   │   ├── auth/
│   │   │   ├── useAuth.ts         # Auth hook (React Query powered)
│   │   │   └── validation.ts
│   │   ├── tasks/
│   │   │   ├── KanbanBoard.tsx    # DnD board with optimistic status updates
│   │   │   ├── KanbanColumn.tsx   # Individual column (droppable)
│   │   │   ├── TaskCard.tsx       # Draggable task card
│   │   │   ├── CreateTaskDialog.tsx
│   │   │   ├── EditTaskDialog.tsx
│   │   │   └── validation.ts
│   │   ├── projects/
│   │   │   ├── CreateProjectDialog.tsx
│   │   │   ├── InviteMemberDialog.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── validation.ts
│   │   └── activity/
│   │       └── ActivityTimeline.tsx
│   ├── layouts/           # Shared layout wrappers
│   ├── lib/
│   │   ├── axios.ts       # Axios instance with base URL and credentials
│   │   └── utils.ts       # cn() helper (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── ProjectPage.tsx
│   ├── providers/
│   │   └── QueryProvider.tsx   # TanStack Query client setup
│   ├── routes/
│   │   ├── Index.tsx            # createBrowserRouter config
│   │   └── ProtectedRoute.tsx
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css              # Tailwind v4 theme + shadcn tokens
├── components.json            # shadcn/ui config
├── vite.config.ts
├── tsconfig.json
└── Dockerfile
```

---

## Routing Architecture

Routes are configured with `createBrowserRouter` from React Router v7. Public routes (`/login`, `/signup`) are accessible without authentication. All other routes are wrapped in a `ProtectedRoute` component that checks session state before rendering.

```
/           → DashboardPage     (protected)
/login      → LoginPage
/signup     → SignupPage
/projects/:id → ProjectPage    (protected)
```

`ProtectedRoute` reads from the `useAuth` hook, which in turn calls `GET /auth/me`. While the session check is in-flight, a centered spinner is rendered. On a failed check, it redirects to `/login`.

---

## Authentication Flow

Auth state is managed entirely through React Query — there's no custom global context or Zustand store. The `useAuth` hook runs `GET /auth/me` on mount with `retry: false`, and sets `isAuthenticated` based on whether the response is non-null.

```ts
export const useAuth = () => {
  const query = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  };
};
```

On logout, the query cache is fully cleared (`queryClient.clear()`), which forces a re-evaluation of all protected routes and naturally redirects the user.

---

## State Management

There is no global state library. All server state — projects, tasks, members, activity — is managed via TanStack Query. Local UI state (dialog open/close, form values, drag target) is handled with `useState`.

Query keys follow a consistent structure:

| Data | Query Key |
|---|---|
| Current user | `['me']` |
| All projects | `['projects']` |
| Single project | `['project', id]` |
| Project members | `['members', projectId]` |
| Project tasks | `['tasks', projectId]` |
| Project activity | `['activities', projectId]` |

Cache invalidation is done at mutation `onSuccess` / `onSettled` callbacks, targeting the exact query keys that need refreshing.

---

## React Query Usage

Every data-fetching operation goes through `useQuery` or `useMutation`. There are no `useEffect` + `fetch` patterns anywhere in the codebase.

Mutations invalidate related queries after settling. For example, creating a task invalidates both `['tasks', projectId]` and `['activities', projectId]`, so the Kanban board and the activity timeline refresh together without any manual coordination.

---

## Kanban Board & Drag-and-Drop

The Kanban board is built with `@dnd-kit/core` and `@dnd-kit/sortable`. Three columns map directly to the `TaskStatus` enum on the backend: `TODO`, `IN_PROGRESS`, `DONE`.

**How drag-and-drop works:**

1. `DndContext` wraps the entire board and tracks drag lifecycle events.
2. `SortableContext` wraps each column's task list with `verticalListSortingStrategy`.
3. Each `TaskCard` registers itself with `useSortable`, getting `transform`, `transition`, and `isDragging` from the hook.
4. On `onDragOver`, the board determines whether the cursor is hovering over a column or a task card, and highlights the target column accordingly.
5. On `onDragEnd`, the board:
   - Detects the new target column from the `over` ID
   - Applies an **optimistic local state update** (`setBoardTasks`) immediately
   - Fires `PATCH /tasks/:id/status` via a `useMutation`
   - On `onSettled` (success or error), invalidates the tasks cache to sync with the server
   - On error, shows a toast notification

```ts
setBoardTasks((prev) =>
  prev.map((task) =>
    task.id === active.id ? { ...task, status: newStatus } : task
  )
);
mutation.mutate({ taskId, status: newStatus });
```

A `DragOverlay` renders a slightly rotated, semi-opaque ghost of the card being dragged.

---

## API Integration

All API calls are in `src/api/`. Each file maps cleanly to one backend resource:

- `auth.ts` — signup, login, logout, getCurrentUser
- `projects.ts` — list, create, get, members, invite
- `tasks.ts` — list by project, create, update, updateStatus, delete
- `activity.ts` — list by project

The Axios instance in `src/lib/axios.ts` is configured with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true` to ensure cookies are sent on every request.

---

## Forms & Validation

Forms are built with `react-hook-form` and validated with Zod. The same Zod schemas used for typing are also used for `zodResolver` in `useForm`.

shadcn/ui `Select` components can't be registered directly, so controlled binding via `setValue` is used:

```ts
onValueChange={(value) => setValue('priority', value as 'LOW' | 'MEDIUM' | 'HIGH')}
```

Due date selection uses a `shadcn/ui Calendar` inside a `Popover`. On date selection, the value is manually synced into the form as an ISO string via `setValue('dueDate', selectedDate.toISOString())`.

---

## shadcn/ui Components Used

| Component | Used In |
|---|---|
| `Button` | Forms, Navbar, dialogs |
| `Card`, `CardContent`, `CardHeader` | TaskCard, ActivityTimeline |
| `Dialog`, `DialogContent`, `DialogTrigger` | CreateTaskDialog, EditTaskDialog |
| `Input`, `Textarea` | Task forms |
| `Select`, `SelectItem` | Priority picker, member assignment |
| `Popover`, `PopoverContent` | Date picker |
| `Calendar` | Due date selection |
| `Badge` | Task priority indicator |
| `Avatar`, `AvatarFallback`, `AvatarImage` | User display throughout |
| `Sonner` (toast) | Mutation feedback |

---

## Dark Mode

The app launches in dark mode by default. `document.documentElement.classList.add('dark')` is called in `main.tsx` before the React tree mounts. The design token system in `index.css` defines separate `:root` (light) and `.dark` blocks using OKLCH color values.

The current theme is dark-first with no toggle — dark mode is the intended experience.

---

## Feature Highlights

- **Kanban board** — Three-column board with fluid drag-and-drop using `@dnd-kit`
- **Task management** — Create, edit, delete tasks; set priority (Low/Medium/High), due date, and assignee
- **Task assignment** — Assign tasks to any project member from within the create/edit dialog
- **Project collaboration** — Invite members by searching their username
- **Activity timeline** — Real-time log of project events shown alongside the board (task created, updated, deleted, member added)
- **Optimistic DnD** — Status changes are reflected in the UI before the server confirms
- **Protected routes** — Unauthenticated users are redirected to `/login`
- **Auto-generated avatars** — Users get an initial-based avatar via DiceBear on signup

---

## Screenshots

> _Add screenshots here once deployed._

| Dashboard | Project View |
|---|---|
| ![Dashboard](./screenshots/dashboard.png) | ![Project](./screenshots/project.png) |

| Kanban Board | Create Task |
|---|---|
| ![Kanban](./screenshots/kanban.png) | ![Create Task](./screenshots/create-task.png) |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api/v1` |

For local development, create `.env.development`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

For production builds, pass `VITE_API_URL` as a build argument (see Dockerfile).

---

## Local Setup

**Prerequisites:** Node.js 20+ or Bun 1.x

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Type-check + build for production
bun run build

# Preview the production build locally
bun run preview
```

The dev server runs on `http://localhost:5173` by default.

---

## Deployment

The client is containerized with a two-stage Dockerfile:

1. **Builder stage** (`oven/bun:alpine`) — installs dependencies and runs `bun run build`
2. **Final stage** — serves the static `dist/` output using `bun x serve` on port 80

```bash
docker build \
  --build-arg VITE_API_URL=https://taskhub-api.thecraftlabs.xyz/api/v1 \
  -t taskhub-client .

docker run -p 80:80 taskhub-client
```

**Production:** [https://taskhub.thecraftlabs.xyz](https://taskhub.thecraftlabs.xyz)
