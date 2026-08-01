import { STORAGE_KEY, STORAGE_VERSION } from "@/models/storage.model";
import { StateManager, state } from "@/models/state.model.js";
import { formatDate, generateId } from "@/utils/helpers";

import { GlobalLoaderService } from "@/services/loader.service";
import { NotificationService } from "@/services/notification.service.js";
import { TaskController } from "./task.controller";
import { generateDynamicMockData } from "@/utils/seed-generator";

export const SettingsController = {
  keydownHandler: null,

  init() {
    this.bindSettingsEvents();
    this.renderTagsList();
  },

  bindSettingsEvents() {
    const settingsView = document.getElementById("settings-view");
    if (!settingsView) return;

    document
      .getElementById("sett-theme-light")
      ?.addEventListener("click", () => this.handleThemeSwitch("light"));
    document
      .getElementById("sett-theme-dark")
      ?.addEventListener("click", () => this.handleThemeSwitch("dark"));

    document.addEventListener("themeChanged", (event) => {
      this.syncThemeControls(
        event.detail?.theme || localStorage.getItem("theme") || "light",
      );
    });

    this.syncThemeControls(localStorage.getItem("theme") || "light");

    // Tag Events
    document
      .getElementById("sett-add-tag-btn")
      ?.addEventListener("click", () => this.handleAddTag());

    document
      .getElementById("sett-new-tag-input")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.handleAddTag();
        }
      });

    this.bindTagListActions();

    document
      .getElementById("sett-export-btn")
      ?.addEventListener("click", () => this.handleDataExport("json"));

    document
      .getElementById("sett-export-md-btn")
      ?.addEventListener("click", () => this.handleDataExport("markdown"));

    document
      .getElementById("sett-export-notion-btn")
      ?.addEventListener("click", () => this.handleDataExport("notion"));

    this.initImportDropzone();

    document
      .getElementById("sett-seed-btn")
      ?.addEventListener("click", () => this.handleDataSeeding());

    document
      .getElementById("sett-auto-archive-toggle")
      ?.addEventListener("click", () => this.handleAutoArchiveToggle());

    this.syncAutoArchiveToggle();

    // Prevent duplicated keydown listeners
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
    }

    this.keydownHandler = (e) => {
      const resetModal = document.getElementById("settings-reset-modal");
      const resetOpen = resetModal && !resetModal.classList.contains("hidden");

      if (!resetOpen) return;

      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === "Escape") this.closeResetModal();
      if (e.key === "Enter")
        document.getElementById("confirm-settings-reset")?.click();
    };

    document.addEventListener("keydown", this.keydownHandler);

    this.initResetModalEvents();

    window.addEventListener("resize", () => {
      this.syncThemeControls(localStorage.getItem("theme") || "light");
    });
  },

  renderTagsList() {
    const container = document.getElementById("sett-tags-list");
    if (!container) return;

    const tags = StateManager.getTags() || [];

    if (tags.length === 0) {
      container.innerHTML = `
        <div
          class="w-full h-full min-h-40 sm:min-h-30 lg:min-h-20 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin bg-surface-2 rounded-2xl border border-dashed border-border p-4 text-center flex flex-col justify-center items-center"
        >
          <div class="h-full flex flex-col justify-center items-center">
            <div class="text-3xl">
              <i class="fa-regular fa-tags text-brand/80"></i>
            </div>
            <p class="mt-3 text-secondary max-w-sm mx-auto text-sm">
              No tags defined yet.
            </p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = tags
      .map(
        (tag) => `
          <div
            data-tag-id="${tag.id}"
            class="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-2 border border-border/80 transition"
          >
            <div class="flex items-center gap-1 min-w-0 flex-1">
              <i class="fa-regular fa-tag text-brand/80 text-xs shrink-0"></i>
              <input
                type="text"
                value="${(tag.name || "").replace(/"/g, "&quot;")}"
                data-action="edit-tag-name"
                class="tag-name-input bg-transparent rounded-lg p-1 text-xs sm:text-sm font-medium text-primary outline-none border border-transparent transition w-full truncate"
                readonly
              />
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <button
                data-action="toggle-edit"
                class="edit-btn flex h-6 w-6 sm:w-8 sm:h-8 items-center justify-center rounded-md sm:rounded-lg border border-border bg-surface hover:bg-brand/10 hover:cursor-pointer transition"
                title="Edit tag name"
              >
                <i
                  class="fa-regular fa-pen-to-square text-xs text-brand/80"
                ></i>
              </button>
              <button
                data-action="delete-tag"
                class="delete-btn flex h-6 w-6 sm:w-8 sm:h-8 items-center justify-center rounded-md sm:rounded-lg border border-border bg-surface hover:bg-red-600/10 hover:cursor-pointer transition"
              >
                <i
                  class="fa-regular fa-trash-can text-red-500/80 text-xs"
                ></i>
              </button>
            </div>
          </div>
        `,
      )
      .join("");
  },

  handleAddTag() {
    const input = document.getElementById("sett-new-tag-input");
    if (!input) return;

    const name = input.value.trim();
    if (!name) {
      NotificationService.show({
        type: "error",
        message: "Tag name cannot be empty.",
        duration: 3000,
      });
      return;
    }

    const currentTags = StateManager.getTags() || [];
    const exists = currentTags.some(
      (t) => t.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      NotificationService.show({
        type: "error",
        message: "A tag with this name already exists.",
        duration: 3000,
      });
      return;
    }

    const newTag = {
      id: generateId(),
      name,
    };

    const updatedTags = [...currentTags, newTag];
    StateManager.save(StateManager.getTasks(), updatedTags);

    input.value = "";
    this.renderTagsList();
    TaskController.refreshUI();

    NotificationService.show({
      type: "success",
      message: `Tag "#${name}" created successfully.`,
      duration: 3000,
    });
  },

  bindTagListActions() {
    const container = document.getElementById("sett-tags-list");
    if (!container) return;

    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const tagCard = btn.closest("[data-tag-id]");
      if (!tagCard) return;

      const tagId = tagCard.dataset.tagId;
      const action = btn.dataset.action;
      const nameInput = tagCard.querySelector(".tag-name-input");

      if (action === "toggle-edit") {
        const isReadonly = nameInput.hasAttribute("readonly");
        if (isReadonly) {
          nameInput.removeAttribute("readonly");
          nameInput.classList.replace("bg-transparent", "bg-surface");
          nameInput.classList.add("focus:border-brand/50", "ps-2");
          nameInput.focus();
          nameInput.select();
          btn.setAttribute("title", "Save tag name");
          btn.innerHTML = `<i class="fa-regular fa-floppy-disk text-xs text-brand/80"></i>`;
        } else {
          this.handleSaveTagEdit(tagId, nameInput.value, btn, nameInput);
        }
      } else if (action === "delete-tag") {
        this.handleDeleteTag(tagId);
      }
    });

    container.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.classList.contains("tag-name-input")) {
        e.preventDefault();
        const tagCard = e.target.closest("[data-tag-id]");
        const tagId = tagCard?.dataset.tagId;
        const btn = tagCard?.querySelector('[data-action="toggle-edit"]');
        if (tagId && btn) {
          this.handleSaveTagEdit(tagId, e.target.value, btn, e.target);
        }
      }
    });
  },

  handleSaveTagEdit(tagId, newNameRaw, btn, nameInput) {
    const newName = newNameRaw.trim();
    if (!newName) {
      NotificationService.show({
        type: "error",
        message: "Tag name cannot be empty.",
        duration: 3000,
      });
      return;
    }

    const currentTags = StateManager.getTags() || [];
    const tag = currentTags.find((t) => t.id === tagId);

    if (tag) {
      tag.name = newName;
      StateManager.save(StateManager.getTasks(), currentTags);

      nameInput.setAttribute("readonly", "true");
      btn.innerHTML = `<i class="fa-regular fa-pen-to-square text-xs"></i>`;

      this.renderTagsList();
      TaskController.refreshUI();

      NotificationService.show({
        type: "success",
        message: "Tag updated successfully.",
        duration: 3000,
      });
    }
  },

  handleDeleteTag(tagId) {
    const currentTags = StateManager.getTags() || [];
    const targetTag = currentTags.find((t) => t.id === tagId);

    if (!targetTag) return;

    const updatedTags = currentTags.filter((t) => t.id !== tagId);

    const currentTasks = StateManager.getTasks() || [];
    const updatedTasks = currentTasks.map((task) => {
      if (Array.isArray(task.tags) && task.tags.includes(tagId)) {
        return {
          ...task,
          tags: task.tags.filter((id) => id !== tagId),
        };
      }
      return task;
    });

    StateManager.save(updatedTasks, updatedTags);
    this.renderTagsList();
    TaskController.refreshUI();

    NotificationService.show({
      type: "info",
      message: `Tag "#${targetTag.name}" deleted.`,
      duration: 3000,
    });
  },

  syncThemeControls(targetTheme) {
    const indicator = document.getElementById("theme-tab-indicator");
    const btnLight = document.getElementById("sett-theme-light");
    const btnDark = document.getElementById("sett-theme-dark");

    if (!indicator || !btnLight || !btnDark) return;

    const isDesktop = window.screen.availWidth >= 375;

    indicator.classList.remove(
      "xs:translate-x-0",
      "xs:translate-x-full",
      "translate-y-0",
      "translate-y-full",
    );

    if (targetTheme === "dark") {
      if (isDesktop) {
        indicator.classList.add("xs:translate-x-full");
      } else {
        indicator.classList.add("translate-y-full");
      }

      btnDark.classList.replace("text-secondary", "text-primary");
      btnLight.classList.replace("text-white", "text-secondary");
    } else {
      if (isDesktop) {
        indicator.classList.add("xs:translate-x-0");
      } else {
        indicator.classList.add("translate-y-0");
      }

      btnLight.classList.replace("text-secondary", "text-white");
      btnDark.classList.replace("text-primary", "text-secondary");
    }
  },

  handleThemeSwitch(targetTheme) {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === targetTheme) return;

    document.getElementById("theme-toggle")?.click();
    this.syncThemeControls(targetTheme);
  },

  handleDataExport(format = "json") {
    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const tasks = localData?.tasks || [];

    if (tasks.length === 0) {
      NotificationService.show({
        type: "info",
        message: "There is no data to export.",
        icon: "fa-circle-info",
        iconColor: "text-brand/80",
        duration: 5000,
      });
      return;
    }

    let fileContent = "";
    let fileName = "";
    let contentType = "";

    const dateStr = formatDate(new Date());

    if (format === "json") {
      fileContent = JSON.stringify(localData, null, 2);
      fileName = `Tasks_Backup_${dateStr}_v${STORAGE_VERSION}.json`;
      contentType = "application/json";
    } else if (format === "markdown") {
      fileContent = `# 📊 Task Manager Workspace Progress Report Generated:
      ${new Date().toLocaleDateString()} --- `;

      tasks.forEach((task) => {
        const tagsFormatted = (task.tags || []).map((t) => `#${t}`).join(" ");

        fileContent += `## #️⃣ ${task.id}\n`;
        fileContent += `### 🎯 ${task.title}\n`;
        fileContent += `- **Description:** ${task.description || "N/A"} `;
        fileContent += `- **Status:** ${task.status}\n`;
        fileContent += `- **Priority:** ${task.priority}\n`;
        fileContent += `- **Due Date:** 📅 ${task.dueDate || "None"}\n`;
        fileContent += `- **Estimated Time:** ⏱️ ${task.estimatedMinutes || 0} mins\n`;
        fileContent += `- **Tags:** 🏷️ ${tagsFormatted || "None"}\n`;
        fileContent += `- **Created At:** ⏰ ${task.createdAt}\n`;
        fileContent += `- **Updated At:** 🔄 ${task.updatedAt}\n`;
        fileContent += `- **Completed At:** ✅ ${task.completedAt || "N/A"}\n`;
        fileContent += `- **Archived:** ${task.archived ? "📦 Yes" : "⚡ No"}\n\n`;

        fileContent += `#### 📋 Subtasks
        (${(task.subtasks || []).filter((st) => st.completed).length}/${
          (task.subtasks || []).length
        }) `;
        if (!task.subtasks || task.subtasks.length === 0) {
          fileContent += `_No subtasks defined._\n\n`;
        } else {
          task.subtasks.forEach((st) => {
            fileContent += `- [${st.completed ? "x" : " "}] ${st.title} (ID: ${st.id})\n`;
          });
          fileContent += `\n`;
        }
        fileContent += `---\n\n`;
      });

      fileName = `Tasks_Backup_${dateStr}_v${STORAGE_VERSION}.md`;
      contentType = "text/markdown";
    } else if (format === "notion") {
      const escapeCsvValue = (value) => {
        const text = value == null ? "" : String(value);
        return `"${text.replace(/"/g, '""')}"`;
      };

      const headers = [
        "Id",
        "Title",
        "Description",
        "Status",
        "Priority",
        "Due Date",
        "Estimated Minutes",
        "Tags",
        "Created At",
        "Updated At",
        "Completed At",
        "Archived",
        "Subtasks",
      ];

      const rows = tasks.map((t) => {
        const subtasksSerialized = (t.subtasks || [])
          .map((st) => `[${st.completed ? "X" : " "}] ${st.title}`)
          .join(" | ");

        return [
          escapeCsvValue(t.id),
          escapeCsvValue(t.title),
          escapeCsvValue(t.description),
          escapeCsvValue(t.status),
          escapeCsvValue(t.priority),
          escapeCsvValue(t.dueDate),
          escapeCsvValue(t.estimatedMinutes),
          escapeCsvValue((t.tags || []).join(";")),
          escapeCsvValue(t.createdAt),
          escapeCsvValue(t.updatedAt),
          escapeCsvValue(t.completedAt),
          escapeCsvValue(t.archived ? "Yes" : "No"),
          escapeCsvValue(subtasksSerialized),
        ];
      });

      fileContent = [headers.join(","), ...rows.map((e) => e.join(","))].join(
        "\n",
      );
      fileName = `Tasks_Backup_${dateStr}_v${STORAGE_VERSION}.csv`;
      contentType = "text/csv;charset=utf-8;";
    }

    const blob = new Blob([fileContent], { type: contentType });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = fileName;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadAnchor.href);

    NotificationService.show({
      type: "success",
      message: `Database layer exported successfully as
      ${format.toUpperCase()}.`,
      icon: "fa-file-arrow-down",
      iconColor: "text-emerald-500/80",
      duration: 5000,
    });
  },

  initImportDropzone() {
    const dropzone = document.getElementById("sett-dropzone");
    const fileInput = document.getElementById("sett-import-file");

    dropzone?.addEventListener("click", () => fileInput?.click());

    dropzone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("border-brand/80", "bg-brand/5");
    });

    ["dragleave", "drop"].forEach((event) => {
      dropzone?.addEventListener(event, () => {
        dropzone.classList.remove("border-brand/80", "bg-brand/5");
      });
    });

    dropzone?.addEventListener("drop", (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length) this.processImportedFile(files[0]);
    });

    fileInput?.addEventListener("change", (e) => {
      if (e.target.files.length) this.processImportedFile(e.target.files[0]);

      setTimeout(() => {
        this.runAutoArchivePipeline();
        this.resetSession();
      }, 200);
    });
  },

  processImportedFile(file) {
    const fileName = file.name.toLowerCase();
    let format = "";

    if (file.type === "application/json" || fileName.endsWith(".json"))
      format = "json";
    else if (fileName.endsWith(".md") || fileName.endsWith(".markdown"))
      format = "markdown";
    else if (file.type === "text/csv" || fileName.endsWith(".csv"))
      format = "csv";
    else {
      NotificationService.show({
        type: "error",
        message:
          "Invalid format! Only structural JSON, MD, or CSV files are permitted.",
        icon: "fa-circle-xmark",
        iconColor: "text-red-500/80",
        duration: 5000,
      });
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async (event) => {
      GlobalLoaderService.show(
        `Parsing storage integrity from ${format.toUpperCase()}...`,
      );

      setTimeout(async () => {
        try {
          const rawContent = event.target.result;
          let importedTasks = [];
          let importedTags = [];

          if (format === "json") {
            const parsedJson = JSON.parse(rawContent);
            importedTasks = Array.isArray(parsedJson)
              ? parsedJson
              : parsedJson.tasks || [];
            importedTags = parsedJson.tags || [];
          }

          if (!Array.isArray(importedTasks) || importedTasks.length === 0) {
            throw new Error("No structured data could be extracted.");
          }

          StateManager.save(importedTasks, importedTags);

          state.activeTab = "active";
          state.currentView = "tasks";

          const { renderTaskList } =
            await import("@/views/tasks/task-list.renderer.js");
          renderTaskList(StateManager.getFilteredTasks(), state.activeTab);

          TaskController.refreshUI();
          this.renderTagsList();

          NotificationService.show({
            type: "success",
            message: `Data ledger parsed and synchronized from
            ${format.toUpperCase()} file.`,
            icon: "fa-circle-check",
            iconColor: "text-emerald-500/80",
            duration: 5000,
          });
        } catch (err) {
          console.error("Parser failure:", err);
          NotificationService.show({
            type: "error",
            message: "Failed to parse structural integrity of the file.",
            icon: "fa-triangle-exclamation",
            iconColor: "text-red-500/80",
            duration: 5000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 50);
    });

    reader.readAsText(file);
  },

  async handleDataSeeding() {
    const seedBtn = document.getElementById("sett-seed-btn");
    const seedIcon = document.getElementById("sett-seed-icon");
    const seedSpinner = document.getElementById("sett-seed-spinner");
    const seedText = document.getElementById("sett-seed-text");

    const mockDataCount = Math.floor(Math.random() * 100);

    if (seedBtn) seedBtn.disabled = true;
    if (seedIcon) seedIcon.classList.replace("flex", "hidden");
    if (seedSpinner) seedSpinner.classList.replace("hidden", "flex");
    if (seedText)
      seedText.textContent = "Processing & Constructing Database Layers...";

    NotificationService.show({
      type: "info",
      message: `Initiating massive ${mockDataCount}-task matrix
      calculation...`,
      icon: "fa-gears",
      iconColor: "text-brand/80",
      duration: 5000,
    });

    setTimeout(() => {
      this.runAutoArchivePipeline();
      this.resetSession();
    }, 200);

    setTimeout(async () => {
      try {
        const dynamicMockData = generateDynamicMockData(mockDataCount);

        StateManager.save(dynamicMockData.tasks, dynamicMockData.tags || []);

        state.activeTab = "active";
        state.currentView = "tasks";

        const { renderTaskList } =
          await import("@/views/tasks/task-list.renderer.js");
        renderTaskList(StateManager.getFilteredTasks(), state.activeTab);
        TaskController.refreshUI();
        this.renderTagsList();

        setTimeout(() => {
          NotificationService.show({
            type: "success",
            message: `Sandbox environment populated with ${mockDataCount}
            edge-case routine logs.`,
            icon: "fa-circle-check",
            iconColor: "text-emerald-500/80",
            duration: 5000,
          });

          if (seedBtn) seedBtn.disabled = false;
          if (seedIcon) seedIcon.classList.replace("hidden", "flex");
          if (seedSpinner) seedSpinner.classList.replace("flex", "hidden");
          if (seedText) seedText.textContent = "Seed Historical Mock Data";
        }, 200);
      } catch (error) {
        console.error("Critical fault inside seeding controller:", error);

        if (seedBtn) seedBtn.disabled = false;
        if (seedIcon) seedIcon.classList.replace("hidden", "flex");
        if (seedSpinner) seedSpinner.classList.replace("flex", "hidden");

        NotificationService.show({
          type: "error",
          message: error.message || "Fail-Safe Trigger: Retry Seeding",
          icon: "fa-circle-exclamation",
          iconColor: "text-red-500/80",
          duration: 5000,
        });
      }
    }, 60);
  },

  resetSession() {
    StateManager.init();
    TaskController.refreshUI();
    this.renderTagsList();
  },

  syncAutoArchiveToggle() {
    const current = localStorage.getItem("sett_auto_archive") === "true";
    const toggleBtn = document.getElementById("sett-auto-archive-toggle");
    const toggleDot = document.getElementById("sett-auto-archive-dot");

    if (current) {
      toggleBtn?.classList.replace("bg-neutral-300/80", "bg-brand/80");
      toggleBtn?.classList.replace(
        "dark:bg-neutral-700/80",
        "dark:bg-brand/80",
      );
      toggleDot?.classList.replace("translate-x-0", "translate-x-5");
    } else {
      toggleBtn?.classList.replace("bg-brand/80", "bg-neutral-300/80");
      toggleBtn?.classList.replace(
        "dark:bg-brand/80",
        "dark:bg-neutral-700/80",
      );
      toggleDot?.classList.replace("translate-x-5", "translate-x-0");
    }
  },

  handleAutoArchiveToggle() {
    const current = localStorage.getItem("sett_auto_archive") === "true";
    const nextState = !current;
    localStorage.setItem("sett_auto_archive", nextState ? "true" : "false");

    this.syncAutoArchiveToggle();

    NotificationService.show({
      type: "info",
      message: `Autonomous archiving pipeline has been
      ${nextState ? "activated" : "deactivated"}.`,
      icon: "fa-robot",
      iconColor: "text-brand/80",
      duration: 5000,
    });

    if (nextState) this.runAutoArchivePipeline();
  },

  runAutoArchivePipeline() {
    if (localStorage.getItem("sett_auto_archive") !== "true") return;

    const tasks = StateManager.getTasks() || [];
    if (tasks.length === 0) return;

    let modified = false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    tasks.forEach((task) => {
      if (task.archived === true) return;

      const allActivityDates = [...(task.completedDates || [])];
      let lastActivityDateStr = task.createdAt;

      if (allActivityDates.length > 0) {
        allActivityDates.sort();
        lastActivityDateStr = allActivityDates[allActivityDates.length - 1];
      }

      const lastActivityDate = new Date(lastActivityDateStr);
      lastActivityDate.setHours(0, 0, 0, 0);

      const msDiff = todayTimestamp - lastActivityDate.getTime();
      const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));

      if (daysDiff >= 30) {
        task.archived = true;
        modified = true;
      }
    });

    if (modified) {
      StateManager.save(tasks);
      TaskController.refreshUI();

      NotificationService.show({
        type: "info",
        message:
          "Stale tasks exceeding 30 days structural limits auto-archived.",
        icon: "fa-box-archive",
        iconColor: "text-brand/80",
        duration: 5000,
      });
    }
  },

  closeResetModal() {
    const resetModal = document.getElementById("settings-reset-modal");
    if (!resetModal) return;

    resetModal.classList.add("hidden");
    resetModal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");
  },

  initResetModalEvents() {
    const triggerResetBtn = document.getElementById("trigger-reset-btn");
    const resetModal = document.getElementById("settings-reset-modal");
    const cancelResetBtn = document.getElementById("cancel-settings-reset");
    const confirmResetBtn = document.getElementById("confirm-settings-reset");

    triggerResetBtn?.addEventListener("click", () => {
      resetModal?.classList.replace("hidden", "flex");
      document.body.classList.add("overflow-hidden");
    });
    cancelResetBtn?.addEventListener("click", () => this.closeResetModal());

    confirmResetBtn?.addEventListener("click", () => {
      this.closeResetModal();
      this.executeApplicationReset();
    });
  },

  async executeApplicationReset() {
    const previousPayload = localStorage.getItem(STORAGE_KEY);
    const previousTasks = StateManager.getTasks().map((task) => ({ ...task }));
    const previousTags = StateManager.getTags().map((tag) => ({ ...tag }));

    this.closeResetModal();

    GlobalLoaderService.show("Purging storage layers & resetting workspace...");

    setTimeout(async () => {
      try {
        localStorage.removeItem(STORAGE_KEY);

        state.tasks = [];
        state.tags = [];
        state.activeTab = "active";
        state.currentView = "tasks";

        const { renderTaskList } =
          await import("@/views/tasks/task-list.renderer.js");
        renderTaskList([], state.activeTab);

        TaskController.refreshUI();
        this.renderTagsList();

        NotificationService.show({
          type: "error",
          message:
            "Application synchronization storage has been completely cleared.",
          duration: 5000,
          undoAction: async () => {
            GlobalLoaderService.show(
              "Re-instating application database state...",
            );
            setTimeout(async () => {
              try {
                if (previousPayload) {
                  localStorage.setItem(STORAGE_KEY, previousPayload);
                } else {
                  localStorage.removeItem(STORAGE_KEY);
                }

                StateManager.save(previousTasks || [], previousTags || []);
                state.tasks = previousTasks || [];
                state.tags = previousTags || [];

                state.activeTab = "active";
                state.currentView = "tasks";

                const { renderTaskList: reloadList } =
                  await import("@/views/tasks/task-list.renderer.js");
                reloadList(StateManager.getFilteredTasks(), state.activeTab);
                TaskController.refreshUI();
                this.renderTagsList();
              } finally {
                GlobalLoaderService.hide();
              }
            }, 30);
          },
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 50);
  },
};
