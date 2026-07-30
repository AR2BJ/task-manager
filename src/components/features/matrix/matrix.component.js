export const MatrixTaskCardComponent = {
  render(task) {
    const importance = task.importance || 1;
    const urgency = task.urgency || 1;
    const priorityScore = importance * urgency;

    const statusBadgeStyles = {
      todo: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      in_progress: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      blocked: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    };

    const taskStatusClass =
      statusBadgeStyles[task.status] || statusBadgeStyles.todo;

    return `
      <div class="group relative flex flex-col justify-between p-3.5 rounded-xl bg-surface-2 border border-border/70 hover:border-brand/40 transition-all duration-200 shadow-sm">
        <div>
          <div class="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${taskStatusClass}">
                ${(task.status || "todo").replace("_", " ")}
              </span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/20">
                Score: ${priorityScore}
              </span>
            </div>

            ${
              task.dueDate
                ? `
              <span class="text-[10px] text-secondary flex items-center gap-1 font-medium bg-surface px-2 py-0.5 rounded-md border border-border/60">
                <i class="fa-regular fa-clock text-brand text-[9px]"></i>
                ${task.dueDate}
              </span>
            `
                : ""
            }
          </div>

          <h4 class="text-xs sm:text-sm font-bold text-primary group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-1">
            ${task.title}
          </h4>

          ${
            task.description
              ? `
            <p class="text-[11px] text-secondary/80 line-clamp-1 mb-2 font-normal">${task.description}</p>
          `
              : ""
          }
        </div>

        <div class="flex items-center justify-between pt-2.5 mt-2 border-t border-border/50 text-[11px] text-secondary">
          <div class="flex items-center gap-3 font-medium">
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-star text-amber-400 text-[9px]"></i>
              <span class="text-primary font-bold">Imp: ${importance}</span>
            </span>
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-bolt text-red-400 text-[9px]"></i>
              <span class="text-primary font-bold">Urg: ${urgency}</span>
            </span>
          </div>

          ${
            task.tags?.length
              ? `
            <div class="flex items-center gap-1 max-w-[45%] overflow-hidden">
              <span class="text-[9px] bg-surface text-secondary px-1.5 py-0.5 rounded border border-border/60 truncate flex items-center gap-1">
                <i class="fa-regular fa-tag text-[8px] opacity-60"></i>
                ${task.tags[0]}
              </span>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  },
};
