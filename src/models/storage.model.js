import { formatDate } from "@/utils/helpers.js";

export const STORAGE_KEY = "task_manager";
export const STORAGE_VERSION = 1;

function normalizeTask(task) {
  return {
    id: String(task.id || crypto.randomUUID()),
    title: task.title || "Untitled Task",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "medium",
    dueDate: task.dueDate || null,
    createdAt: task.createdAt || formatDate(new Date()),
    updatedAt: task.updatedAt || formatDate(new Date()),
    completedAt: task.completedAt || null,
    estimatedMinutes: Number(task.estimatedMinutes) || 0,
    archived: Boolean(task.archived),
    tags: Array.isArray(task.tags) ? task.tags : [],
    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks.map((st) => ({
          id: String(st.id || crypto.randomUUID()),
          title: st.title || "",
          completed: Boolean(st.completed),
          createdAt: task.createdAt || formatDate(new Date()),
          updatedAt: task.updatedAt || formatDate(new Date()),
        }))
      : [],
  };
}

function migrateData(data) {
  const tasks = Array.isArray(data.tasks) ? data.tasks : [];
  return {
    version: STORAGE_VERSION,
    tasks: tasks.map(normalizeTask),
  };
}

export function saveToStorage(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        ...data,
      }),
    );
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    const migrated = migrateData(data);

    return {
      ...migrated,
      tasks: (migrated.tasks || []).map(normalizeTask),
    };
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
    return null;
  }
}
