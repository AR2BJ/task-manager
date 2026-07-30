import {
  renderAbcdeList,
  renderEisenhowerGrid,
} from "@/views/matrix/matrix.renderer.js";

import { StateManager } from "@/models/state.model.js";

export class MatrixController {
  static currentMode = "eisenhower";

  static init() {
    this.bindEvents();
  }

  static bindEvents() {
    document
      .getElementById("btn-matrix-eisenhower")
      ?.addEventListener("click", () => {
        this.switchMode("eisenhower");
      });

    document
      .getElementById("btn-matrix-abcde")
      ?.addEventListener("click", () => {
        this.switchMode("abcde");
      });
  }

  static switchMode(mode) {
    this.currentMode = mode;
    const btnEisenhower = document.getElementById("btn-matrix-eisenhower");
    const btnAbcde = document.getElementById("btn-matrix-abcde");

    if (mode === "eisenhower") {
      btnEisenhower?.classList.add("bg-brand", "text-white", "shadow-sm");
      btnEisenhower?.classList.remove("text-secondary");
      btnAbcde?.classList.remove("bg-brand", "text-white", "shadow-sm");
      btnAbcde?.classList.add("text-secondary");
    } else {
      btnAbcde?.classList.add("bg-brand", "text-white", "shadow-sm");
      btnAbcde?.classList.remove("text-secondary");
      btnEisenhower?.classList.remove("bg-brand", "text-white", "shadow-sm");
      btnEisenhower?.classList.add("text-secondary");
    }

    this.dispatchRender();
  }

  static dispatchRender() {
    const container = document.getElementById("matrix-content-container");
    if (!container) return;

    const activeTasks = StateManager.getTasks().filter(
      (t) => t.status !== "done" && !t.isArchived,
    );

    if (this.currentMode === "eisenhower") {
      container.innerHTML = renderEisenhowerGrid(activeTasks);
    } else {
      container.innerHTML = renderAbcdeList(activeTasks);
    }
  }
}
