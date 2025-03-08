import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodEntrySchema, insertJournalEntrySchema, insertChatMessageSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mood routes
  app.post("/api/mood", async (req: Request, res: Response) => {
    try {
      const data = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(data);
      res.json(entry);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/mood", async (_req: Request, res: Response) => {
    try {
      // For now, return all entries since we don't have user authentication
      const entries = await storage.getMoodEntries(1); // Using a default user ID
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  // Journal routes
  app.post("/api/journal", async (req: Request, res: Response) => {
    try {
      const data = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(data);
      res.json(entry);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/journal", async (_req: Request, res: Response) => {
    try {
      // For now, return all entries since we don't have user authentication
      const entries = await storage.getJournalEntries(1); // Using a default user ID
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Chat routes
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const data = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(data);
      res.json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/chat", async (_req: Request, res: Response) => {
    try {
      // For now, return all entries since we don't have user authentication
      const messages = await storage.getChatMessages(1); // Using a default user ID
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}