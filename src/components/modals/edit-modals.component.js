export const EditModalsComponent = {
  render() {
    return `
      <div
        id="edit-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col gap-5 border border-border overflow-hidden"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-brand/10 text-brand/80 flex items-center justify-center text-lg shrink-0"
              >
                <i class="fa-regular fa-pen-to-square"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-primary">
                  Edit Task Details
                </h3>
                <p class="text-xs text-secondary">
                  Update task attributes and manage execution sub-items.
                </p>
              </div>
            </div>
            <button
              id="cancel-edit-modal"
              class="w-8 h-8 rounded-lg bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-primary flex items-center justify-center transition cursor-pointer"
            >
              <i class="fa-regular fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="flex-1 pr-1 space-y-4 text-left overflow-y-auto">
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
                  class="h-11 w-full rounded-xl bg-surface-2 border border-border px-3.5 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition"
                />
              </div>

              <div>
                <label
                  for="edit-task-duedate"
                  class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                  >Due Date</label
                >
                <div id="edit-datepicker-container"></div>
              </div>
            </div>

            <div>
              <label
                for="edit-task-desc"
                class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
              >
                Description
              </label>
              <textarea
                id="edit-task-desc"
                rows="2"
                placeholder="Add detailed acceptance criteria or execution notes..."
                class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl bg-surface-2 border border-border p-3 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  class="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-surface w-full flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface-2 p-2 pe-10 focus-within:border-brand/80 focus-within:ring-1 focus-within:ring-brand/30 transition cursor-pointer"
                >
                  <input
                    id="edit-task-tags-input"
                    type="text"
                    placeholder="Type tag and press Enter..."
                    class="flex-1 min-w-30 pe-10 truncate bg-transparent text-sm text-primary  placeholder:text-secondary/70 outline-none h-7 pb-1 cursor-text focus:outline-none"
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

            <div class="border-t border-border/80 pt-2 mb-1"></div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label
                  class="ps-1 text-xs font-semibold text-secondary flex items-center gap-1.5"
                >
                  <i
                    class="fa-regular fa-list-check text-brand/80 text-base"
                  ></i>
                  Subtasks Execution List
                </label>
                <span
                  id="subtask-progress-badge"
                  class="text-[11px] font-mono text-secondary px-2 py-0.5 rounded-md bg-surface-2 border border-border"
                >
                  0/0 Done
                </span>
              </div>

              <div class="flex items-center gap-2">
                <input
                  id="new-subtask-input"
                  type="text"
                  placeholder="Add a new subtask item..."
                  class="h-10 flex-1 rounded-lg bg-surface-2 border border-border px-3.5 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition"
                />
                <button
                  id="add-subtask-btn"
                  type="button"
                  class="h-10 px-4 rounded-lg bg-brand/10 text-brand/80 transition hover:bg-brand/20 font-semibold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <i class="fa-regular fa-plus"></i> Add
                </button>
              </div>

              <div
                id="edit-subtasks-list"
                class="flex"
              >
                <div
                  class="w-full min-h-20 overflow-y-auto scrollbar-thumb-surface scrollbar-thin bg-surface-2 border border-dashed border-border rounded-lg p-2 text-center"
                >
                  <div class="h-20 flex flex-col justify-center items-center">
                    <div class="text-3xl">
                      <i class="fa-regular fa-list-check text-brand/80"></i>
                    </div>
                    <p class="mt-2 text-secondary max-w-sm mx-auto text-sm">
                      No subtasks defined yet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <button
              id="cancel-edit"
              type="button"
              class="h-11 rounded-xl bg-(--color-surface-3) hover:border-primary text-secondary hover:text-primary font-medium text-sm transition border border-border cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>

            <button
              id="confirm-edit"
              type="button"
              class="h-11 rounded-xl bg-brand/80 hover:bg-brand text-white font-medium text-sm transition shadow-md shadow-brand/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <i class="fa-regular fa-check"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
