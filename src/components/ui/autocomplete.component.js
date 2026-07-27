import { StateManager } from "@/models/state.model.js";

export class Autocomplete {
  constructor({ containerId, inputId, dropdownId, initialTags = [] }) {
    this.container = document.getElementById(containerId);
    this.input = document.getElementById(inputId);
    this.dropdown = document.getElementById(dropdownId);

    this.isLoading = false;

    this.tags = Array.isArray(initialTags)
      ? Array.from(
          new Set(
            initialTags.map((t) => t.trim().toLowerCase()).filter(Boolean),
          ),
        )
      : [];

    this._onOutsideClick = this._handleOutsideClick.bind(this);
    this._onScrollOrResize = this._handleScrollOrResize.bind(this);

    this._handleFocus = () => this.handleInput();
    this._handleClick = () => this.handleInput();
    this._handleInput = () => this.handleInput();
    this._handleKeyDown = (e) => this.handleKeyDown(e);
    this._handleContainerClick = (e) => {
      if (e.target !== this.input && !e.target.closest(".remove-tag-btn")) {
        this.input.focus();
        this.handleInput();
      }
    };
    this._handleDropdownMouseDown = (e) => {
      const item = e.target.closest(".autocomplete-item");
      if (item) {
        e.preventDefault();
        e.stopPropagation();
        const tag = item.dataset.tag;
        if (tag) {
          this.addTag(tag);
          this.input.value = "";
          this.hideDropdown();
          this.input.focus();
        }
      }
    };

    if (this.container && this.input && this.dropdown) {
      this.init();
    }
  }

  init() {
    this.unbindEvents();

    this.renderBadges();

    this.input.addEventListener("focus", this._handleFocus);
    this.input.addEventListener("click", this._handleClick);
    this.input.addEventListener("input", this._handleInput);
    this.input.addEventListener("keydown", this._handleKeyDown);
    this.container.addEventListener("click", this._handleContainerClick);
    this.dropdown.addEventListener("mousedown", this._handleDropdownMouseDown);

    document.addEventListener("mousedown", this._onOutsideClick);
  }

  unbindEvents() {
    if (!this.input || !this.container || !this.dropdown) return;

    this.input.removeEventListener("focus", this._handleFocus);
    this.input.removeEventListener("click", this._handleClick);
    this.input.removeEventListener("input", this._handleInput);
    this.input.removeEventListener("keydown", this._handleKeyDown);
    this.container.removeEventListener("click", this._handleContainerClick);
    this.dropdown.removeEventListener(
      "mousedown",
      this._handleDropdownMouseDown,
    );

    document.removeEventListener("mousedown", this._onOutsideClick);
  }

  bindEvents() {
    this.init();
  }

  getAllExistingTags() {
    const tasks = StateManager.getTasks();
    return Array.from(new Set(tasks.flatMap((t) => t.tags || []))).sort();
  }

  handleInput() {
    if (this.isLoading) return;

    const query = this.input.value.trim().toLowerCase().replace(/^#/, "");
    const allTags = this.getAllExistingTags();

    const matches = allTags.filter((tag) => {
      const isNotSelected = !this.tags.includes(tag);
      const matchesQuery = query ? tag.toLowerCase().includes(query) : true;
      return isNotSelected && matchesQuery;
    });

    const isAlreadySelected = query && this.tags.includes(query);

    if (!query && matches.length === 0) {
      this.renderEmptyState("No tags available in system.");
      this.showDropdown();
      return;
    }

    this.renderDropdown(matches, query, isAlreadySelected);
    this.showDropdown();
  }

  handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      e.stopPropagation();

      const val = this.input.value
        .trim()
        .toLowerCase()
        .replace(/^#/, "")
        .replace(/,/g, "");

      if (val) {
        this.addTag(val);
        this.input.value = "";
        this.hideDropdown();
      }
      return false;
    } else if (
      e.key === "Backspace" &&
      this.input.value === "" &&
      this.tags.length > 0
    ) {
      const lastTag = this.tags[this.tags.length - 1];
      this.removeTag(lastTag);
      this.handleInput();
    } else if (e.key === "Escape") {
      this.hideDropdown();
    }
  }

  addTag(tag) {
    const cleanTag = tag.trim().toLowerCase();
    if (cleanTag && !this.tags.includes(cleanTag)) {
      this.tags = [...this.tags, cleanTag];
      this.renderBadges();
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((t) => t !== tag);
    this.renderBadges();
  }

  renderBadges() {
    if (!this.container || !this.input) return;

    const existingBadges = this.container.querySelectorAll(".tag-badge");
    existingBadges.forEach((b) => b.remove());

    this.tags.forEach((tag) => {
      const badge = document.createElement("span");
      badge.className =
        "tag-badge flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-brand/10 text-brand font-medium text-xs border border-brand/20 select-none animate-fadeIn";
      badge.innerHTML = `
        <span class="flex flex-row justify-center items-center gap-1">
          <i class="fa-regular fa-tag text-brand/70 text-xs"></i>
          ${tag}
        </span>
        <button
          type="button"
          class="remove-tag-btn hover:text-red-500 transition cursor-pointer flex items-center justify-center"
        >
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
      `;

      badge.querySelector(".remove-tag-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.removeTag(tag);
      });

      this.container.insertBefore(badge, this.input);
    });
  }

  renderDropdown(items, query, isAlreadySelected) {
    let html = "";

    if (items.length > 0) {
      html += items
        .map(
          (tag) => `
          <div
            data-tag="${tag}"
            class="autocomplete-item px-3.5 py-2 text-xs font-medium text-primary hover:bg-brand/10 hover:text-brand cursor-pointer flex items-center justify-between transition border-b border-border/30 last:border-none"
          >
            <span class="flex items-center gap-1.5">
              <i class="fa-regular fa-tag text-brand/70 text-xs"></i>
              ${tag}
            </span>
            <span class="text-[10px] text-muted">Existing Tag</span>
          </div>
        `,
        )
        .join("");
    }

    if (isAlreadySelected) {
      this.renderEmptyState(`Tag "${query}" is already added.`);
      return;
    }

    if (query) {
      const isExactMatch = items.some((t) => t.toLowerCase() === query);
      if (!isExactMatch) {
        html += `
          <div
            data-tag="${query}"
            class="autocomplete-item px-3.5 py-2 text-xs font-medium text-brand hover:bg-brand/15 cursor-pointer flex items-center justify-between transition ${
              items.length > 0 ? "border-t border-border/40" : ""
            }"
          >
            <span class="flex items-center gap-1.5">
              <i class="fa-solid fa-plus text-xs"></i>
              Create "${query}"
            </span>
            <span class="text-[10px] text-brand/80 font-bold">New Tag</span>
          </div>
        `;
      }
    }

    if (!html) {
      this.renderEmptyState(`No matching tags found for "${query}"`);
      return;
    }

    this.dropdown.innerHTML = html;
  }

  renderEmptyState(message) {
    this.dropdown.innerHTML = `
      <div class="px-3.5 py-3 text-xs text-muted text-center flex items-center justify-center gap-2 select-none">
        <i class="fa-regular fa-circle-info text-brand/70"></i>
        <span>${message}</span>
      </div>
    `;
  }

  showLoading() {
    this.isLoading = true;
    this.dropdown.innerHTML = `
      <div class="px-3.5 py-3 text-xs text-brand text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-spinner animate-spin"></i>
        <span>Loading tags...</span>
      </div>
    `;
    this.showDropdown();
  }

  hideLoading() {
    this.isLoading = false;
    this.handleInput();
  }

  updateDropdownPosition() {
    if (this.dropdown.classList.contains("hidden")) return;

    const rect = this.container.getBoundingClientRect();

    this.dropdown.style.position = "fixed";
    this.dropdown.style.top = `${rect.bottom + 4}px`;
    this.dropdown.style.left = `${rect.left}px`;
    this.dropdown.style.width = `${rect.width}px`;
    this.dropdown.style.zIndex = "99999";

    this.dropdown.classList.add(
      "max-h-52",
      "overflow-y-auto",
      "scrollbar-thin",
      "scrollbar-thumb-surface-2",
    );
  }

  showDropdown() {
    this.dropdown.classList.remove("hidden");
    this.updateDropdownPosition();

    window.addEventListener("scroll", this._onScrollOrResize, true);
    window.addEventListener("resize", this._onScrollOrResize);
  }

  hideDropdown() {
    this.dropdown.classList.add("hidden");
    window.removeEventListener("scroll", this._onScrollOrResize, true);
    window.removeEventListener("resize", this._onScrollOrResize);
  }

  _handleScrollOrResize(e) {
    if (e.target === this.dropdown) return;
    this.hideDropdown();
  }

  _handleOutsideClick(e) {
    const isClickInsideContainer = this.container.contains(e.target);
    const isClickInsideDropdown = this.dropdown.contains(e.target);

    if (!isClickInsideContainer && !isClickInsideDropdown) {
      this.hideDropdown();
    }
  }

  getTags() {
    return [...this.tags];
  }

  reset() {
    this.tags = [];
    this.renderBadges();
    this.input.value = "";
    this.hideDropdown();
  }

  destroy() {
    this.unbindEvents();
    this.hideDropdown();
  }
}
