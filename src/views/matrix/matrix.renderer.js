import { MatrixTaskCardComponent } from "@/components/features/matrix/matrix.component.js";
import { getTaskMatrixAttributes } from "@/utils/helpers";

export function renderEisenhowerGrid(tasks) {
  const q1 = [];
  const q2 = [];
  const q3 = [];
  const q4 = [];

  tasks.forEach((task) => {
    const { quadrant } = getTaskMatrixAttributes(task);
    if (quadrant === 1) q1.push(task);
    else if (quadrant === 2) q2.push(task);
    else if (quadrant === 3) q3.push(task);
    else q4.push(task);
  });

  const renderSection = (title, subtitle, taskList, colorTheme, icon) => `
    <div class="flex flex-col h-full rounded-2xl bg-surface-2 border border-border/70 p-4 shadow-sm">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl ${colorTheme.bg} ${colorTheme.text} border ${colorTheme.border} flex items-center justify-center text-sm">
            <i class="${icon}"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-primary flex items-center gap-2">
              ${title}
              <span class="text-xs px-2 py-0.5 rounded-md ${colorTheme.bg} ${colorTheme.text} font-bold border ${colorTheme.border}">
                ${taskList.length}
              </span>
            </h3>
            <p class="text-[11px] text-secondary/80 font-medium">${subtitle}</p>
          </div>
        </div>
      </div>

      <div class="flex-1 space-y-2.5 overflow-y-auto max-h-105 min-h-35 pr-1 scrollbar-thin scrollbar-thumb-surface">
        ${
          taskList.length > 0
            ? taskList
                .map((task) => MatrixTaskCardComponent.render(task))
                .join("")
            : `<div class="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border/70 rounded-xl bg-surface/40">
                 <p class="text-xs text-secondary font-medium">No tasks in this quadrant</p>
               </div>`
        }
      </div>
    </div>
  `;

  return `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      ${renderSection(
        "Do First (Q1)",
        "Urgent & Important",
        q1,
        {
          bg: "bg-red-500/10",
          text: "text-red-400",
          border: "border-red-500/20",
        },
        "fa-solid fa-fire",
      )}
      ${renderSection(
        "Schedule (Q2)",
        "Not Urgent but Important",
        q2,
        {
          bg: "bg-sky-500/10",
          text: "text-sky-400",
          border: "border-sky-500/20",
        },
        "fa-solid fa-calendar-check",
      )}
      ${renderSection(
        "Delegate (Q3)",
        "Urgent but Not Important",
        q3,
        {
          bg: "bg-amber-500/10",
          text: "text-amber-400",
          border: "border-amber-500/20",
        },
        "fa-solid fa-user-gear",
      )}
      ${renderSection(
        "Eliminate (Q4)",
        "Neither Urgent nor Important",
        q4,
        {
          bg: "bg-slate-500/10",
          text: "text-slate-400",
          border: "border-slate-500/20",
        },
        "fa-solid fa-trash-can",
      )}
    </div>
  `;
}

export function renderAbcdeList(tasks) {
  const tasksWithMetrics = tasks.map((task) => ({
    task,
    metrics: getTaskMatrixAttributes(task),
  }));

  const groups = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
  };

  tasksWithMetrics.forEach((item) => {
    const score = item.metrics.priorityScore;

    if (score >= 20) groups.A.push(item);
    else if (score >= 12) groups.B.push(item);
    else if (score >= 6) groups.C.push(item);
    else if (score >= 3) groups.D.push(item);
    else groups.E.push(item);
  });

  const sortByScoreDesc = (a, b) =>
    b.metrics.priorityScore - a.metrics.priorityScore;

  Object.keys(groups).forEach((key) => {
    groups[key].sort(sortByScoreDesc);
  });

  const categories = [
    {
      key: "A",
      label: "Must Do",
      desc: "Severe consequences",
      style: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    {
      key: "B",
      label: "Should Do",
      desc: "Medium consequences",
      style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      key: "C",
      label: "Nice to Do",
      desc: "No consequences",
      style: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    },
    {
      key: "D",
      label: "Delegate",
      desc: "Pass to others",
      style: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
      key: "E",
      label: "Eliminate",
      desc: "Low impact",
      style: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
  ];

  return `
    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
      ${categories
        .map((cat) => {
          const list = groups[cat.key];
          return `
          <div class="flex flex-col h-full rounded-2xl bg-surface-2 border border-border/70 p-3.5 shadow-sm">
            <div class="pb-3 mb-3 border-b border-border/60 flex items-center justify-between">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-black px-2 py-0.5 rounded border ${cat.style}">
                    ${cat.key}
                  </span>
                  <span class="text-xs font-bold text-primary">${cat.label}</span>
                </div>
                <p class="text-[10px] text-secondary/80 mt-1 font-medium">${cat.desc}</p>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-md border font-bold ${cat.style}">
                ${list.length}
              </span>
            </div>

            <div class="flex-1 space-y-2 overflow-y-auto max-h-120 min-h-30 pr-1 scrollbar-thin scrollbar-thumb-surface">
              ${
                list.length > 0
                  ? list
                      .map((item) => MatrixTaskCardComponent.render(item.task))
                      .join("")
                  : `<div class="h-full flex items-center justify-center text-center p-2 border border-dashed border-border/70 rounded-xl bg-surface/40">
                     <p class="text-[11px] text-secondary font-medium">Empty</p>
                   </div>`
              }
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}
