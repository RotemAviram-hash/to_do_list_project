import type { Task } from "../models/Task";
import { tasksMock } from "../mock/tasksMock";

export const taskRepository = {
  async getAll(): Promise<Task[]> {
    return [...tasksMock];
  },

  async getById(id: string): Promise<Task | null> {
    return tasksMock.find((task) => task.id === id) ?? null;
  },

  async getByColumnId(columnId: string): Promise<Task[]> {
    return tasksMock.filter((task) => task.columnId === columnId);
  },

  async create(task: Task): Promise<void> {
    tasksMock.push(task);
  },

  async update(task: Task): Promise<void> {
    const index = tasksMock.findIndex((t) => t.id === task.id);

    if (index !== -1) {
      tasksMock[index] = task;
    }
  },

  async delete(id: string): Promise<void> {
    const index = tasksMock.findIndex((t) => t.id === id);

    if (index !== -1) {
      tasksMock.splice(index, 1);
    }
  },
};
