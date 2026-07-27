export class DatePickerComponent {
  constructor({ id, value = "", placeholder = "YYYY-MM-DD", onChange }) {
    this.id = id;
    this.value = value;
    this.placeholder = placeholder;
    this.onChange = onChange;

    const initialDate = value ? new Date(value) : new Date();
    this.currentYear = isNaN(initialDate.getTime())
      ? new Date().getFullYear()
      : initialDate.getFullYear();
    this.currentMonth = isNaN(initialDate.getTime())
      ? new Date().getMonth()
      : initialDate.getMonth();

    this.isOpen = false;
  }

  render() {
    return `
      <div id="${this.id}-container" class="relative w-full">
        <div class="relative flex items-center">
          <input
            type="text"
            id="${this.id}"
            value="${this.value}"
            placeholder="${this.placeholder}"
            maxlength="10"
            autocomplete="off"
            class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-primary placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
          />
          <button
            type="button"
            id="${this.id}-calendar-btn"
            class="absolute right-2 p-1.5 pt-1 text-secondary hover:text-primary focus:outline-none hover:scale-110 transition cursor-pointer"
            tabindex="-1"
          >
            <i class="fa-regular fa-calendar text-base"></i>
          </button>
        </div>

        <div
          id="${this.id}-popover"
          class="hidden absolute right-0 z-50 mt-1 w-64 p-3 bg-surface border border-border rounded-xl shadow-xl backdrop-blur-md transition-all duration-200"
        >
          <div class="flex items-center justify-between mb-3 px-1">
            <span id="${this.id}-month-year" class="text-xs font-bold text-primary"></span>
            <div class="flex items-center gap-1">
              <button type="button" id="${this.id}-prev-month" class="p-1 text-secondary hover:text-primary hover:bg-surface-2 rounded-md transition cursor-pointer">
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button type="button" id="${this.id}-next-month" class="p-1 text-secondary hover:text-primary hover:bg-surface-2 rounded-md transition cursor-pointer">
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-1 mb-1 text-center">
            <span class="text-[10px] font-semibold text-secondary">Su</span>
            <span class="text-[10px] font-semibold text-secondary">Mo</span>
            <span class="text-[10px] font-semibold text-secondary">Tu</span>
            <span class="text-[10px] font-semibold text-secondary">We</span>
            <span class="text-[10px] font-semibold text-secondary">Th</span>
            <span class="text-[10px] font-semibold text-secondary">Fr</span>
            <span class="text-[10px] font-semibold text-secondary">Sa</span>
          </div>

          <div id="${this.id}-days-grid" class="grid grid-cols-7 gap-1"></div>

          <div class="flex items-center justify-between pt-2 mt-2 border-t border-border/50 text-xs">
            <button type="button" id="${this.id}-clear-btn" class="text-xs text-rose-400 hover:underline transition cursor-pointer">Clear</button>
            <button type="button" id="${this.id}-today-btn" class="text-xs text-brand hover:underline font-medium transition cursor-pointer">Today</button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const input = document.getElementById(this.id);
    const calendarBtn = document.getElementById(`${this.id}-calendar-btn`);
    const popover = document.getElementById(`${this.id}-popover`);
    const prevBtn = document.getElementById(`${this.id}-prev-month`);
    const nextBtn = document.getElementById(`${this.id}-next-month`);
    const clearBtn = document.getElementById(`${this.id}-clear-btn`);
    const todayBtn = document.getElementById(`${this.id}-today-btn`);

    if (!input || !popover) return;

    input.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length > 8) val = val.substring(0, 8);

      let formatted = val;
      if (val.length >= 5) {
        formatted = `${val.substring(0, 4)}-${val.substring(4, 6)}-${val.substring(6, 8)}`;
      } else if (val.length >= 5) {
        formatted = `${val.substring(0, 4)}-${val.substring(4)}`;
      } else if (val.length > 4) {
        formatted = `${val.substring(0, 4)}-${val.substring(4)}`;
      }

      input.value = formatted;
      this.value = formatted;

      if (formatted.length === 10 && this.isValidDate(formatted)) {
        const [y, m] = formatted.split("-").map(Number);
        this.currentYear = y;
        this.currentMonth = m - 1;
        this.renderCalendar();
        if (this.onChange) this.onChange(formatted);
      } else if (formatted === "") {
        if (this.onChange) this.onChange("");
      }
    });

    const togglePopover = (show) => {
      this.isOpen = typeof show === "boolean" ? show : !this.isOpen;
      if (this.isOpen) {
        this.renderCalendar();
        popover.classList.remove("hidden");
      } else {
        popover.classList.add("hidden");
      }
    };

    calendarBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePopover();
    });

    input.addEventListener("focus", () => togglePopover(true));

    prevBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.renderCalendar();
    });

    nextBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderCalendar();
    });

    clearBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      input.value = "";
      this.value = "";
      if (this.onChange) this.onChange("");
      togglePopover(false);
    });

    todayBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      input.value = todayStr;
      this.value = todayStr;
      if (this.onChange) this.onChange(todayStr);
      togglePopover(false);
    });

    document.addEventListener("click", (e) => {
      const container = document.getElementById(`${this.id}-container`);
      if (container && !container.contains(e.target)) {
        togglePopover(false);
      }
    });
  }

  renderCalendar() {
    const monthYearEl = document.getElementById(`${this.id}-month-year`);
    const daysGrid = document.getElementById(`${this.id}-days-grid`);
    if (!monthYearEl || !daysGrid) return;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    monthYearEl.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

    const firstDayIndex = new Date(
      this.currentYear,
      this.currentMonth,
      1,
    ).getDay();
    const totalDays = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0,
    ).getDate();

    let gridHTML = "";

    for (let i = 0; i < firstDayIndex; i++) {
      gridHTML += `<div class="h-7"></div>`;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    for (let day = 1; day <= totalDays; day++) {
      const mStr = String(this.currentMonth + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${this.currentYear}-${mStr}-${dStr}`;

      const isSelected = this.value === dateStr;
      const isToday = todayStr === dateStr;

      let classNames =
        "h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all ";

      if (isSelected) {
        classNames += "bg-brand text-white font-bold shadow-md shadow-brand/20";
      } else if (isToday) {
        classNames +=
          "border border-brand text-brand font-semibold hover:bg-brand/10";
      } else {
        classNames += "text-primary hover:bg-surface-2";
      }

      gridHTML += `<div class="${classNames}" data-date="${dateStr}">${day}</div>`;
    }

    daysGrid.innerHTML = gridHTML;

    daysGrid.querySelectorAll("[data-date]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedDate = el.dataset.date;
        const input = document.getElementById(this.id);
        if (input) input.value = selectedDate;
        this.value = selectedDate;

        if (this.onChange) this.onChange(selectedDate);
        document.getElementById(`${this.id}-popover`)?.classList.add("hidden");
        this.isOpen = false;
      });
    });
  }

  isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false;
    return d.toISOString().slice(0, 10) === dateString;
  }

  reset() {
    this.value = "";

    const input = document.getElementById(this.id);
    if (input) {
      input.value = "";
    }

    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();

    this.renderCalendar();
  }
}
