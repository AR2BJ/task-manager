import { generateId, todayISO } from "@/utils/helpers";

import { GlobalLoaderService } from "@/services/loader.service";
import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";
import { TaskService } from "@/services/task.service.js";

let pendingDeleteId = null;
let pendingEditId = null;
let currentModalSubtasks = [];

export function setPendingDeleteId(id) {
  pendingDeleteId = id;
}

export function setPendingEditId(id) {
  pendingEditId = id;
  if (id) {
    TaskFormController.populateEditModal(id);
  }
}

export const TaskFormController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindFormEvents();
    this.bindSubtaskEvents();
  },

  populateEditModal(taskId) {
    const tasks = StateManager.getTasks();
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    const titleInput = document.getElementById("edit-task-title");
    const descInput = document.getElementById("edit-task-desc");
    const dueDateInput = document.getElementById("edit-task-due-date");
    const prioritySelect = document.getElementById("edit-task-priority");
    const statusSelect = document.getElementById("edit-task-status");
    const tagsInput = document.getElementById("edit-task-tags");

    if (titleInput) titleInput.value = task.title || "";
    if (descInput) descInput.value = task.description || "";
    if (dueDateInput) dueDateInput.value = task.dueDate || "";
    if (prioritySelect) prioritySelect.value = task.priority || "medium";
    if (statusSelect) statusSelect.value = task.status || "todo";
    if (tagsInput)
      tagsInput.value = Array.isArray(task.tags) ? task.tags.join(", ") : "";

    currentModalSubtasks = task.subtasks
      ? JSON.parse(JSON.stringify(task.subtasks))
      : [];
    this.renderModalSubtasks();
  },

  renderModalSubtasks() {
    const container = document.getElementById("edit-subtasks-list");
    const badge = document.getElementById("subtask-progress-badge");

    if (!container) return;

    const total = currentModalSubtasks.length;
    const completedCount = currentModalSubtasks.filter(
      (s) => s.completed,
    ).length;

    if (badge) {
      badge.textContent = `${completedCount}/${total} Done`;
    }

    if (total === 0) {
      container.innerHTML = `
        <div
          class="w-full min-h-25 overflow-y-auto scrollbar-thumb-surface scrollbar-thin bg-surface-2 border border-dashed border-border rounded-lg p-2 text-center"
        >
          <div class="h-25 flex flex-col justify-center items-center">
            <div class="text-3xl mb-1">
              <i class="fa-regular fa-list-check text-brand/80"></i>
            </div>
            <p class="mt-2 text-secondary max-w-sm mx-auto text-sm">
              No subtasks defined yet.
            </p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div
        class="w-full max-h-25 overflow-y-auto scrollbar-thumb-surface scrollbar-thin bg-surface-2 border border-border rounded-lg p-2 flex flex-col justify-start gap-1"
      >
        ${currentModalSubtasks
          .map(
            (subtask) => `
                <div
                  data-subtask-id="${subtask.id}"
                  class="subtask-item flex items-center justify-between gap-2 p-2 rounded-lg bg-surface border border-border/70 group hover:border-brand/40 transition"
                >
                  <div class="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      data-action="toggle"
                      class="subtask-toggle w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition peer hover:cursor-pointer ${
                        subtask.completed
                          ? "bg-brand/80 border-brand/80 text-(--color-btn-primary-text) shadow-lg shadow-brand/20"
                          : "border-border text-secondary hover:border-brand/80 hover:text-brand/80"
                      }"
                    >
                      <i
                        class="fa-regular ${
                          subtask.completed
                            ? "fa-check text-xs md:text-sm font-bold"
                            : "fa-square text-[10px]"
                        }"
                      ></i>
                    </button>
                    <input
                      type="text"
                      data-action="edit-text"
                      value="${subtask.title.replace(/"/g, "&quot;")}"
                      class="subtask-title-input text-xs text-primary bg-transparent outline-none w-full border-b border-transparent focus:border-brand/50 ${
                        subtask.completed ? "line-through text-muted" : ""
                      }"
                    />
                  </div>
                  <button
                    data-action="delete"
                    class="delete-btn w-6 h-6 rounded-sm bg-surface-2 hover:bg-red-600/10 border border-border flex items-center justify-center hover:cursor-pointer transition"
                  >
                    <i class="fa-regular fa-trash-can text-red-500/80 text-xs"></i>
                  </button>
                </div>
              `,
          )
          .join("")}
      </div>
    `;
  },

  bindSubtaskEvents() {
    const addSubtaskBtn = document.getElementById("add-subtask-btn");
    const newSubtaskInput = document.getElementById("new-subtask-input");
    const container = document.getElementById("edit-subtasks-list");

    const handleAddSubtask = () => {
      if (!newSubtaskInput) return;
      const title = newSubtaskInput.value.trim();
      if (!title) return;

      currentModalSubtasks.push({
        id: generateId(),
        title,
        completed: false,
      });

      newSubtaskInput.value = "";
      this.renderModalSubtasks();
    };

    addSubtaskBtn?.addEventListener("click", handleAddSubtask);
    newSubtaskInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSubtask();
      }
    });

    container?.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;

      const subtaskCard = target.closest("[data-subtask-id]");
      if (!subtaskCard) return;

      const subtaskId = subtaskCard.dataset.subtaskId;
      const action = target.dataset.action;

      if (action === "delete") {
        const index = currentModalSubtasks.findIndex((s) => s.id === subtaskId);
        if (index === -1) return;

        const removedSubtask = currentModalSubtasks[index];

        currentModalSubtasks.splice(index, 1);
        this.renderModalSubtasks();

        NotificationService.show({
          type: "error",
          message: `Subtask "${removedSubtask.title}" deleted`,
          duration: 5000,
          undoAction: () => {
            GlobalLoaderService.show("Re-instating deleted record...");
            setTimeout(() => {
              try {
                currentModalSubtasks.splice(index, 0, removedSubtask);
                this.renderModalSubtasks();
              } finally {
                GlobalLoaderService.hide();
              }
            }, 30);
          },
        });
      } else if (action === "toggle") {
        const subtask = currentModalSubtasks.find((s) => s.id === subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
          this.renderModalSubtasks();
        }
      }
    });

    container?.addEventListener("input", (e) => {
      if (e.target.dataset.action === "edit-text") {
        const subtaskCard = e.target.closest("[data-subtask-id]");
        if (!subtaskCard) return;

        const subtaskId = subtaskCard.dataset.subtaskId;
        const subtask = currentModalSubtasks.find((s) => s.id === subtaskId);
        if (subtask) {
          subtask.title = e.target.value;
        }
      }
    });
  },

  bindFormEvents() {
    const titleInput = document.getElementById("task-title-input");
    const descInput = document.getElementById("task-desc-input");
    const dueDateInput = document.getElementById("task-due-date");
    const prioritySelect = document.getElementById("task-priority-select");
    const statusSelect = document.getElementById("task-status-select");
    const tagsInput = document.getElementById("task-tags-input");
    const addBtn = document.getElementById("add-task-btn");

    const handleAddTask = () => {
      const title = titleInput?.value.trim();
      const description = descInput?.value.trim() || "";
      const dueDate = dueDateInput?.value || null;
      const priority = prioritySelect?.value || "medium";
      const status = statusSelect?.value || "todo";

      const rawTags = tagsInput?.value || "";
      const tags = rawTags
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter((tag) => tag.length > 0);

      if (!title) {
        NotificationService.show({
          type: "error",
          message: "Task title cannot be empty.",
          icon: "fa-triangle-exclamation",
          duration: 4000,
        });
        return;
      }

      GlobalLoaderService.show(`Creating task "${title}"...`);

      setTimeout(() => {
        try {
          const currentTasks = StateManager.getTasks();

          const newTaskPayload = {
            id: generateId(),
            title,
            description,
            dueDate,
            priority,
            status,
            tags,
            subtasks: [],
            archived: false,
            createdAt: todayISO(),
          };

          const updatedTasks = TaskService
            ? TaskService.createTask(currentTasks, newTaskPayload)
            : [newTaskPayload, ...currentTasks];

          StateManager.save(updatedTasks);

          if (titleInput) titleInput.value = "";
          if (descInput) descInput.value = "";
          if (dueDateInput) dueDateInput.value = "";
          if (prioritySelect) prioritySelect.value = "medium";
          if (statusSelect) statusSelect.value = "todo";
          if (tagsInput) tagsInput.value = "";

          this.mainController.refreshUI();

          NotificationService.show({
            type: "success",
            message: `Task "${title}" created successfully!`,
            icon: "fa-check",
            duration: 4000,
          });
        } catch (error) {
          NotificationService.show({
            type: "error",
            message: error.message || "Failed to create task",
            icon: "fa-triangle-exclamation",
            duration: 4000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    };

    addBtn?.addEventListener("click", handleAddTask);

    titleInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddTask();
      }
    });

    document.addEventListener("keydown", (e) => {
      const deleteModal = document.getElementById("delete-modal");
      const editModal = document.getElementById("edit-modal");

      const deleteOpen =
        deleteModal && !deleteModal.classList.contains("hidden");
      const editOpen = editModal && !editModal.classList.contains("hidden");

      if (!deleteOpen && !editOpen) return;

      if (e.key === "Escape") {
        if (deleteOpen) this.mainController.toggleModal("delete-modal", false);
        if (editOpen) this.mainController.toggleModal("edit-modal", false);
      }

      if (e.key === "Enter" && e.ctrlKey) {
        if (deleteOpen) this.executeDelete();
        if (editOpen) this.executeEdit();
      }
    });

    const addClick = (id, cb) =>
      document.getElementById(id)?.addEventListener("click", cb);

    // Modal Delete Actions
    addClick("confirm-delete-btn", () => this.executeDelete());
    addClick("confirm-delete", () => this.executeDelete());
    addClick("cancel-delete-btn", () =>
      this.mainController.toggleModal("delete-modal", false),
    );
    addClick("cancel-delete", () =>
      this.mainController.toggleModal("delete-modal", false),
    );

    // Modal Edit Actions
    addClick("confirm-edit", () => this.executeEdit());
    addClick("cancel-edit", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
    addClick("cancel-edit-modal", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
  },

  executeDelete() {
    const id = pendingDeleteId;
    if (!id) return;

    const currentTasks = StateManager.getTasks();
    const taskToDelete = currentTasks.find((h) => h.id === id);

    if (taskToDelete) {
      const capturedTask = { ...taskToDelete };

      GlobalLoaderService.show(
        `Purging "${capturedTask.title}" from database layers...`,
      );

      setTimeout(() => {
        try {
          const updated = TaskService.deleteTask(currentTasks, id);
          StateManager.save(updated);
          this.mainController.toggleModal("delete-modal", false);
          pendingDeleteId = null;
          this.mainController.refreshUI();

          NotificationService.show({
            type: "error",
            message: `Deleted "${capturedTask.title}"`,
            duration: 5000,
            undoAction: () => {
              GlobalLoaderService.show("Re-instating deleted record...");
              setTimeout(() => {
                try {
                  const latestTasks = StateManager.getTasks();
                  StateManager.save([capturedTask, ...latestTasks]);
                  this.mainController.refreshUI();
                } finally {
                  GlobalLoaderService.hide();
                }
              }, 30);
            },
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    }
  },

  executeEdit() {
    const titleInput = document.getElementById("edit-task-title");
    const descInput = document.getElementById("edit-task-desc");
    const dueDateInput = document.getElementById("edit-task-due-date");
    const prioritySelect = document.getElementById("edit-task-priority");
    const statusSelect = document.getElementById("edit-task-status");
    const tagsInput = document.getElementById("edit-task-tags");

    if (!pendingEditId || !titleInput) {
      NotificationService.show({
        type: "error",
        message: "Unable to edit task. Please try again.",
        icon: "fa-triangle-exclamation",
        duration: 4000,
      });
      return;
    }

    const newTitle = titleInput.value.trim();
    if (!newTitle) {
      NotificationService.show({
        type: "error",
        message: "Task title cannot be empty.",
        icon: "fa-triangle-exclamation",
        duration: 4000,
      });
      return;
    }

    const rawTags = tagsInput?.value || "";
    const updatedTags = rawTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    GlobalLoaderService.show("Updating task record...");

    setTimeout(() => {
      try {
        const currentTasks = StateManager.getTasks();

        const updatedTaskData = {
          title: newTitle,
          description: descInput?.value.trim() || "",
          dueDate: dueDateInput?.value || null,
          priority: prioritySelect?.value || "medium",
          status: statusSelect?.value || "todo",
          tags: updatedTags,
          subtasks: currentModalSubtasks,
        };

        const updated = TaskService.editTask
          ? TaskService.editTask(currentTasks, pendingEditId, updatedTaskData)
          : currentTasks.map((task) =>
              task.id === pendingEditId
                ? { ...task, ...updatedTaskData }
                : task,
            );

        StateManager.save(updated);
        this.mainController.toggleModal("edit-modal", false);
        pendingEditId = null;
        currentModalSubtasks = [];
        this.mainController.refreshUI();

        NotificationService.show({
          type: "success",
          message: `Task "${newTitle}" updated successfully!`,
          icon: "fa-check",
          duration: 4000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to update task",
          icon: "fa-triangle-exclamation",
          duration: 4000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },
};
