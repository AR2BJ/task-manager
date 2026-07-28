import { generateId, todayISO } from "@/utils/helpers";

import { AutocompleteComponent } from "@/components/ui/autocomplete.component";
import { ComboboxComponent } from "@/components/ui/combobox.component";
import { DatePickerComponent } from "@/components/ui/date-picker.component";
import { GlobalLoaderService } from "@/services/loader.service";
import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";
import { TaskService } from "@/services/task.service.js";

let pendingDeleteId = null;
let pendingEditId = null;

// Combobox instances
let createTaskCombobox = null;
let editTaskCombobox = null;

// DatePicker instances
let createDatePicker = null;
let editDatePicker = null;

// Autocomplete instances (Create Form)
let createPriorityAutocomplete = null;
let createStatusAutocomplete = null;

// Autocomplete instances (Edit Form)
let editPriorityAutocomplete = null;
let editStatusAutocomplete = null;

let currentModalSubtasks = [];

const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low Priority",
    icon: "fa-solid fa-flag text-emerald-400",
  },
  {
    value: "medium",
    label: "Medium Priority",
    icon: "fa-solid fa-flag text-amber-400",
  },
  {
    value: "high",
    label: "High Priority",
    icon: "fa-solid fa-flag text-red-500",
  },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", icon: "fa-regular fa-square text-sky-500" },
  {
    value: "in_progress",
    label: "In Progress",
    icon: "fa-regular fa-arrow-progress text-amber-500",
  },
  {
    value: "done",
    label: "Done",
    icon: "fa-regular fa-square-check text-emerald-500",
  },
  {
    value: "blocked",
    label: "Blocked",
    icon: "fa-regular fa-ban text-red-500",
  },
];

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

    createTaskCombobox = new ComboboxComponent({
      containerId: "task-tags-container",
      inputId: "task-tags-input",
      dropdownId: "tags-combobox-dropdown",
      chevronBtnId: "task-tags-input-chevron-btn",
      iconClass: "fa-regular fa-tag",
      itemTypeLabel: "Tag",
      options: () => {
        const tasks = StateManager.getTasks();
        return Array.from(new Set(tasks.flatMap((t) => t.tags || []))).sort();
      },
    });

    this.setupDatePicker("create");

    this.setupCreateAutocompletes();

    this.bindFormEvents();
    this.bindSubtaskEvents();
    this.bindAccordionEvents();
  },

  setupCreateAutocompletes() {
    const priorityWrapper = document.getElementById("create-priority-wrapper");
    const statusWrapper = document.getElementById("create-status-wrapper");

    if (priorityWrapper) {
      createPriorityAutocomplete = new AutocompleteComponent({
        id: "task-priority-autocomplete",
        placeholder: "Select Priority...",
        value: "low",
        options: PRIORITY_OPTIONS,
      });
      priorityWrapper.innerHTML = createPriorityAutocomplete.render();
      createPriorityAutocomplete.bindEvents();
    }

    if (statusWrapper) {
      createStatusAutocomplete = new AutocompleteComponent({
        id: "task-status-autocomplete",
        placeholder: "Select Status...",
        value: "todo",
        options: STATUS_OPTIONS,
      });
      statusWrapper.innerHTML = createStatusAutocomplete.render();
      createStatusAutocomplete.bindEvents();
    }
  },

  populateEditModal(taskId) {
    if (editTaskCombobox) editTaskCombobox.destroy();
    if (editPriorityAutocomplete) editPriorityAutocomplete.destroy();
    if (editStatusAutocomplete) editStatusAutocomplete.destroy();

    this.resetAccordionToFirstItem();

    const tasks = StateManager.getTasks();
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    const titleInput = document.getElementById("edit-task-title");
    const descInput = document.getElementById("edit-task-desc");

    if (titleInput) titleInput.value = task.title || "";
    if (descInput) descInput.value = task.description || "";

    const priorityWrapper = document.getElementById("edit-priority-wrapper");
    const statusWrapper = document.getElementById("edit-status-wrapper");

    if (priorityWrapper) {
      editPriorityAutocomplete = new AutocompleteComponent({
        id: "edit-priority-autocomplete",
        placeholder: "Select Priority...",
        value: task.priority || "low",
        background: "surface",
        options: PRIORITY_OPTIONS,
      });
      priorityWrapper.innerHTML = editPriorityAutocomplete.render();
      editPriorityAutocomplete.bindEvents();
    }

    if (statusWrapper) {
      editStatusAutocomplete = new AutocompleteComponent({
        id: "edit-status-autocomplete",
        placeholder: "Select Status...",
        value: task.status || "todo",
        background: "surface",
        options: STATUS_OPTIONS,
      });
      statusWrapper.innerHTML = editStatusAutocomplete.render();
      editStatusAutocomplete.bindEvents();
    }

    editTaskCombobox = new ComboboxComponent({
      containerId: "edit-task-tags-container",
      inputId: "edit-task-tags-input",
      dropdownId: "edit-tags-combobox-dropdown",
      chevronBtnId: "edit-task-tags-chevron-btn",
      initialValues: Array.isArray(task.tags) ? [...task.tags] : [],
      iconClass: "fa-regular fa-tag",
      itemTypeLabel: "Tag",
      options: () => {
        const tasksList = StateManager.getTasks();
        return Array.from(
          new Set(tasksList.flatMap((t) => t.tags || [])),
        ).sort();
      },
    });

    editTaskCombobox.bindEvents();

    this.setupDatePicker("edit", task.dueDate || "");

    currentModalSubtasks = (
      task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : []
    ).map((subtask) => ({
      ...subtask,
      isEditing: false,
    }));
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
        class="w-full h-full min-h-70 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin bg-surface rounded-2xl border border-dashed border-border/70 p-4 text-center"
      >
        <div class="h-full flex flex-col justify-center items-center">
          <div class="text-3xl">
            <i class="fa-regular fa-list-check text-brand/80"></i>
          </div>
          <p class="mt-3 text-secondary max-w-sm mx-auto text-sm">
            No subtasks defined yet.
          </p>
        </div>
      </div>
    `;
      return;
    }

    container.innerHTML = `
    <div
      class="w-full h-full max-h-48 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin  bg-surface rounded-2xl border border-border/60 p-2.5 flex flex-col justify-start gap-2.5"
    >
      ${currentModalSubtasks
        .map(
          (subtask) => `
            <div
              data-subtask-id="${subtask.id}"
              class="subtask-item flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-2 p-1 shadow-sm transition"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="text"
                  data-action="edit-text"
                  value="${(subtask.title ?? "").replace(/"/g, "&quot;")}"
                  class="subtask-title-input text-sm text-primary mx-3 bg-transparent outline-none w-full border-b min-h-7 py-1 ${
                    subtask.isEditing ? "border-brand/50" : "border-transparent"
                  } ${subtask.completed ? "line-through text-muted" : ""}"
                  ${subtask.isEditing ? "" : "readonly"}
                />
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <button
                  data-action="edit"
                  class="edit-btn flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface hover:bg-brand/10 hover:cursor-pointer transition"
                  title="${subtask.isEditing ? "Save changes" : "Edit subtask"}"
                >
                  <i
                    class="fa-regular ${
                      subtask.isEditing ? "fa-floppy-disk" : "fa-pen-to-square"
                    } text-blue-500/80 text-base"
                  ></i>
                </button>

                <button
                  data-action="delete"
                  class="delete-btn flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface hover:bg-red-600/10 hover:cursor-pointer transition"
                >
                  <i
                    class="fa-regular fa-trash-can text-red-500/80 text-base"
                  ></i>
                </button>
              </div>
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
      } else if (action === "edit") {
        const subtask = currentModalSubtasks.find((s) => s.id === subtaskId);
        if (subtask) {
          subtask.isEditing = !subtask.isEditing;
          this.renderModalSubtasks();

          if (subtask.isEditing) {
            requestAnimationFrame(() => {
              const input = container?.querySelector(
                `[data-subtask-id="${subtaskId}"] .subtask-title-input`,
              );
              input?.focus();
              input?.select();
            });
          }
        }
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
    const addBtn = document.getElementById("add-task-btn");

    const handleAddTask = () => {
      const title = titleInput?.value.trim();
      const description = descInput?.value.trim() || "";

      const priority = createPriorityAutocomplete
        ? createPriorityAutocomplete.getValue()
        : "low";
      const status = createStatusAutocomplete
        ? createStatusAutocomplete.getValue()
        : "todo";
      const dueDate = createDatePicker ? createDatePicker.value : null;
      const tags = createTaskCombobox
        ? createTaskCombobox.getSelectedValues()
        : [];

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

          createPriorityAutocomplete?.setValue("low");
          createStatusAutocomplete?.setValue("todo");
          createTaskCombobox?.reset();
          createDatePicker?.reset();

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

  bindAccordionEvents() {
    const accordionGroup = document.getElementById("edit-accordion-group");
    if (!accordionGroup) return;

    accordionGroup.addEventListener("click", (e) => {
      const header = e.target.closest(".accordion-header");
      if (!header) return;

      const currentItem = header.closest(".accordion-item");
      const currentContent = currentItem.querySelector(".accordion-content");

      if (!currentContent.classList.contains("hidden")) return;

      const allItems = accordionGroup.querySelectorAll(".accordion-item");
      const currentIndex = Array.from(allItems).indexOf(currentItem);

      allItems.forEach((item, index) => {
        const content = item.querySelector(".accordion-content");
        const icon = item.querySelector(".accordion-icon");
        const itemHeader = item.querySelector(".accordion-header");

        if (index === currentIndex) {
          content.classList.remove("hidden");

          if (index === 2) {
            content.classList.add("flex");
          } else {
            content.classList.remove("flex");
          }
        } else {
          content.classList.add("hidden");
          content.classList.remove("flex");
        }

        itemHeader?.classList.toggle("border-b", index === currentIndex);
        icon?.classList.toggle("fa-chevron-up", index === currentIndex);
        icon?.classList.toggle("fa-chevron-down", index !== currentIndex);
      });
    });
  },

  resetAccordionToFirstItem() {
    const accordionGroup = document.getElementById("edit-accordion-group");
    if (!accordionGroup) return;

    const items = accordionGroup.querySelectorAll(".accordion-item");
    items.forEach((item, index) => {
      const header = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");
      const icon = item.querySelector(".accordion-icon");

      if (index === 0) {
        content.classList.remove("hidden");
        header.classList.add("border-b");
        if (icon) {
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        }
      } else {
        content.classList.add("hidden");
        header.classList.remove("border-b");
        if (icon) {
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        }
      }
    });
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

    if (!pendingEditId || !titleInput) return;

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

    const updatedDueDate = editDatePicker ? editDatePicker.value : null;
    const updatedPriority = editPriorityAutocomplete
      ? editPriorityAutocomplete.getValue()
      : "low";
    const updatedStatus = editStatusAutocomplete
      ? editStatusAutocomplete.getValue()
      : "todo";
    const updatedTags = editTaskCombobox
      ? editTaskCombobox.getSelectedValues()
      : [];

    if (editTaskCombobox) editTaskCombobox.destroy();
    if (editPriorityAutocomplete) editPriorityAutocomplete.destroy();
    if (editStatusAutocomplete) editStatusAutocomplete.destroy();

    GlobalLoaderService.show("Updating task record...");

    setTimeout(() => {
      try {
        const currentTasks = StateManager.getTasks();

        const updatedTaskData = {
          title: newTitle,
          description: descInput?.value.trim() || "",
          dueDate: updatedDueDate,
          priority: updatedPriority,
          status: updatedStatus,
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
        editTaskCombobox = null;
        editDatePicker = null;
        editPriorityAutocomplete = null;
        editStatusAutocomplete = null;
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

  setupDatePicker(action, initialValue = "") {
    if (action === "create") {
      const container = document.getElementById("create-datepicker-container");
      if (!container) return;

      createDatePicker = new DatePickerComponent({
        id: "task-duedate-input",
        value: initialValue,
        placeholder: "YYYY-MM-DD",
        background: "surface",
      });

      container.innerHTML = createDatePicker.render();
      createDatePicker.bindEvents();
    } else {
      const container = document.getElementById("edit-datepicker-container");
      if (!container) return;

      editDatePicker = new DatePickerComponent({
        id: "edit-task-duedate",
        value: initialValue,
        placeholder: "YYYY-MM-DD",
        background: "surface",
      });

      container.innerHTML = editDatePicker.render();
      editDatePicker.bindEvents();
    }
  },
};
