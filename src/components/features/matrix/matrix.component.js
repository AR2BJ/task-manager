import { getTaskMatrixAttributes } from "@/utils/helpers.js";
import { state } from "@/models/state.model";

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
    const priorityClass = priorityStyles[task.priority] || priorityStyles.low;

    return `
      <div
        class="group relative flex flex-col justify-between p-3 rounded-xl bg-surface hover:bg-surface-2 border border-border/60 hover:border-brand/40 transition-all duration-200 shadow-sm overflow-hidden"
      >
        <div class="absolute top-0 left-0 bottom-0 w-1 ${statusAccent}"></div>

        <div class="pl-1.5">
          <div class="flex items-center justify-between gap-1.5 mb-2 shrink-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span
                class="text-[9px] font-extrabold uppercase tracking-wider text-secondary"
              >
                ${(task.status || "todo").replace("_", " ")}
              </span>
              <span
                class="inline-flex items-center rounded border px-1 py-0.2 text-[8px] uppercase font-bold tracking-wider ${priorityClass}"
              >
                ${task.priority || "low"}
              </span>
            </div>

            <span
              class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-light text-brand shrink-0"
            >
              Score: ${priorityScore}
            </span>
          </div>

          <h4
            class="block lg:hidden text-xs font-bold text-primary group-hover:text-brand transition-colors truncate line-clamp-2 leading-snug mb-1 cursor-pointer"
            data-tooltip-title="${task.title}"
          >
            ${task.title}
          </h4>
          <h4
            class="hidden lg:flex text-xs font-bold text-primary group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-1"
            title="${task.title}"
          >
            ${task.title}
          </h4>

          ${
            task.description
              ? `<p
                    class="block lg:hidden text-[11px] text-tertiary line-clamp-1 font-normal mb-2 truncate leading-tight cursor-pointer"
                    data-tooltip-title="${task.description}"
                  >
                    ${task.description}
                  </p>
                  <p
                    class="hidden lg:flex text-[11px] text-tertiary line-clamp-1 font-normal mb-2 leading-tight"
                    title="${task.description}"
                  >
                    ${task.description}
                  </p>`
              : ""
          }
        </div>

        <div
          class="flex flex-wrap items-center justify-between pt-2 mt-1 border-t border-border/40 text-[10px] text-secondary pl-1.5 gap-2"
        >
          <div class="flex items-center gap-2 font-semibold shrink-0">
            <span class="text-tertiary"
              >Imp: <strong class="text-primary">${importance}</strong></span
            >
            <span class="text-tertiary"
              >Urg: <strong class="text-primary">${urgency}</strong></span
            >
          </div>

          <div class="flex flex-wrap items-center gap-1.5 justify-start lg:justify-end">
            ${
              task.dueDate
                ? `
                    <span
                      class="text-[9px] text-tertiary font-medium flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      <i class="fa-regular fa-clock text-[8px]"></i>
                      ${task.dueDate}
                    </span>
                  `
                : ""
            }

            ${
              task.tags?.length
                ? `
                    <div class="flex flex-wrap items-center gap-1">
                      ${state.tags
                        .filter((t) => task.tags.includes(t.id))
                        .map(
                          (tag) => `
                            <span
                              class="text-[9px] bg-surface-3/40 text-secondary px-1.5 py-0.5 rounded border border-border/40 whitespace-nowrap flex flex-row justify-center items-center gap-1"
                            >
                              <i class="fa-regular fa-tags"></i> ${tag.name}
                            </span>
                          `,
                        )
                        .join("")}
                    </div>
                  `
                : ""
            }
          </div>
        </div>
      </div>
    `;
  },
};
