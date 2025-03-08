import {
  type User,
  type InsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type JournalEntry,
  type InsertJournalEntry,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseUid: string): Promise<User | undefined>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntries(userId: number): Promise<MoodEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: number): Promise<JournalEntry[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moodEntries: Map<number, MoodEntry>;
  private journalEntries: Map<number, JournalEntry>;
  private chatMessages: Map<number, ChatMessage>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.journalEntries = new Map();
    this.chatMessages = new Map();
    this.currentId = 1;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseId(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.currentId++;
    const moodEntry = { ...entry, id };
    this.moodEntries.set(id, moodEntry);
    return moodEntry;
  }

  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).filter(
      (entry) => entry.userId === userId
    );
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.currentId++;
    const journalEntry = { ...entry, id };
    this.journalEntries.set(id, journalEntry);
    return journalEntry;
  }

  async getJournalEntries(userId: number): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).filter(
      (entry) => entry.userId === userId
    );
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentId++;
    const chatMessage = { ...message, id };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.userId === userId
    );
  }
}

export const storage = new MemStorage();
