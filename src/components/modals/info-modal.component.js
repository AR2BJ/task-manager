export const InfoModalComponent = {
  render() {
    return `
      <div
        id="help-modal"
        class="min-h-screen fixed inset-0 z-50 hidden items-center justify-center animate-fade-in p-3 sm:p-4 md:p-6"
      >
        <div
          id="help-modal-backdrop"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        ></div>

        <div
          class="relative w-full max-w-2xl bg-surface border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl transition-all scale-95 flex flex-col max-h-[75vh] md:max-h-[80vh] h-auto"
        >
          <div
            class="flex justify-between items-center mb-4 sm:mb-5 border-b border-border pb-3 sm:pb-4 shrink-0"
          >
            <div class="flex items-center gap-2.5 sm:gap-3">
              <div
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-lg lg:rounded-xl bg-brand/10 text-brand/80 flex items-center justify-center text-xl sm:text-2xl shrink-0"
              >
                <i class="fa-regular fa-square-terminal"></i>
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-bold text-primary">
                  Task Manager Help Center
                </h3>
                <p class="text-[11px] sm:text-xs text-secondary max-w-50 sm:max-w-none">
                  Task editing tips and shortcuts.
                </p>
              </div>
            </div>

            <button
              id="close-help-modal"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg lg:rounded-xl bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-primary flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <i class="fa-regular fa-xmark text-sm sm:text-base"></i>
            </button>
          </div>

          <div
            class="flex flex-col md:flex-row border-b md:border-b-0 border-border/60 p-1 bg-surface-2 rounded-xl mb-4 sm:mb-5 shrink-0 gap-1.5"
          >
            <button
              id="tab-help-safeguard"
              class="w-full md:flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-brand/30 text-primary border border-brand/40 transition cursor-pointer"
            >
              <i class="fa-regular fa-list-check me-1.5"></i> Task Guide
            </button>
            <button
              id="tab-help-shortcuts"
              class="w-full md:flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg text-secondary hover:text-primary transition cursor-pointer"
            >
              <i class="fa-regular fa-keyboard me-1.5"></i> Keyboard Shortcuts
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto pr-1 sm:pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-surface-2 min-h-0"
            id="help-modal-content"
          >
            <div
              id="content-help-safeguard"
              class="flex flex-col gap-3 sm:gap-3.5"
            >
              <div class="p-3.5 sm:p-4 bg-brand/5 border border-brand/10 rounded-xl sm:rounded-2xl">
                <h4
                  class="text-xs sm:text-sm font-bold text-brand uppercase tracking-wide flex items-center gap-2"
                >
                  <i class="fa-regular fa-layer-group"></i> Subtasks & Progress
                </h4>
                <p
                  class="text-xs sm:text-sm text-secondary mt-1.5 leading-relaxed"
                >
                  Break complex tasks into actionable subtasks inside the Edit
                  Modal. Track completion progress dynamically as subtasks are
                  marked done.
                </p>
              </div>

              <div
                class="p-3.5 sm:p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl sm:rounded-2xl"
              >
                <h4
                  class="text-xs sm:text-sm font-bold text-emerald-500/80 uppercase tracking-wide flex items-center gap-2"
                >
                  <i class="fa-regular fa-tags"></i> Dynamic Tags & Combobox
                </h4>
                <p
                  class="text-xs sm:text-sm text-secondary mt-1.5 leading-relaxed"
                >
                  Organize tasks using tags. Press
                  <kbd
                    class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded font-mono shadow-2xs"
                    >Enter</kbd
                  >
                  or
                  <kbd
                    class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded font-mono shadow-2xs"
                    >,</kbd
                  >
                  to confirm a new tag, or select existing tags from the smart
                  combobox dropdown.
                </p>
              </div>

              <div
                class="p-3.5 sm:p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl sm:rounded-2xl"
              >
                <h4
                  class="text-xs sm:text-sm font-bold text-amber-500/80 uppercase tracking-wide flex items-center gap-2"
                >
                  <i class="fa-regular fa-bolt"></i> Quick Modal Actions
                </h4>
                <p
                  class="text-xs sm:text-sm text-secondary mt-1.5 leading-relaxed"
                >
                  Inside open modals, press
                  <kbd
                    class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded font-mono shadow-2xs"
                    >Ctrl + Enter</kbd
                  >
                  to quickly execute save/delete actions, or
                  <kbd
                    class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded font-mono shadow-2xs"
                    >Esc</kbd
                  >
                  to dismiss.
                </p>
              </div>
            </div>

            <div
              id="content-help-shortcuts"
              class="hidden space-y-2.5 sm:space-y-3 overflow-y-auto pr-1"
            >
              <div
                class="text-xs font-bold text-brand/80 uppercase tracking-wider mb-1.5 pl-1"
              >
                Navigation
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-rectangle-history text-muted"></i> Go
                  to Tasks View
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Shift</kbd
                  >
                  <span class="text-[10px] text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >T</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-chart-mixed text-muted"></i> Go to
                  Analytics Dashboard
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Shift</kbd
                  >
                  <span class="text-[10px] text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >A</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-sliders text-muted"></i> Go to App
                  Settings
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Shift</kbd
                  >
                  <span class="text-[10px] text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >S</kbd
                  >
                </div>
              </div>

              <div
                class="text-xs font-bold text-brand/80 uppercase tracking-wider mt-4 mb-1.5 pl-1"
              >
                Quick Actions
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-chevron-square-up text-muted"></i>
                  Scrolling To Top
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >B</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-square-minus text-muted"></i> Collapse
                  / Expand Task Form
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >C</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-circle-half-stroke text-muted"></i>
                  Toggle Dark/Light Theme
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >T</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-bars text-muted"></i>
                  Toggle Navigation Menu
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >N</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-arrow-rotate-left text-muted"></i>
                  Open Reset Data Modal
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >R</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-xmark text-muted"></i> Close Active
                  Modal / Blur Input
                </span>
                <kbd
                  class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md shrink-0"
                  >Esc</kbd
                >
              </div>

              <div
                class="text-xs font-bold text-brand/80 uppercase tracking-wider mt-4 mb-1.5 pl-1"
              >
                Filters & Global
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-magnifying-glass text-muted"></i>
                  Quick Search / Filter
                </span>
                <kbd
                  class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md shrink-0"
                  >/</kbd
                >
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-eye text-muted"></i> Switch Tab View
                  (Active / Completed / Archived)
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >A</kbd
                  >
                  <span class="text-[10px] text-muted">/</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >D</kbd
                  >
                  <span class="text-[10px] text-muted">/</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >X</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-chart-line text-muted"></i> Switch
                  Chart View (Weekly / Monthly / Yearly)
                </span>
                <div class="flex items-center gap-1 shrink-0">
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md"
                    >1 - 3</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-filter text-muted"></i> Quick Tags
                  Select (Tasks View)
                </span>
                <kbd
                  class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md shrink-0"
                  >0 - <span class="text-sm">∞</span></kbd
                >
              </div>

              <div
                class="flex items-center justify-between p-2.5 sm:p-3 bg-surface-2/60 border border-border/50 rounded-xl hover:border-border transition gap-2"
              >
                <span
                  class="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-circle-question text-muted"></i>
                  Toggle This Help Center
                </span>
                <kbd
                  class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-primary bg-surface border border-border shadow-2xs rounded-md shrink-0"
                  >?</kbd
                >
              </div>
            </div>
          </div>

          <div
            class="flex justify-end mt-3 sm:mt-4 shrink-0 border-t border-border pt-3 sm:pt-4"
          >
            <button
              id="btn-close-help"
              class="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm rounded-lg lg:rounded-xl bg-brand/80 text-white font-semibold hover:bg-(--color-brand-hover) transition cursor-pointer shadow-lg shadow-brand/10"
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
