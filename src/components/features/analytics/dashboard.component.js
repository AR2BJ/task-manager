import {
  calculateSubtaskProgress,
  getDaysRemaining,
  isOverdue,
} from "@/utils/helpers.js";

export const DashboardComponent = {
  render(tasks = []) {
    const activeTasks = tasks.filter((t) => !t.archived);
    const archivedTasks = tasks.filter((t) => t.archived);

    const totalTasksCount = tasks.length;
    const activeCount = activeTasks.length;
    const archivedCount = archivedTasks.length;

    // Task Status Breakdown
    const completedTasks = activeTasks.filter((t) => t.status === "done");
    const completedCount = completedTasks.length;

    const BlockedCount = activeTasks.filter(
      (t) => t.status === "blocked",
    ).length;

    const DoneCount = activeTasks.filter((t) => t.status === "done").length;

    const inProgressCount = activeTasks.filter(
      (t) => t.status === "in_progress",
    ).length;

    const todoCount = activeTasks.filter((t) => t.status === "todo").length;

    const overdueCount = activeTasks.filter((t) =>
      isOverdue(t.dueDate, t.status),
    ).length;

    // Subtasks Aggregation
    let totalSubtasks = 0;
    let completedSubtasks = 0;

    activeTasks.forEach((t) => {
      if (Array.isArray(t.subtasks) && t.subtasks.length > 0) {
        totalSubtasks += t.subtasks.length;
        completedSubtasks += t.subtasks.filter((st) => st.completed).length;
      }
    });

    const subtaskRate =
      totalSubtasks > 0
        ? Math.round((completedSubtasks / totalSubtasks) * 100)
        : 0;

    const overallCompletionRate =
      activeCount > 0 ? Math.round((completedCount / activeCount) * 100) : 0;

    // Extract Top Tags Count for Analytic Insight
    const tagCounts = {};
    activeTasks.forEach((t) => {
      (t.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return `
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full col-span-full"
      >
        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-brand/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-layer-group absolute -right-4 -bottom-6 text-[10rem] text-brand opacity-[0.04] dark:opacity-[0.06] rotate-20 pointer-events-none group-hover:scale-110 group-hover:rotate-10 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Total Tasks</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/20"
              >${activeCount} Active</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-primary tracking-tight">
              ${totalTasksCount}
            </div>
            <div
              class="flex items-center gap-3 text-[11px] text-secondary/80 font-medium mt-1"
            >
              <span
                ><strong class="text-red-400">${BlockedCount}</strong>&nbsp; Blocked</span
              >
              <span>•</span>
              <span
                ><strong class="text-emerald-400">${DoneCount}</strong>&nbsp; Done</span
              >
              <span>•</span>
              <span
                ><strong class="text-amber-400">${inProgressCount}</strong>&nbsp; In
                Progress</span
              >
              <span>•</span>
              <span
                ><strong class="text-brand">${todoCount}</strong>&nbsp; To Do</span
              >
            </div>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-circle-check absolute -right-4 -bottom-6 text-[10rem] text-emerald-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Completion Rate</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >${completedCount}/${activeCount} Done</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-primary tracking-tight">
              ${overallCompletionRate}%
            </div>
            <div
              class="w-full h-1.5 bg-surface-1 rounded-full overflow-hidden mt-2"
            >
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                style="width: ${overallCompletionRate}%"
              ></div>
            </div>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-rose-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-alarm-exclamation absolute -right-4 -bottom-6 text-[10rem] text-rose-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Overdue Tasks</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                overdueCount > 0
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                  : "bg-surface-1 text-secondary"
              }"
            >
              ${overdueCount > 0 ? "Action Needed" : "All Clear"}
            </span>
          </div>
          <div class="z-10 mt-3">
            <div
              class="text-3xl font-black ${
                overdueCount > 0 ? "text-rose-400" : "text-primary"
              } tracking-tight"
            >
              ${overdueCount}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              ${
                overdueCount > 0
                  ? "Requires immediate attention"
                  : "No overdue deadlines"
              }
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-list-check absolute -right-4 -bottom-6 text-[10rem] text-amber-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Subtask Velocity</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20"
              >${completedSubtasks}/${totalSubtasks} Units</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-primary tracking-tight">
              ${subtaskRate}%
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Micro-execution lifecycle progress
            </p>
          </div>
        </div>

        <div
          class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-full mt-4"
        >
          <div
            class="lg:col-span-2 bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div
              class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
            >
              <div>
                <h4
                  class="text-lg font-bold text-primary flex items-center gap-2"
                >
                  <i class="fa-regular fa-chart-network text-brand text-xl"></i>
                  Sprint & Execution Heatmap
                </h4>
                <p class="text-xs text-secondary mt-1">
                  Task density velocity tracking across defined execution
                  windows.
                </p>
              </div>

              <div class="relative flex items-center justify-end">
                <button
                  id="heatmap-mobile-menu-toggle"
                  class="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-surface text-secondary hover:text-primary transition shadow-sm cursor-pointer"
                  aria-label="Open view menu"
                >
                  <i class="fa-regular fa-ellipsis-vertical text-lg"></i>
                </button>

                <div
                  id="heatmap-mobile-menu"
                  class="hidden absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border bg-surface-2 shadow-lg z-20 overflow-hidden"
                >
                  <button
                    data-view="weekly"
                    class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface-1"
                  >
                    Weekly
                  </button>
                  <button
                    data-view="monthly"
                    class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface-1"
                  >
                    Monthly
                  </button>
                  <button
                    data-view="yearly"
                    class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface-1"
                  >
                    Yearly
                  </button>
                </div>

                <div
                  id="chart-view-switcher"
                  class="hidden sm:flex relative overflow-hidden rounded-xl border border-border/80 bg-surface-1 p-1 isolation-auto"
                >
                  <div
                    id="heatmap-tab-indicator"
                    class="absolute top-1 left-1 h-[calc(100%-8px)] w-24 rounded-lg bg-brand transition-all duration-300 ease-out z-0 shadow-sm"
                  ></div>

                  <button
                    data-view="weekly"
                    id="view-btn-weekly"
                    class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                  >
                    Weekly
                  </button>
                  <button
                    data-view="monthly"
                    id="view-btn-monthly"
                    class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                  >
                    Monthly
                  </button>
                  <button
                    data-view="yearly"
                    id="view-btn-yearly"
                    class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>

            <div
              class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface px-2"
            >
              <div
                id="apex-heatmap-chart"
                class="min-w-120 md:min-w-full"
              ></div>
            </div>
          </div>

          <div
            class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <h4
                class="text-lg font-bold text-primary flex items-center gap-2"
              >
                <i
                  class="fa-regular fa-chart-simple text-amber-400 text-xl"
                ></i>
                Distribution Trends
              </h4>
              <p class="text-xs text-secondary mt-1">
                Execution pattern mapped by days of week.
              </p>
            </div>

            <div
              id="apex-weekday-chart"
              class="w-full mt-4"
            ></div>

            ${
              sortedTags.length > 0
                ? `
              <div class="mt-4 pt-4 border-t border-border/50">
                <span class="text-[11px] font-bold uppercase text-secondary tracking-wider block mb-2">Top Active Tags</span>
                <div class="flex flex-wrap gap-1.5">
                  ${sortedTags
                    .map(
                      ([tag, count]) => `
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-1 border border-border/60 text-[10px] text-primary font-medium">
                      <span class="text-brand font-bold">#${tag}</span>
                      <span class="px-1.5 py-0.2 rounded-full bg-surface-2 text-secondary font-mono">${count}</span>
                    </span>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        </div>

        <div
          class="w-full col-span-full mt-4 bg-surface-2 border border-border/70 rounded-2xl p-6"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div>
              <h4
                class="text-lg font-bold text-primary flex items-center gap-2"
              >
                <i class="fa-regular fa-sliders text-brand text-xl"></i>
                Task-Level Execution & Subtask Progress
              </h4>
              <p class="text-xs text-secondary/80 mt-0.5 font-medium">
                Granular view of active work items, subtask ratios, and
                milestone health.
              </p>
            </div>
            <span
              class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-1 border border-border text-secondary self-start sm:self-auto"
            >
              ${activeCount} Active Tracked (${archivedCount} Archived)
            </span>
          </div>

          <div class="mt-6 space-y-3">
            ${
              tasks.length === 0
                ? `
                  <div class="text-center py-12 text-secondary text-sm bg-surface-1 rounded-xl border border-dashed border-border/80 flex flex-col items-center justify-center gap-2">
                    <i class="fa-regular fa-box-open text-3xl opacity-30"></i>
                    <span>No tasks found in repository.</span>
                  </div>
                `
                : tasks
                    .map((task) => {
                      const subtaskInfo = calculateSubtaskProgress(
                        task.subtasks,
                      );
                      const daysRemaining = getDaysRemaining(task.dueDate);
                      const overdue = isOverdue(task.dueDate, task.status);

                      let dueBadge = `<span class="text-secondary/60">No due date</span>`;
                      if (task.dueDate) {
                        if (overdue) {
                          dueBadge = `<span class="text-rose-400 font-bold"><i class="fa-regular fa-clock me-1"></i>Overdue (${Math.abs(daysRemaining)}d)</span>`;
                        } else if (daysRemaining === 0) {
                          dueBadge = `<span class="text-amber-400 font-bold"><i class="fa-regular fa-clock me-1"></i>Due Today</span>`;
                        } else {
                          dueBadge = `<span class="text-secondary"><i class="fa-regular fa-calendar me-1"></i>${daysRemaining}d left</span>`;
                        }
                      }

                      const statusBadgeStyles = {
                        todo: "bg-surface-1 text-secondary border-border/60",
                        in_progress:
                          "bg-blue-500/10 text-blue-400 border-blue-500/20",
                        done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        blocked:
                          "bg-rose-500/10 text-rose-400 border-rose-500/20",
                      };

                      return `
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-1/80 hover:bg-surface-1 p-4 rounded-xl border border-border/40 transition">
                          
                          <div class="flex flex-col gap-1.5 min-w-0 flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                              <span class="inline-flex items-center rounded px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider border ${statusBadgeStyles[task.status] || statusBadgeStyles.todo}">
                                ${(task.status || "todo").replace("_", " ")}
                              </span>

                              ${
                                task.priority
                                  ? `
                                <span class="inline-flex items-center rounded px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-surface-2 text-secondary border border-border/50">
                                  ${task.priority}
                                </span>
                              `
                                  : ""
                              }

                              ${
                                task.archived
                                  ? `<span class="inline-flex items-center rounded px-2 py-0.5 text-[9px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Archived</span>`
                                  : ""
                              }
                            </div>

                            <h5 class="text-sm font-bold text-primary truncate">
                              ${task.title}
                            </h5>

                            <div class="flex items-center gap-4 text-[11px] text-secondary/80 font-medium flex-wrap">
                              <span>${dueBadge}</span>
                              ${
                                (task.tags || []).length > 0
                                  ? `
                                <div class="flex items-center gap-1">
                                  <i class="fa-regular fa-hashtag text-[10px] opacity-60"></i>
                                  <span>${task.tags.join(", ")}</span>
                                </div>
                              `
                                  : ""
                              }
                            </div>
                          </div>

                          <div class="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-border/40 pt-3 lg:pt-0 shrink-0">
                            <div class="flex flex-col gap-1 w-36 sm:w-48">
                              <div class="flex justify-between items-center text-[11px]">
                                <span class="text-secondary font-medium">Subtasks</span>
                                <span class="font-mono font-bold text-primary">${subtaskInfo.completedCount}/${subtaskInfo.totalCount} (${subtaskInfo.percentage}%)</span>
                              </div>
                              <div class="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                                <div class="h-full bg-brand transition-all duration-300" style="width: ${subtaskInfo.percentage}%"></div>
                              </div>
                            </div>

                            <div class="text-right">
                              <span class="text-[10px] text-secondary/60 block uppercase font-bold">Created</span>
                              <span class="text-xs font-mono font-medium text-primary">${task.createdAt || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      `;
                    })
                    .join("")
            }
          </div>
        </div>
      </div>
    `;
  },
};
