export const EditModalsComponent = {
  render() {
    return `
      <div
        id="edit-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface rounded-2xl p-6 max-w-3xl w-full max-h-[94vh] shadow-2xl flex flex-col border border-border overflow-hidden"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-4 shrink-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-2xl bg-brand/10 text-brand/80 flex items-center justify-center text-lg shrink-0"
              >
                <i class="fa-regular fa-pen-to-square"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-primary">
                  Edit Task Details
                </h3>
                <p class="text-xs text-secondary">
                  Update task attributes and manage subtasks in a cleaner
                  layout.
                </p>
              </div>
            </div>

            <button
              id="cancel-edit-modal"
              class="w-9 h-9 rounded-xl bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-primary flex items-center justify-center transition cursor-pointer"
            >
              <i class="fa-regular fa-xmark text-sm"></i>
            </button>
          </div>

          <div
            id="edit-accordion-group"
            class="flex-1 min-h-0 flex flex-col gap-3 py-4 overflow-hidden"
          >
            <div
              class="accordion-item flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
            >
              <button
                type="button"
                class="accordion-header w-full p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="fa-regular fa-file-lines text-base"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-primary">
                      Basic Information
                    </h4>
                    <p class="text-xs leading-5 text-secondary">
                      Set the core task details and timeline.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon fa-regular fa-chevron-up text-secondary text-sm transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content p-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      for="edit-task-title"
                      class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                    >
                      Task Title <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="edit-task-title"
                      type="text"
                      placeholder="Task title..."
                      class="h-11 w-full rounded-xl bg-surface border border-border px-3.5 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition"
                    />
                  </div>

                  <div>
                    <label
                      for="edit-task-duedate"
                      class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                    >
                      Due Date
                    </label>
                    <div id="edit-datepicker-container"></div>
                  </div>
                </div>

                <div class="mt-4">
                  <label
                    for="edit-task-desc"
                    class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-task-desc"
                    rows="3"
                    placeholder="Add detailed acceptance criteria or execution notes..."
                    class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl bg-surface border border-border p-3 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div
              class="accordion-item flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
            >
              <button
                type="button"
                class="accordion-header w-full p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="fa-regular fa-sliders text-base"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-primary">
                      Priority & Organization
                    </h4>
                    <p class="text-xs leading-5 text-secondary">
                      Adjust priority, status, and labels for better tracking.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon fa-regular fa-chevron-down text-secondary text-sm transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content hidden p-4">
                <div class="relative w-full">
                  <label
                    for="edit-task-tags-input"
                    class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                  >
                    Tags
                  </label>

                  <div class="relative flex items-center">
                    <div
                      id="edit-task-tags-container"
                      class="max-h-16.5 overflow-y-auto scrollbar-thin scrollbar-thumb-surface w-full flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface-2 p-2 pe-10 focus-within:border-brand/80 focus-within:ring-1 focus-within:ring-brand/30 transition cursor-pointer"
                    >
                      <input
                        id="edit-task-tags-input"
                        type="text"
                        placeholder="Type tag and press Enter..."
                        class="flex-1 min-w-30 ps-2 pe-10 truncate bg-transparent text-sm text-primary  placeholder:text-secondary/70 outline-none h-7 pb-1 cursor-text focus:outline-none"
                        autocomplete="off"
                      />
                    </div>

                    <button
                      type="button"
                      id="edit-task-tags-chevron-btn"
                      class="flex absolute right-3 text-secondary hover:text-primary transition duration-200 pointer-events-none"
                      tabindex="-1"
                    >
                      <i
                        id="edit-task-tags-chevron-icon"
                        class="fa-solid fa-chevron-down text-xs"
                      ></i>
                    </button>
                  </div>

                  <div
                    id="edit-tags-combobox-dropdown"
                    class="hidden max-h-40 overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl backdrop-blur-md scrollbar-thin scrollbar-thumb-surface-2"
                  ></div>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div class="w-full">
                    <label
                      for="edit-task-priority"
                      class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                    >
                      Priority
                    </label>
                    <div
                      id="edit-priority-wrapper"
                      class="w-full"
                    ></div>
                  </div>

                  <div class="w-full">
                    <label
                      for="edit-task-status"
                      class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                    >
                      Status
                    </label>
                    <div
                      id="edit-status-wrapper"
                      class="w-full"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="accordion-item flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
            >
              <button
                type="button"
                class="accordion-header w-full p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="fa-regular fa-list-check text-base"></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-primary">
                      Subtasks Management
                    </h4>
                    <p class="text-xs leading-5 text-secondary">
                      Add and track execution steps while keeping progress
                      visible.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span
                    id="subtask-progress-badge"
                    class="text-xs font-mono text-secondary px-3 py-1 rounded-lg bg-surface border border-border shrink-0"
                  >
                    0/0 Done
                  </span>
                  <i
                    class="accordion-icon fa-regular fa-chevron-down text-secondary text-sm transition-transform duration-200"
                  ></i>
                </div>
              </button>

              <div
                class="accordion-content hidden p-4 flex-col gap-4"
              >
                <div
                  class="flex items-center gap-2 rounded-xl border border-border bg-surface"
                >
                  <input
                    id="new-subtask-input"
                    type="text"
                    placeholder="Add a new subtask item..."
                    class="h-11 flex-1 rounded-xl bg-transparent px-4 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition"
                  />
                  <button
                    id="add-subtask-btn"
                    type="button"
                    class="h-11 px-4 rounded-e-xl bg-brand/10 text-brand/80 transition hover:bg-brand/20 font-semibold text-sm flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <i class="fa-regular fa-plus"></i> Add
                  </button>
                </div>

                <div
                  id="edit-subtasks-list"
                  class="w-full"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-2 gap-3 pt-3 border-t border-border shrink-0"
          >
            <button
              id="cancel-edit"
              type="button"
              class="h-12 rounded-xl bg-surface-2 hover:border-primary text-secondary hover:text-primary font-medium text-sm transition border border-border cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>

            <button
              id="confirm-edit"
              type="button"
              class="h-12 rounded-xl bg-brand/80 hover:bg-brand text-white font-medium text-sm transition shadow-md shadow-brand/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <i class="fa-regular fa-check"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
