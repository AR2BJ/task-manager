export class AutocompleteComponent {
  constructor({
    id,
    options = [],
    value = "",
    height = "11",
    background = "surface-2",
    placeholder = "Select option...",
    onChange,
  }) {
    this.id = id;
    this.options = options;
    this.value = value;
    this.height = height;
    this.background = background;
    this.placeholder = placeholder;
    this.onChange = onChange;

    this.isOpen = false;
    this.focusedIndex = -1;

    this._onOutsideClick = this._handleOutsideClick.bind(this);
    this._onScrollOrResize = this._handleScrollOrResize.bind(this);
  }

  _getInputElement() {
    return document.getElementById(this.id);
  }

  _getDropdownElement() {
    return document.getElementById(`${this.id}-dropdown`);
  }

  _getContainerElement() {
    return document.getElementById(`${this.id}-container`);
  }

  _getChevronButtonElement() {
    return document.getElementById(`${this.id}-chevron-btn`);
  }

  _roundedValue(height) {
    const h = Number(height);

    switch (true) {
      case h >= 10:
        return "xl";
      case h >= 8:
        return "lg";
      case h >= 6:
        return "md";
      case h >= 4:
        return "sm";
      case h >= 2:
        return "xs";
      default:
        return "xl";
    }
  }

  render() {
    const selectedOption = this.options.find((opt) => opt.value === this.value);
    const initialLabel = selectedOption ? selectedOption.label : "";

    return `
      <div id="${this.id}-container" class="relative w-full">
        <div class="relative flex items-center">
          <input
            type="text"
            id="${this.id}"
            value="${initialLabel}"
            placeholder="${this.placeholder}"
            autocomplete="off"
            class="h-${this.height} w-full rounded-${this._roundedValue(this.height)} border border-border bg-${this.background} pl-4 pr-10 text-sm text-primary placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none cursor-pointer"
          />
          <button
            type="button"
            id="${this.id}-chevron-btn"
            class="flex absolute right-3 text-secondary hover:text-primary transition pointer-events-none"
            tabindex="-1"
          >
            <i class="fa-solid fa-chevron-down text-xs" id="${this.id}-chevron-icon"></i>
          </button>
        </div>
      </div>
    `;
  }

  _createDropdownInBody() {
    let dropdown = this._getDropdownElement();
    if (dropdown) return dropdown;

    dropdown = document.createElement("div");
    dropdown.id = `${this.id}-dropdown`;
    dropdown.className = `hidden fixed z-100 p-1.5 bg-surface border border-border rounded-${this._roundedValue(this.height)} shadow-xl backdrop-blur-md max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-2 transition-opacity duration-200`;

    document.body.appendChild(dropdown);
    return dropdown;
  }

  _updatePosition() {
    if (!this.isOpen) return;

    const input = this._getInputElement();
    const dropdown = this._getDropdownElement();

    if (!input || !dropdown) return;

    const rect = input.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) return;

    dropdown.style.position = "fixed";
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
    dropdown.style.zIndex = "100";
  }

  bindEvents() {
    const input = this._getInputElement();
    const dropdown = this._createDropdownInBody();

    if (!input || !dropdown) return;

    input.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      this.renderDropdown(query);
      this.showDropdown();
    });

    input.addEventListener("focus", () => {
      this.renderDropdown("");
      this.showDropdown();
    });

    input.addEventListener("click", () => {
      if (!this.isOpen) {
        this.renderDropdown("");
        this.showDropdown();
      }
    });

    input.addEventListener("keydown", (e) => this._handleKeyDown(e, dropdown));

    dropdown.addEventListener("mousedown", (e) => {
      const item = e.target.closest(".autocomplete-item");
      if (!item) return;

      e.preventDefault();
      e.stopPropagation();
      this._selectItem(item);
    });

    document.addEventListener("mousedown", this._onOutsideClick);
  }

  _handleKeyDown(e, dropdown) {
    const items = dropdown.querySelectorAll(".autocomplete-item");
    if (!items.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();

        if (!this.isOpen) {
          this.showDropdown();
          return;
        }

        this.focusedIndex = (this.focusedIndex + 1) % items.length;
        this._highlightItem(items);
        break;

      case "ArrowUp":
        e.preventDefault();

        if (!this.isOpen) return;

        this.focusedIndex =
          (this.focusedIndex - 1 + items.length) % items.length;
        this._highlightItem(items);
        break;

      case "Enter":
        e.preventDefault();

        if (!this.isOpen) {
          this.showDropdown();
          return;
        }

        const index = this.focusedIndex >= 0 ? this.focusedIndex : 0;
        this.focusedIndex = index;
        this._highlightItem(items);
        this._selectItem(items[index]);
        break;

      case "Escape":
        this.hideDropdown();
        break;
    }
  }

  _highlightItem(items) {
    items.forEach((item, idx) => {
      if (idx === this.focusedIndex) {
        item.classList.add("bg-brand/15", "text-brand");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("bg-brand/15", "text-brand");
      }
    });
  }

  _selectItem(item) {
    if (!item) return;

    const value = item.dataset.value;
    const label = item.dataset.label;
    this.selectOption(value, label);
  }

  renderDropdown(query = "") {
    const dropdown = this._getDropdownElement();
    if (!dropdown) return;

    const filtered = this.options.filter((opt) =>
      opt.label.toLowerCase().includes(query),
    );

    if (filtered.length === 0) {
      dropdown.innerHTML = `
        <div
          class="px-3.5 py-3 text-xs text-muted text-center flex items-center justify-center gap-1 select-none"
        >
          <i class="fa-regular fa-circle-info text-brand/70"></i>
          <span>No matching items found for "${query}"</span>
        </div>
      `;
      return;
    }

    this.focusedIndex = -1;
    let html = "";

    filtered.forEach((opt) => {
      const isSelected = opt.value === this.value;
      const iconHTML = opt.icon ? `<i class="${opt.icon} text-xs"></i>` : "";

      html += `
        <div
          data-value="${opt.value}"
          data-label="${opt.label}"
          class="autocomplete-item px-3.5 py-2 rounded-${this._roundedValue(String(Number(this.height) - 2))} text-xs font-medium text-primary hover:bg-brand/10 hover:text-brand cursor-pointer flex items-center justify-between transition ${
            isSelected ? "bg-brand/10 text-brand font-bold" : ""
          }"
        >
          <span class="flex items-center gap-2">
            ${iconHTML}
            ${opt.label}
          </span>
          ${isSelected ? `<i class="fa-solid fa-check text-xs text-brand"></i>` : ""}
        </div>
      `;
    });

    dropdown.innerHTML = html;
  }

  showDropdown() {
    const dropdown = this._getDropdownElement();
    const chevronBtn = this._getChevronButtonElement();

    if (!dropdown) return;

    this.isOpen = true;
    dropdown.classList.remove("hidden");
    chevronBtn?.classList.add("rotate-180");

    this._updatePosition();

    window.addEventListener("scroll", this._onScrollOrResize, true);
    window.addEventListener("resize", this._onScrollOrResize);
  }

  hideDropdown() {
    const dropdown = this._getDropdownElement();
    const chevronBtn = this._getChevronButtonElement();
    const input = this._getInputElement();

    if (!dropdown) return;

    this.isOpen = false;

    if (input) input.blur();

    dropdown.classList.add("hidden");
    chevronBtn?.classList.remove("rotate-180");

    window.removeEventListener("scroll", this._onScrollOrResize, true);
    window.removeEventListener("resize", this._onScrollOrResize);

    const currentOption = this.options.find((opt) => opt.value === this.value);
    if (input) {
      input.value = currentOption ? currentOption.label : "";
    }
  }

  selectOption(val, label) {
    this.value = val;
    const input = this._getInputElement();

    if (input) input.value = label;

    if (this.onChange) {
      this.onChange(val);
    }

    this.hideDropdown();
  }

  _handleScrollOrResize(e) {
    const dropdown = this._getDropdownElement();
    if (e.target === dropdown) return;
    this.hideDropdown();
  }

  _handleOutsideClick(e) {
    const container = this._getContainerElement();
    const dropdown = this._getDropdownElement();

    if (
      container &&
      !container.contains(e.target) &&
      dropdown &&
      !dropdown.contains(e.target)
    ) {
      this.hideDropdown();
    }
  }

  getValue() {
    return this.value;
  }

  setValue(val) {
    this.value = val;
    const selected = this.options.find((opt) => opt.value === val);
    const input = this._getInputElement();

    if (input) {
      input.value = selected ? selected.label : "";
    }
  }

  reset() {
    this.value = "";
    const input = this._getInputElement();

    if (input) input.value = "";
    this.hideDropdown();
  }

  destroy() {
    const dropdown = this._getDropdownElement();
    if (dropdown) dropdown.remove();

    document.removeEventListener("mousedown", this._onOutsideClick);
    window.removeEventListener("scroll", this._onScrollOrResize, true);
    window.removeEventListener("resize", this._onScrollOrResize);
  }
}
