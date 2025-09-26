import { tasks, type Task, type InsertTask } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
  toggleTaskCompletion(id: string): Promise<Task | null>;
}

export class DatabaseStorage implements IStorage {
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async toggleTaskCompletion(id: string): Promise<Task | null> {
    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!existingTask) return null;
    
    const [updatedTask] = await db
      .update(tasks)
      .set({ completed: !existingTask.completed })
      .where(eq(tasks.id, id))
      .returning();
    
    return updatedTask;
  }
}

export const storage = new DatabaseStorage();
