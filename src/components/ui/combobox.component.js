export class ComboboxComponent {
  constructor({
    containerId,
    inputId,
    dropdownId,
    chevronBtnId,
    initialValues = [],
    options = [],
    iconClass = "fa-regular fa-tag",
    itemTypeLabel = "Item",
    onChange = null,
  }) {
    this.container = document.getElementById(containerId);
    this.input = document.getElementById(inputId);
    this.dropdown = document.getElementById(dropdownId);
    this.chevronBtn = document.getElementById(chevronBtnId);

    this.options = options;
    this.iconClass = iconClass;
    this.itemTypeLabel = itemTypeLabel;
    this.onChange = onChange;

    this.isLoading = false;
    this.activeDropdownIndex = -1;

    this.values = Array.isArray(initialValues)
      ? Array.from(
          new Set(
            initialValues.map((v) => v.trim().toLowerCase()).filter(Boolean),
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
      if (e.target !== this.input && !e.target.closest(".remove-item-btn")) {
        this.input.focus();
        this.handleInput();
      }
    };
    this._handleDropdownMouseDown = (e) => {
      const item = e.target.closest(".combobox-item");
      if (item) {
        e.preventDefault();
        e.stopPropagation();
        const value = item.dataset.value;
        if (value) {
          this.addValue(value);
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

  getAvailableOptions() {
    if (typeof this.options === "function") {
      return this.options();
    }
    return Array.isArray(this.options) ? this.options : [];
  }

  clearDropdownHighlight() {
    const items = Array.from(
      this.dropdown?.querySelectorAll(".combobox-item") || [],
    );
    items.forEach((item) => {
      item.classList.remove("bg-brand/15", "border-brand/20", "text-brand");
    });
    this.activeDropdownIndex = -1;
  }

  highlightDropdownItem(index) {
    const items = Array.from(
      this.dropdown?.querySelectorAll(".combobox-item") || [],
    );
    if (items.length === 0) {
      this.activeDropdownIndex = -1;
      return null;
    }

    const normalizedIndex =
      index < 0 ? items.length - 1 : index >= items.length ? 0 : index;

    this.clearDropdownHighlight();
    const item = items[normalizedIndex];
    item?.classList.add("bg-brand/15", "border-brand/20", "text-brand");
    this.activeDropdownIndex = normalizedIndex;
    item?.scrollIntoView({ block: "nearest" });

    return item;
  }

  moveDropdownSelection(direction) {
    const items = Array.from(
      this.dropdown?.querySelectorAll(".combobox-item") || [],
    );
    if (items.length === 0) return null;

    const currentIndex =
      this.activeDropdownIndex >= 0 && this.activeDropdownIndex < items.length
        ? this.activeDropdownIndex
        : -1;

    const nextIndex =
      direction > 0
        ? (currentIndex + 1) % items.length
        : currentIndex < 0
          ? items.length - 1
          : (currentIndex - 1 + items.length) % items.length;

    return this.highlightDropdownItem(nextIndex);
  }

  getActiveDropdownItem() {
    const items = Array.from(
      this.dropdown?.querySelectorAll(".combobox-item") || [],
    );
    if (
      this.activeDropdownIndex >= 0 &&
      this.activeDropdownIndex < items.length
    ) {
      return items[this.activeDropdownIndex];
    }
    return null;
  }

  handleInput() {
    if (this.isLoading) return;

    this.activeDropdownIndex = -1;

    const query = this.input.value.trim().toLowerCase().replace(/^#/, "");
    const allOptions = this.getAvailableOptions();

    const matches = allOptions.filter((opt) => {
      const isNotSelected = !this.values.includes(opt.toLowerCase());
      const matchesQuery = query ? opt.toLowerCase().includes(query) : true;
      return isNotSelected && matchesQuery;
    });

    const isAlreadySelected = query && this.values.includes(query);

    if (!query && matches.length === 0) {
      this.renderEmptyState(
        `No ${this.itemTypeLabel.toLowerCase()}s available.`,
      );
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

      const activeItem = this.getActiveDropdownItem();
      if (activeItem) {
        const value = activeItem.dataset.value;
        if (value) {
          this.addValue(value);
          this.input.value = "";
          this.hideDropdown();
          this.input.focus();
          return false;
        }
      }

      const val = this.input.value
        .trim()
        .toLowerCase()
        .replace(/^#/, "")
        .replace(/,/g, "");

      if (val) {
        this.addValue(val);
        this.input.value = "";
        this.hideDropdown();
        this.input.focus();
      }
      return false;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();

      if (this.dropdown.classList.contains("hidden")) {
        this.handleInput();
      }

      this.moveDropdownSelection(1);
      return false;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();

      if (this.dropdown.classList.contains("hidden")) {
        this.handleInput();
      }

      this.moveDropdownSelection(-1);
      return false;
    } else if (
      e.key === "Backspace" &&
      this.input.value === "" &&
      this.values.length > 0
    ) {
      const lastVal = this.values[this.values.length - 1];
      this.removeValue(lastVal);
      this.handleInput();
    } else if (e.key === "Escape") {
      this.hideDropdown();
    }
  }

  addValue(val) {
    const cleanVal = val.trim().toLowerCase();
    if (cleanVal && !this.values.includes(cleanVal)) {
      this.values = [...this.values, cleanVal];
      this.renderBadges();

      this.updateDropdownPosition();

      if (this.onChange) this.onChange(this.values);
    }
  }

  removeValue(val) {
    this.values = this.values.filter((v) => v !== val);
    this.renderBadges();

    if (
      !this.dropdown.classList.contains("hidden") ||
      document.activeElement === this.input
    ) {
      this.handleInput();
      this.input.focus();
    } else {
      this.updateDropdownPosition();
    }

    if (this.onChange) this.onChange(this.values);
  }

  renderBadges() {
    if (!this.container || !this.input) return;

    const existingBadges = this.container.querySelectorAll(".combobox-badge");
    existingBadges.forEach((b) => b.remove());

    this.values.forEach((val) => {
      const badge = document.createElement("span");
      badge.className =
        "combobox-badge flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-brand/10 text-brand font-medium text-xs border border-brand/20 select-none animate-fadeIn";
      badge.innerHTML = `
        <span class="flex flex-row justify-center items-center gap-1">
          <i class="${this.iconClass} text-brand/70 text-xs"></i>
          ${val}
        </span>
        <button
          type="button"
          class="remove-item-btn hover:text-red-500 transition cursor-pointer flex items-center justify-center"
        >
          <i class="fa-solid fa-xmark text-[10px]"></i>
        </button>
      `;

      badge.querySelector(".remove-item-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.removeValue(val);
      });

      this.container.insertBefore(badge, this.input);
    });
  }

  renderDropdown(items, query, isAlreadySelected) {
    let html = "";

    this.activeDropdownIndex = -1;
    this.clearDropdownHighlight();

    if (items.length > 0) {
      html += items
        .map(
          (item) => `
          <div
            data-value="${item}"
            class="combobox-item px-3.5 py-2 text-xs font-medium text-primary hover:bg-brand/10 hover:text-brand cursor-pointer flex items-center justify-between transition border-b border-border/30 last:border-none"
          >
            <span class="flex items-center gap-1.5">
              <i class="${this.iconClass} text-brand/70 text-xs"></i>
              ${item}
            </span>
            <span class="text-[10px] text-muted">Existing ${this.itemTypeLabel}</span>
          </div>
        `,
        )
        .join("");
    }

    if (isAlreadySelected) {
      this.renderEmptyState(`"${query}" is already added.`);
      return;
    }

    if (query) {
      const isExactMatch = items.some((t) => t.toLowerCase() === query);
      if (!isExactMatch) {
        html += `
          <div
            data-value="${query}"
            class="combobox-item px-3.5 py-2 text-xs font-medium text-brand hover:bg-brand/15 cursor-pointer flex items-center justify-between transition ${
              items.length > 0 ? "border-t border-border/40" : ""
            }"
          >
            <span class="flex items-center gap-1.5">
              <i class="fa-solid fa-plus text-xs"></i>
              Create "${query}"
            </span>
            <span class="text-[10px] text-brand/80 font-bold">New ${this.itemTypeLabel}</span>
          </div>
        `;
      }
    }

    if (!html) {
      this.renderEmptyState(`No matching items found for "${query}"`);
      return;
    }

    this.dropdown.innerHTML = html;
  }

  renderEmptyState(message) {
    this.activeDropdownIndex = -1;
    this.clearDropdownHighlight();
    this.dropdown.innerHTML = `
      <div class="px-3.5 py-3 text-xs text-muted text-center flex items-center justify-center gap-1 select-none">
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
        <span>Loading...</span>
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
    this.dropdown.style.zIndex = "100";

    this.dropdown.classList.add(
      "max-h-52",
      "overflow-y-auto",
      "scrollbar-thin",
      "scrollbar-thumb-surface-2",
    );
  }

  showDropdown() {
    this.dropdown.classList.remove("hidden");
    this.chevronBtn?.classList.add("rotate-180");

    this._forceFocusRefresh();

    this.updateDropdownPosition();

    window.addEventListener("scroll", this._onScrollOrResize, true);
    window.addEventListener("resize", this._onScrollOrResize);
  }

  _forceFocusRefresh() {
    if (document.activeElement === this.input) {
      this.input.blur();
    }
    this.input.focus();
  }

  hideDropdown() {
    this.dropdown.classList.add("hidden");
    this.chevronBtn.classList.remove("rotate-180");
    this.clearDropdownHighlight();

    this.input.blur();

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

  getSelectedValues() {
    return [...this.values];
  }

  getTags() {
    return this.getSelectedValues();
  }

  reset() {
    this.values = [];
    this.renderBadges();
    this.input.value = "";
    this.hideDropdown();
  }

  destroy() {
    this.unbindEvents();
    this.hideDropdown();
  }
}
