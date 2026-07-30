import { getTaskMatrixAttributes } from "@/utils/helpers.js";

export const MatrixTaskCardComponent = {
  render(task) {
    const { importance, urgency, priorityScore } =
      getTaskMatrixAttributes(task);

    const statusAccent =
      {
        todo: "bg-sky-500",
        in_progress: "bg-amber-500",
        done: "bg-emerald-500",
        blocked: "bg-rose-500",
      }[task.status] || "bg-sky-500";

    const priorityStyles = {
      low: "border-lime-500/20 bg-lime-500/10 text-lime-500/80",
      medium: "border-amber-500/20 bg-amber-500/10 text-amber-500/80",
      high: "border-red-500/20 bg-red-500/10 text-red-500/80",
    };
    const priorityClass =
      priorityStyles[task.priority] || priorityStyles.medium;

    return `
      <div class="group relative flex flex-col justify-between p-3 rounded-xl bg-surface hover:bg-surface-2 border border-border/60 hover:border-brand/40 transition-all duration-200 shadow-sm overflow-hidden">
        <div class="absolute top-0 left-0 bottom-0 w-1 ${statusAccent}"></div>

        <div class="pl-1.5">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-secondary/90">
                ${(task.status || "todo").replace("_", " ")}
              </span>
              <span class="inline-flex items-center rounded-sm border px-1 py-0.5 text-[8px] uppercase font-semibold tracking-wider ${priorityClass}">
                ${task.priority || "low"}
              </span>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-light text-brand">
                Score: ${priorityScore}
              </span>
              ${
                task.dueDate
                  ? `
                <span class="text-[10px] text-tertiary flex items-center gap-1 font-medium">
                  <i class="fa-regular fa-clock text-[9px]"></i>
                  ${task.dueDate}
                </span>
              `
                  : ""
              }
            </div>
          </div>

          <h4 class="text-xs font-bold text-primary group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-1">
            ${task.title}
          </h4>

          ${
            task.description
              ? `<p class="text-[11px] text-tertiary line-clamp-1 font-normal mb-2">${task.description}</p>`
              : ""
          }
        </div>

        <div class="flex items-center justify-between pt-2 mt-1 border-t border-border/40 text-[10px] text-secondary pl-1.5">
          <div class="flex items-center gap-2.5 font-semibold">
            <span class="flex items-center gap-1 text-tertiary">
              Imp: <strong class="text-primary font-bold">${importance}</strong>
            </span>
            <span class="flex items-center gap-1 text-tertiary">
              Urg: <strong class="text-primary font-bold">${urgency}</strong>
            </span>
          </div>

          ${
            task.tags?.length
              ? `
            <span class="text-[9px] bg-surface-3/50 text-secondary px-1.5 py-0.5 rounded border border-border/40 truncate max-w-22.5 flex flex-row justify-center items-center gap-1">
              <i class="fa-regular fa-tags"></i> ${task.tags[0]}
            </span>
          `
              : ""
          }
        </div>
      </div>
    `;
  },
};
