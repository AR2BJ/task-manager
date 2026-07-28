import { generateId, todayISO } from "@/utils/helpers.js";

export const TaskService = {
  createTask(currentTasks, taskData) {
    const rawTitle = typeof taskData === "string" ? taskData : taskData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Task title must be between 2 and 120 characters.");
    }

    const alreadyExists = currentTasks.some(
      (task) =>
        task.title.toLowerCase() === cleanedTitle.toLowerCase() &&
        !task.archived,
    );
    if (alreadyExists) {
      throw new Error("An active task with this title already exists.");
    }

    let parsedTags = [];
    if (Array.isArray(taskData.tags)) {
      parsedTags = taskData.tags;
    } else if (typeof taskData.tags === "string") {
      parsedTags = taskData.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    const newTask = {
      id: generateId(),
      title: cleanedTitle,
      description: (taskData.description || "").trim(),
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      createdAt: todayISO(),
      updatedAt: null,
      completedAt: taskData.status === "done" ? todayISO() : null,
      archived: false,
      tags: parsedTags,
      subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : [],
    };

    return [newTask, ...currentTasks];
  },

  toggleTask(currentTasks, id) {
    const today = todayISO();

    return currentTasks.map((task) => {
      if (task.id !== id) return task;

      if (task.archived) return task;

      const isCompleted = task.status === "done";
      const newStatus = isCompleted ? "todo" : "done";

      let updatedSubtasks = [];
      let savedSubtaskIds = task.completedSubtaskIdsBeforeDone || [];

      if (newStatus === "done") {
        savedSubtaskIds = (task.subtasks || [])
          .filter((st) => st.completed)
          .map((st) => st.id);

        updatedSubtasks = (task.subtasks || []).map((st) => ({
          ...st,
          completed: true,
        }));
      } else {
        updatedSubtasks = (task.subtasks || []).map((st) => ({
          ...st,
          completed: savedSubtaskIds.includes(st.id),
        }));
      }

      return {
        ...task,
        status: newStatus,
        completedAt: newStatus === "done" ? today : null,
        subtasks: updatedSubtasks,
        completedSubtaskIdsBeforeDone: savedSubtaskIds,
      };
    });
  },

  updateTaskStatus(currentTasks, id, newStatus) {
    const validStatuses = ["todo", "in_progress", "done", "blocked"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid task status.");
    }

    const today = todayISO();

    return currentTasks.map((task) => {
      if (task.id !== id) return task;

      return {
        ...task,
        status: newStatus,
        completedAt: newStatus === "done" ? today : null,
        updatedAt: today,
      };
    });
  },

  editTask(currentTasks, id, updatedFields) {
    const task = currentTasks.find((t) => t.id === id);
    if (!task) throw new Error("Task not found.");

    let cleanedTitle = task.title;
    if (updatedFields.title) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Task title must be between 2 and 120 characters.");
      }
    }

    let parsedTags = task.tags;
    if (Array.isArray(updatedFields.tags)) {
      parsedTags = updatedFields.tags;
    } else if (typeof updatedFields.tags === "string") {
      parsedTags = updatedFields.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    return currentTasks.map((t) => {
      if (t.id !== id) return t;

      return {
        ...t,
        ...updatedFields,
        title: cleanedTitle,
        tags: parsedTags,
        updatedAt: todayISO(),
      };
    });
  },

  toggleSubtask(currentTasks, taskId, subtaskId) {
    const today = todayISO();

    return currentTasks.map((task) => {
      if (task.id !== taskId) return task;

      const updatedSubtasks = (task.subtasks || []).map((st) => {
        if (st.id !== subtaskId) return st;
        return { ...st, completed: !st.completed };
      });

      if (task.archived) {
        return {
          ...task,
          subtasks: updatedSubtasks,
        };
      }

      const hasSubtasks = updatedSubtasks.length > 0;
      const allCompleted =
        hasSubtasks && updatedSubtasks.every((st) => st.completed);

      let newStatus = task.status;
      let completedAt = task.completedAt;
      let savedSubtaskIds = task.completedSubtaskIdsBeforeDone || [];

      if (allCompleted) {
        newStatus = "done";
        completedAt = today;
      } else if (task.status === "done" && !allCompleted) {
        newStatus = "in_progress";
        completedAt = null;
      }

      if (newStatus !== "done") {
        savedSubtaskIds = updatedSubtasks
          .filter((st) => st.completed)
          .map((st) => st.id);
      }

      return {
        ...task,
        status: newStatus,
        completedAt: completedAt,
        subtasks: updatedSubtasks,
        completedSubtaskIdsBeforeDone: savedSubtaskIds,
      };
    });
  },

  addSubtask(currentTasks, taskId, subtaskTitle) {
    const cleaned = subtaskTitle.trim();
    if (!cleaned) throw new Error("Subtask title cannot be empty.");

    return currentTasks.map((task) => {
      if (task.id !== taskId) return task;

      const newSubtask = {
        id: generateId(),
        title: cleaned,
        completed: false,
        createdAt: todayISO(),
        updatedAt: null,
      };

      return {
        ...task,
        subtasks: [...(task.subtasks || []), newSubtask],
        updatedAt: todayISO(),
      };
    });
  },

  deleteSubtask(currentTasks, taskId, subtaskId) {
    return currentTasks.map((task) => {
      if (task.id !== taskId) return task;

      return {
        ...task,
        subtasks: (task.subtasks || []).filter((st) => st.id !== subtaskId),
        updatedAt: todayISO(),
      };
    });
  },

  deleteTask(currentTasks, id) {
    return currentTasks.filter((task) => task.id !== id);
  },

  archiveTask(currentTasks, id) {
    return currentTasks.map((task) =>
      task.id === id ? { ...task, archived: true } : task,
    );
  },

  restoreTask(currentTasks, id) {
    return currentTasks.map((task) =>
      task.id === id ? { ...task, archived: false } : task,
    );
  },
};
