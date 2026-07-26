import { loadFromStorage, saveToStorage } from "./storage.model.js";

export const state = {
  tasks: [],
  lastDeletedTask: null,
  activeTab: "active",
  currentView: "tasks",
  selectedTag: "all",
  currentPriority: "low",
  currentStatus: "todo",
  sortBy: "dueDate",
  searchQuery: "",
};

export const StateManager = {
  init() {
    const saved = loadFromStorage();
    if (saved) {
      state.tasks = saved.tasks || [];
    }
    return state.tasks;
  },

  getTasks() {
    return state.tasks;
  },

  getFilteredTasks() {
    let list = this.getTasks();

    if (state.activeTab === "active") {
      list = list.filter((task) => !task.archived && task.status !== "done");
    } else if (state.activeTab === "completed") {
      list = list.filter((task) => !task.archived && task.status === "done");
    } else if (state.activeTab === "archived") {
      list = list.filter((task) => task.archived);
    }

    if (state.selectedTag && state.selectedTag !== "all") {
      list = list.filter((task) => task.tags.includes(state.selectedTag));
    }

    if (state.activeTab === "active" && state.currentStatus !== "todo") {
      list = list.filter((task) => task.status === state.currentStatus);
    }

    if (state.currentPriority && state.currentPriority !== "low") {
      list = list.filter((task) => task.priority === state.currentPriority);
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase().trim();
      list = list.filter((task) => {
        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();
        const tagsMatch = task.tags?.some((tag) =>
          tag.toLowerCase().includes(query),
        );

        return (
          title.includes(query) || description.includes(query) || tagsMatch
        );
      });
    }

    return this.sortTasks(list, state.sortBy);
  },

  sortTasks(tasks, sortBy) {
    const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };

    return [...tasks].sort((a, b) => {
      if (sortBy === "priority") {
        return (
          (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
        );
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  setSelectedTag(tag) {
    state.selectedTag = tag;
  },

  setPriority(priority) {
    state.currentPriority = priority;
  },

  setStatus(status) {
    state.currentStatus = status;
  },

  setSortBy(sortBy) {
    state.sortBy = sortBy;
  },

  setTab(tab) {
    state.activeTab = tab;
  },

  setView(view) {
    state.currentView = view;
  },

  setSearchQuery(query) {
    state.searchQuery = query;
  },

  save(tasks) {
    state.tasks = tasks;
    saveToStorage({ tasks: state.tasks });
  },
};
