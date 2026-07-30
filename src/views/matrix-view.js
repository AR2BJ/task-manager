/**
 * MatrixView Module
 * Responsible for rendering the Prioritization Matrix wrapper & handling view toggles.
 */
export const MatrixView = {
  // Local state to track selected view mode
  state: {
    currentMode: "eisenhower", // 'eisenhower' | 'abcde'
  },

  /**
   * Renders the primary layout structure
   * @returns {string} HTML string
   */
  render() {
    return `
      <section
        id="matrix-view"
        class="hidden flex-col gap-6 w-full max-w-7xl mx-auto pb-12 animate-fadeIn"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-border shadow-sm"
        >
          <div>
            <h1
              class="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2"
            >
              <i class="fa-solid fa-table-cells-large text-brand"></i>
              Prioritization Matrix
            </h1>
            <p class="text-xs sm:text-sm text-secondary mt-1">
              Analyze tasks using Eisenhower 4-Quadrant or ABCDE method.
            </p>
          </div>

          <div
            class="flex items-center p-1 bg-surface-2 rounded-xl border border-border/60 w-full sm:w-auto"
            role="tablist"
            aria-label="Prioritization Mode Switcher"
          >
            <button
              id="btn-matrix-eisenhower"
              role="tab"
              aria-selected="true"
              class="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 bg-brand text-white shadow-sm"
            >
              <i class="fa-solid fa-border-all mr-1.5"></i> Eisenhower
            </button>
            <button
              id="btn-matrix-abcde"
              role="tab"
              aria-selected="false"
              class="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 text-secondary hover:text-primary"
            >
              <i class="fa-solid fa-arrow-down-a-z mr-1.5"></i> ABCDE
            </button>
          </div>
        </div>

        <div
          id="matrix-content-container"
          class="w-full"
        ></div>
      </section>
    `;
  },

  /**
   * Initializes event listeners and handles state transitions.
   * Call this function right after mounting the HTML to the DOM.
   */
  init() {
    const btnEisenhower = document.getElementById("btn-matrix-eisenhower");
    const btnABCDE = document.getElementById("btn-matrix-abcde");

    if (!btnEisenhower || !btnABCDE) return;

    btnEisenhower.addEventListener("click", () =>
      this.switchMode("eisenhower"),
    );
    btnABCDE.addEventListener("click", () => this.switchMode("abcde"));

    // Initial render of the content container based on default state
    this.renderMatrixContent();
  },

  /**
   * Switches the active matrix mode and updates UI state accordingly.
   * @param {'eisenhower' | 'abcde'} mode
   */
  switchMode(mode) {
    if (this.state.currentMode === mode) return;

    this.state.currentMode = mode;
    this.updateToggleUI();
    this.renderMatrixContent();
  },

  /**
   * Dynamic UI update for the active/inactive toggle buttons
   */
  updateToggleUI() {
    const btnEisenhower = document.getElementById("btn-matrix-eisenhower");
    const btnABCDE = document.getElementById("btn-matrix-abcde");

    const activeClasses = ["bg-brand", "text-white", "shadow-sm"];
    const inactiveClasses = ["text-secondary", "hover:text-primary"];

    if (this.state.currentMode === "eisenhower") {
      btnEisenhower.classList.add(...activeClasses);
      btnEisenhower.classList.remove(...inactiveClasses);
      btnEisenhower.setAttribute("aria-selected", "true");

      btnABCDE.classList.remove(...activeClasses);
      btnABCDE.classList.add(...inactiveClasses);
      btnABCDE.setAttribute("aria-selected", "false");
    } else {
      btnABCDE.classList.add(...activeClasses);
      btnABCDE.classList.remove(...inactiveClasses);
      btnABCDE.setAttribute("aria-selected", "true");

      btnEisenhower.classList.remove(...activeClasses);
      btnEisenhower.classList.add(...inactiveClasses);
      btnEisenhower.setAttribute("aria-selected", "false");
    }
  },

  /**
   * Handles rendering child views inside #matrix-content-container
   */
  renderMatrixContent() {
    const container = document.getElementById("matrix-content-container");
    if (!container) return;

    if (this.state.currentMode === "eisenhower") {
      // Inject Eisenhower Sub-component view here
      container.innerHTML = `<div class="p-4 border border-dashed border-border rounded-xl text-center text-secondary">Eisenhower Quadrants Component Placeholder</div>`;
    } else {
      // Inject ABCDE Sub-component view here
      container.innerHTML = `<div class="p-4 border border-dashed border-border rounded-xl text-center text-secondary">ABCDE Method Component Placeholder</div>`;
    }
  },
};
