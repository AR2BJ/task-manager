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

          <div class="flex-1 pr-1 space-y-4 text-left">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="sm:col-span-2">
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
                  class="h-10.5 w-full rounded-xl bg-surface-2 border border-border px-3.5 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition"
                />
              </div>

              <div>
                <label
                  for="edit-task-due-date"
                  class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                >
                  Due Date
                </label>
                <input
                  id="edit-task-due-date"
                  type="date"
                  class="h-10.5 w-full cursor-pointer bg-surface-2 rounded-xl border border-border px-3 text-sm text-primary outline-none focus:border-brand/80 transition"
                />
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
                rows="3"
                placeholder="Add detailed acceptance criteria or execution notes..."
                class="w-full rounded-xl bg-surface-2 border border-border p-3 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  for="edit-task-priority"
                  class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                >
                  Priority
                </label>
                <select
                  id="edit-task-priority"
                  class="h-10.5 w-full bg-surface-2 cursor-pointer rounded-xl border border-border px-3 text-sm text-primary outline-none focus:border-brand/80 transition"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Blocker</option>
                </select>
              </div>

              <div>
                <label
                  for="edit-task-status"
                  class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                >
                  Status
                </label>
                <select
                  id="edit-task-status"
                  class="h-10.5 w-full bg-surface-2 cursor-pointer rounded-xl border border-border px-3 text-sm text-primary outline-none focus:border-brand/80 transition"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label
                  for="edit-task-tags"
                  class="mb-1.5 block ps-1 text-xs font-semibold text-secondary"
                >
                  Tags (Comma Separated)
                </label>
                <input
                  id="edit-task-tags"
                  type="text"
                  placeholder="dev, api, UI"
                  class="h-10.5 w-full rounded-xl bg-surface-2 border border-border px-3.5 text-sm text-primary placeholder:text-secondary/70 outline-none focus:border-brand/80 transition"
                />
              </div>
            </div>

            <div class="border-t border-border/80 pt-2"></div>

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
