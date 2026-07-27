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
    this.viewMode = "days";
    this.yearRangeStart = Math.floor(this.currentYear / 12) * 12;

    this.monthNames = [
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
    this.shortMonthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    this._updatePosition = this._updatePosition.bind(this);
    this._onScrollOrResize = this._handleScrollOrResize.bind(this);
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
      </div>
    `;
  }

  _createPopoverInBody() {
    let popover = document.getElementById(`${this.id}-popover`);
    if (popover) return popover;

    popover = document.createElement("div");
    popover.id = `${this.id}-popover`;
    popover.className =
      "hidden fixed z-100 w-64 p-3 bg-surface border border-border rounded-xl shadow-xl backdrop-blur-md transition-opacity duration-200";

    popover.innerHTML = `
      <div class="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          id="${this.id}-month-year"
          class="text-xs font-bold text-primary hover:text-brand hover:bg-surface-2 px-2 py-1 rounded-lg transition cursor-pointer select-none"
        ></button>

        <div class="flex items-center gap-1">
          <button type="button" id="${this.id}-prev-btn" class="p-1 text-secondary hover:text-primary hover:bg-surface-2 rounded-md transition cursor-pointer">
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button type="button" id="${this.id}-next-btn" class="p-1 text-secondary hover:text-primary hover:bg-surface-2 rounded-md transition cursor-pointer">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      <div id="${this.id}-weekdays-header" class="grid grid-cols-7 gap-1 mb-1 text-center">
        <span class="text-[10px] font-semibold text-secondary">Su</span>
        <span class="text-[10px] font-semibold text-secondary">Mo</span>
        <span class="text-[10px] font-semibold text-secondary">Tu</span>
        <span class="text-[10px] font-semibold text-secondary">We</span>
        <span class="text-[10px] font-semibold text-secondary">Th</span>
        <span class="text-[10px] font-semibold text-secondary">Fr</span>
        <span class="text-[10px] font-semibold text-secondary">Sa</span>
      </div>

      <div id="${this.id}-view-container"></div>

      <div class="flex items-center justify-between pt-2 mt-2 border-t border-border/50 text-xs">
        <button type="button" id="${this.id}-clear-btn" class="text-xs text-rose-400 hover:underline transition cursor-pointer">Clear</button>
        <button type="button" id="${this.id}-today-btn" class="text-xs text-brand hover:underline font-medium transition cursor-pointer">Today</button>
      </div>
    `;

    document.body.appendChild(popover);
    return popover;
  }

  _updatePosition() {
    if (!this.isOpen) return;
    const input = document.getElementById(this.id);
    const popover = document.getElementById(`${this.id}-popover`);

    if (!input || !popover) return;

    const rect = input.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) return;

    const popoverWidth = popover.offsetWidth || 256;

    popover.style.position = "fixed";
    popover.style.top = `${rect.bottom + 6}px`;
    popover.style.left = `${rect.right - popoverWidth}px`;
    popover.style.zIndex = "100";
  }

  _handleScrollOrResize(e) {
    const popover = document.getElementById(`${this.id}-popover`);
    if (e.target === popover || popover?.contains(e.target)) return;

    const input = document.getElementById(this.id);
    if (input) input.blur();

    popover?.classList.add("hidden");
    window.removeEventListener("scroll", this._onScrollOrResize, true);
    window.removeEventListener("resize", this._onScrollOrResize);
    this.isOpen = false;
  }

  bindEvents() {
    const input = document.getElementById(this.id);
    const calendarBtn = document.getElementById(`${this.id}-calendar-btn`);
    const popover = this._createPopoverInBody();

    const monthYearBtn = document.getElementById(`${this.id}-month-year`);
    const prevBtn = document.getElementById(`${this.id}-prev-btn`);
    const nextBtn = document.getElementById(`${this.id}-next-btn`);
    const clearBtn = document.getElementById(`${this.id}-clear-btn`);
    const todayBtn = document.getElementById(`${this.id}-today-btn`);

    if (!input || !popover) return;

    input.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length > 8) val = val.substring(0, 8);

      let formatted = val;
      if (val.length >= 5) {
        formatted = `${val.substring(0, 4)}-${val.substring(4, 6)}-${val.substring(6, 8)}`;
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
        this.viewMode = "days";
        this.renderCalendar();
        popover.classList.remove("hidden");

        this._updatePosition();

        window.addEventListener("scroll", this._onScrollOrResize, true);
        window.addEventListener("resize", this._onScrollOrResize);
      } else {
        popover.classList.add("hidden");

        window.removeEventListener("scroll", this._onScrollOrResize, true);
        window.removeEventListener("resize", this._onScrollOrResize);
      }
    };

    calendarBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePopover();
    });

    input.addEventListener("focus", () => togglePopover(true));

    monthYearBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.viewMode === "days") {
        this.viewMode = "months";
      } else if (this.viewMode === "months") {
        this.viewMode = "years";
        this.yearRangeStart = Math.floor(this.currentYear / 12) * 12;
      } else {
        this.viewMode = "days";
      }
      this.renderCalendar();
    });

    prevBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.viewMode === "days") {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
      } else if (this.viewMode === "months") {
        this.currentYear--;
      } else if (this.viewMode === "years") {
        this.yearRangeStart -= 12;
      }
      this.renderCalendar();
    });

    nextBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.viewMode === "days") {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
      } else if (this.viewMode === "months") {
        this.currentYear++;
      } else if (this.viewMode === "years") {
        this.yearRangeStart += 12;
      }
      this.renderCalendar();
    });

    clearBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.reset();
      if (this.onChange) this.onChange("");
      togglePopover(false);
    });

    todayBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      input.value = todayStr;
      this.value = todayStr;
      this.currentYear = now.getFullYear();
      this.currentMonth = now.getMonth();
      this.viewMode = "days";
      if (this.onChange) this.onChange(todayStr);
      togglePopover(false);
    });

    document.addEventListener("click", (e) => {
      const container = document.getElementById(`${this.id}-container`);
      const popoverEl = document.getElementById(`${this.id}-popover`);
      if (
        container &&
        !container.contains(e.target) &&
        popoverEl &&
        !popoverEl.contains(e.target)
      ) {
        togglePopover(false);
      }
    });
  }

  renderCalendar() {
    const monthYearBtn = document.getElementById(`${this.id}-month-year`);
    const weekdaysHeader = document.getElementById(
      `${this.id}-weekdays-header`,
    );
    const viewContainer = document.getElementById(`${this.id}-view-container`);

    if (!monthYearBtn || !viewContainer) return;

    if (this.viewMode === "days") {
      weekdaysHeader?.classList.remove("hidden");
      monthYearBtn.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
      this.renderDaysView(viewContainer);
    } else if (this.viewMode === "months") {
      weekdaysHeader?.classList.add("hidden");
      monthYearBtn.textContent = `${this.currentYear} (Select Month)`;
      this.renderMonthsView(viewContainer);
    } else if (this.viewMode === "years") {
      weekdaysHeader?.classList.add("hidden");
      const endYear = this.yearRangeStart + 11;
      monthYearBtn.textContent = `${this.yearRangeStart} - ${endYear}`;
      this.renderYearsView(viewContainer);
    }
  }

  renderDaysView(container) {
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
    const prevMonthTotalDays = new Date(
      this.currentYear,
      this.currentMonth,
      0,
    ).getDate();

    let gridHTML = `<div class="grid grid-cols-7 gap-1">`;
    const todayStr = new Date().toISOString().split("T")[0];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthTotalDays - i;
      let prevM = this.currentMonth - 1;
      let prevY = this.currentYear;
      if (prevM < 0) {
        prevM = 11;
        prevY--;
      }
      const mStr = String(prevM + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${prevY}-${mStr}-${dStr}`;

      gridHTML += `
        <div 
          class="h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all text-secondary/40 hover:bg-surface-2 hover:text-primary"
          data-date="${dateStr}"
        >
          ${day}
        </div>
      `;
    }

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

    const totalFilled = firstDayIndex + totalDays;
    const nextDaysNeeded =
      (42 - totalFilled) % 7 === 0 && totalFilled > 35 ? 0 : 42 - totalFilled;

    for (let day = 1; day <= nextDaysNeeded; day++) {
      let nextM = this.currentMonth + 1;
      let nextY = this.currentYear;
      if (nextM > 11) {
        nextM = 0;
        nextY++;
      }
      const mStr = String(nextM + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${nextY}-${mStr}-${dStr}`;

      gridHTML += `
        <div 
          class="h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all text-secondary/40 hover:bg-surface-2 hover:text-primary"
          data-date="${dateStr}"
        >
          ${day}
        </div>
      `;
    }

    gridHTML += `</div>`;
    container.innerHTML = gridHTML;

    container.querySelectorAll("[data-date]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedDate = el.dataset.date;
        const [y, m] = selectedDate.split("-").map(Number);

        this.currentYear = y;
        this.currentMonth = m - 1;
        this.value = selectedDate;

        const input = document.getElementById(this.id);
        if (input) input.value = selectedDate;

        if (this.onChange) this.onChange(selectedDate);

        const popover = document.getElementById(`${this.id}-popover`);
        if (popover) popover.classList.add("hidden");

        window.removeEventListener("scroll", this._onScrollOrResize, true);
        window.removeEventListener("resize", this._onScrollOrResize);
        this.isOpen = false;
      });
    });
  }

  renderMonthsView(container) {
    let html = `<div class="grid grid-cols-3 gap-2 py-1">`;

    this.shortMonthNames.forEach((month, idx) => {
      const isCurrentMonth = idx === this.currentMonth;
      let classNames =
        "py-2 text-center text-xs rounded-xl cursor-pointer font-medium transition-all ";

      if (isCurrentMonth) {
        classNames += "bg-brand/15 text-brand font-bold border border-brand/30";
      } else {
        classNames += "text-primary hover:bg-surface-2";
      }

      html += `
        <div class="${classNames}" data-month="${idx}">
          ${month}
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll("[data-month]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this.currentMonth = parseInt(el.dataset.month, 10);
        this.viewMode = "days";
        this.renderCalendar();
      });
    });
  }

  renderYearsView(container) {
    let html = `<div class="grid grid-cols-3 gap-2 py-1">`;

    for (let i = 0; i < 12; i++) {
      const year = this.yearRangeStart + i;
      const isCurrentYear = year === this.currentYear;
      let classNames =
        "py-2 text-center text-xs rounded-xl cursor-pointer font-medium transition-all ";

      if (isCurrentYear) {
        classNames += "bg-brand/15 text-brand font-bold border border-brand/30";
      } else {
        classNames += "text-primary hover:bg-surface-2";
      }

      html += `
        <div class="${classNames}" data-year="${year}">
          ${year}
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll("[data-year]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this.currentYear = parseInt(el.dataset.year, 10);
        this.viewMode = "months";
        this.renderCalendar();
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
    this.viewMode = "days";

    this.renderCalendar();
  }
}
