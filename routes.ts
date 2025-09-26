import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب المهام" });
    }
  });

  // Create a new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      
      if (!taskData.text.trim()) {
        return res.status(400).json({ message: "الرجاء كتابة مهمة أولاً!" });
      }

      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "بيانات المهمة غير صحيحة" });
      }
      res.status(500).json({ message: "خطأ في إضافة المهمة" });
    }
  });

  // Toggle task completion
  app.patch("/api/tasks/:id/toggle", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await storage.toggleTaskCompletion(id);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "المهمة غير موجودة" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "خطأ في تحديث المهمة" });
    }
  });

  // Delete a task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "المهمة غير موجودة" });
      }
      
      res.json({ message: "تم حذف المهمة بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف المهمة" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
