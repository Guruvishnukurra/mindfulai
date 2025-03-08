import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  firebaseUid: text("firebase_uid").notNull().unique()
});

export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: integer("mood").notNull(),
  note: text("note"),
  timestamp: timestamp("timestamp").notNull()
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull()
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  isAi: boolean("is_ai").notNull(),
  timestamp: timestamp("timestamp").notNull()
});

// New tables for habit tracking and rewards
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'meditation', 'journaling', etc.
  targetFrequency: integer("target_frequency").notNull(), // times per week
  currentStreak: integer("current_streak").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(),
  userId: integer("user_id").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  note: text("note"),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'badge', 'streak', etc.
  name: text("name").notNull(),
  description: text("description").notNull(),
  earnedAt: timestamp("earned_at").notNull(),
  metadata: text("metadata"), // JSON string for additional data
});

// Add new tables for achievements and badges
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'meditation_master', 'mood_tracker', 'journal_keeper', etc.
  level: integer("level").notNull().default(1),
  progress: integer("progress").notNull().default(0),
  targetValue: integer("target_value").notNull(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Lucide icon name
  type: text("type").notNull(), // 'achievement', 'community_support', 'milestone'
  requirement: text("requirement").notNull(), // JSON string describing requirements
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

// Original insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  photoUrl: true,
  firebaseUid: true
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).pick({
  userId: true,
  mood: true,
  note: true,
  timestamp: true
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  userId: true,
  content: true,
  timestamp: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  content: true,
  isAi: true,
  timestamp: true
});

// New insert schemas for habits and rewards
export const insertHabitSchema = createInsertSchema(habits).pick({
  userId: true,
  name: true,
  description: true,
  type: true,
  targetFrequency: true,
});

export const insertHabitLogSchema = createInsertSchema(habitLogs).pick({
  habitId: true,
  userId: true,
  completedAt: true,
  note: true,
});

export const insertRewardSchema = createInsertSchema(rewards).pick({
  userId: true,
  type: true,
  name: true,
  description: true,
  earnedAt: true,
  metadata: true,
});

// Add insert schemas for new tables
export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  type: true,
  level: true,
  progress: true,
  targetValue: true,
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  icon: true,
  type: true,
  requirement: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeId: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;

// Add new type exports
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;