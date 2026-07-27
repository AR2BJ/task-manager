import { STORAGE_VERSION } from "@/models/storage.model";
import { formatDate } from "@/utils/helpers";

const TASK_TITLES = [
  "Fix OAuth2 Refresh Token Bug",
  "Refactor State Management Pipeline",
  "Write Unit Tests for Payment Gateway",
  "Optimize PostgreSQL Indexing Strategy",
  "Design Microservices System Architecture",
  "Set up CI/CD GitHub Actions Pipeline",
  "Implement Dark Mode Theme Support",
  "Review Pull Request for API Integration",
  "Audit Security Vulnerabilities in Dependencies",
  "Dockerize Application Container Infrastructure",
  "Setup Redis Cache Layer for Queries",
  "Draft Technical Specification Document",
];

const TASK_DESCRIPTIONS = [
  "Ensure high performance and maintainable clean code standards.",
  "Needs to be reviewed and aligned with modern architectural patterns.",
  "Priority deliverable required before the next sprint release.",
  "Follow system documentation guidelines closely during execution.",
  "",
];

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["todo", "in_progress", "done", "blocked"];
const AVAILABLE_TAGS = [
  "dev",
  "backend",
  "frontend",
  "bug",
  "architecture",
  "ops",
  "docs",
  "feature",
  "enhancement",
  "testing",
  "security",
  "performance",
  "ux",
  "ui",
  "database",
  "api",
  "deployment",
  "monitoring",
  "refactor",
  "dependencies",
];

const SUBTASK_TEMPLATES = [
  "Identify root cause",
  "Write test cases",
  "Implement fix/feature",
  "Perform peer review",
  "Deploy to staging",
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSubtasks() {
  const count = getRandomInt(0, 4);
  const subtasks = [];

  for (let i = 0; i < count; i++) {
    subtasks.push({
      id: `subtask-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
      title: getRandomElement(SUBTASK_TEMPLATES),
      completed: Math.random() > 0.5,
    });
  }
  return subtasks;
}

function getRandomTags() {
  const count = getRandomInt(1, 3);
  const shuffled = [...AVAILABLE_TAGS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateDynamicMockData(count = 20) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const tasks = [];

  for (let i = 1; i <= count; i++) {
    const title = `${getRandomElement(TASK_TITLES)} (#${i})`;
    const id = `mock-task-${i}-${Math.random().toString(36).substring(2, 7)}`;
    const status = getRandomElement(STATUSES);
    const priority = getRandomElement(PRIORITIES);
    const tags = getRandomTags();
    const description = getRandomElement(TASK_DESCRIPTIONS);
    const subtasks = getRandomSubtasks();

    const daysAgoCreated = getRandomInt(1, 60);
    const createdAtDate = subtractDays(today, daysAgoCreated);

    let dueDate = null;
    if (Math.random() > 0.2) {
      const dueOffset = getRandomInt(-5, 15);
      dueDate = formatDate(addDays(today, dueOffset));
    }

    const archived = status === "done" ? Math.random() < 0.2 : false;
    const completedAt =
      status === "done"
        ? formatDate(subtractDays(today, getRandomInt(0, 10)))
        : null;

    tasks.push({
      id,
      title,
      description,
      status,
      priority,
      dueDate,
      createdAt: formatDate(createdAtDate),
      updatedAt: formatDate(createdAtDate),
      completedAt,
      archived,
      tags,
      estimatedMinutes: getRandomElement([15, 30, 45, 60, 120]),
      subtasks,
    });
  }

  return {
    version: STORAGE_VERSION,
    tasks,
  };
}
