import { AnalyticsAdapter } from "@/utils/analytics.adapter.js";
import { AnalyticsController } from "@/controllers/analytics.controller.js";
import ApexCharts from "apexcharts";
import { DashboardComponent } from "@/components/features/analytics/dashboard.component.js";

let heatmapChartInstance = null;
let barChartInstance = null;
let resizeListenerAttached = false;
let activeHeatmapTab = "weekly";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Calculates and returns ApexCharts configuration options for Heatmap
 */
function getHeatmapOptions(tasks, view) {
  const heatmapSeries = AnalyticsAdapter.generateHeatmapSeries(tasks, view);
  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#9ca3af" : "#4b5563";

  const currentTabCounts = heatmapSeries.flatMap((s) => s.data.map((d) => d.y));
  let maxCommit = Math.max(1, ...currentTabCounts);
  if (view === "weekly") {
    maxCommit = Math.max(maxCommit, 4);
  }

  const ranges = AnalyticsAdapter.getColorRanges(view, maxCommit, isDark);

  return {
    series: heatmapSeries,
    chart: {
      id: "lifetime-heatmap",
      type: "heatmap",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 250,
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        radius: view === "weekly" ? 4 : 2,
        cellMargin: view === "weekly" ? 8 : view === "monthly" ? 4 : 2,
        colorScale: { ranges },
      },
    },
    stroke: {
      show: true,
      width: view === "weekly" ? 3 : view === "monthly" ? 2 : 1,
      colors: [isDark ? "#222f47" : "#e2e8f0"],
    },
    xaxis: {
      type: "category",
      labels: {
        show: true,
        style: {
          colors: axisTextColor,
          fontSize: view === "weekly" ? "11px" : "10px",
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: view === "weekly" ? "11px" : "10px",
          fontWeight: 700,
        },
        offsetX: -5,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => `${val} activity ticks`,
      },
    },
  };
}

/**
 * Updates heatmap chart instance safely with new view settings
 */
export function updateHeatmapChart(tasks, view) {
  if (!heatmapChartInstance) return;

  const newOptions = getHeatmapOptions(tasks, view);
  heatmapChartInstance.updateOptions(newOptions, true, true);
}

/**
 * Updates UI active tab indicator sliding animation & active states
 */
export function updateTabStyles(tab) {
  activeHeatmapTab = tab;

  const indicator = document.getElementById("heatmap-tab-indicator");
  const btnWeekly = document.getElementById("view-btn-weekly");
  const btnMonthly = document.getElementById("view-btn-monthly");
  const btnYearly = document.getElementById("view-btn-yearly");
  const switcher = document.getElementById("chart-view-switcher");

  if (!indicator || !btnWeekly || !btnMonthly || !btnYearly || !switcher)
    return;

  syncMobileMenuSelection(tab);

  const buttons = [btnWeekly, btnMonthly, btnYearly];
  const activeButton =
    tab === "monthly" ? btnMonthly : tab === "yearly" ? btnYearly : btnWeekly;

  buttons.forEach((btn) => {
    btn.classList.remove("text-primary", "font-black");
    btn.classList.add("text-secondary");
  });

  activeButton.classList.remove("text-secondary");
  activeButton.classList.add("text-primary", "font-black");

  const switcherRect = switcher.getBoundingClientRect();
  const activeRect = activeButton.getBoundingClientRect();

  if (switcherRect.width > 0 && activeRect.width > 0) {
    const left = activeRect.left - switcherRect.left;
    indicator.style.transform = `translateX(${left - 4}px)`;
    indicator.style.width = `${activeRect.width}px`;
  }
}

function syncMobileMenuSelection(view) {
  const buttons = document.querySelectorAll("#heatmap-mobile-menu [data-view]");

  buttons.forEach((btn) => {
    const isActive = btn.getAttribute("data-view") === view;
    btn.classList.toggle("bg-brand/10", isActive);
    btn.classList.toggle("text-brand", isActive);
    btn.classList.toggle("font-bold", isActive);
    btn.classList.toggle("text-secondary", !isActive);
  });
}

/**
 * Binds desktop and mobile view tab click handlers
 */
function bindAnalyticsControls(tasks) {
  const switcher = document.getElementById("chart-view-switcher");
  if (switcher) {
    switcher.querySelectorAll("[data-view]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const view = e.currentTarget.dataset.view;
        if (view && view !== activeHeatmapTab) {
          updateTabStyles(view);
          updateHeatmapChart(tasks, view);
        }
      };
    });
  }

  const mobileToggle = document.getElementById("heatmap-mobile-menu-toggle");
  const mobileMenu = document.getElementById("heatmap-mobile-menu");

  if (mobileToggle && mobileMenu) {
    syncMobileMenuSelection(activeHeatmapTab);

    mobileToggle.onclick = (event) => {
      event.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    };

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.add("hidden");
      }
    });

    mobileMenu.querySelectorAll("[data-view]").forEach((btn) => {
      btn.onclick = (event) => {
        event.stopPropagation();
        const view = event.currentTarget.dataset.view;
        if (view && view !== activeHeatmapTab) {
          updateTabStyles(view);
          updateHeatmapChart(tasks, view);
        }
        mobileMenu.classList.add("hidden");
      };
    });
  }
}

function handleAnalyticsResize() {
  updateTabStyles(activeHeatmapTab);
}

/**
 * Main entry point to render all analytics components and charts
 */
export function renderAnalyticsCharts(
  tasks = [],
  currentHeatmapView = "weekly",
) {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return;

  // Cleanup existing chart instances before re-rendering DOM
  if (heatmapChartInstance) {
    heatmapChartInstance.destroy();
    heatmapChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }

  // Inject HTML Dashboard template
  dashboard.innerHTML = DashboardComponent.render(tasks);

  AnalyticsController.init();
  bindAnalyticsControls(tasks);

  if (!resizeListenerAttached) {
    window.addEventListener("resize", handleAnalyticsResize);
    resizeListenerAttached = true;
  }

  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#e2e8f0" : "#222f47";

  // Build Heatmap Options
  const heatmapOptions = getHeatmapOptions(tasks, currentHeatmapView);

  // Build Bar Chart Options
  const weekdayCounts = AnalyticsAdapter.generateWeekdayCounts(tasks);
  const barChartOptions = {
    series: [{ name: "Tasks Activity", data: weekdayCounts }],
    chart: {
      id: "weekday-bar",
      type: "bar",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#10b981"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "50%",
        dataLabels: { position: "end" },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "end",
      offsetX: 8,
      colors: [isDark ? "#e2e8f0" : "#222f47"],
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: [axisTextColor],
      },
      formatter: (val) => val + " checked",
    },
    xaxis: {
      categories: weekdayNames,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: axisTextColor, fontSize: "12px", fontWeight: 700 },
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#e5e7eb" : "#bfcbd9",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  // Mount ApexCharts
  const heatmapEl = document.getElementById("apex-heatmap-chart");
  const barEl = document.getElementById("apex-weekday-chart");

  if (heatmapEl) {
    heatmapChartInstance = new ApexCharts(heatmapEl, heatmapOptions);
    heatmapChartInstance.render();
  }

  if (barEl) {
    barChartInstance = new ApexCharts(barEl, barChartOptions);
    barChartInstance.render();
  }

  // Sync tab slider position in next frame after DOM calculation
  requestAnimationFrame(() => {
    updateTabStyles(currentHeatmapView);
  });
}
