import { 
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty,
  type Application,
  type InsertApplication,
  type Deal,
  type InsertDeal,
  type Message,
  type InsertMessage,
  users,
  properties,
  applications,
  deals,
  messages
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, or, and, like, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Properties
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByOwner(ownerId: string): Promise<Property[]>;
  getAllProperties(): Promise<Property[]>;
  searchProperties(filters: {
    fruitType?: string;
    location?: string;
    radius?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Property[]>;
  createProperty(property: InsertProperty & { ownerId: string }): Promise<Property>;
  updateProperty(id: string, updates: Partial<Property>): Promise<Property | undefined>;

  // Applications
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByProperty(propertyId: string): Promise<Application[]>;
  getApplicationsByHarvester(harvesterId: string): Promise<Application[]>;
  createApplication(application: InsertApplication & { harvesterId: string }): Promise<Application>;
  updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined>;

  // Deals
  getDeal(id: string): Promise<Deal | undefined>;
  getDealsByUser(userId: string): Promise<Deal[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | undefined>;

  // Messages
  getMessagesByDeal(dealId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Properties
  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.ownerId, ownerId));
  }

  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.status, 'active'));
  }

  async searchProperties(filters: {
    fruitType?: string;
    location?: string;
    radius?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Property[]> {
    let query = db.select().from(properties).where(eq(properties.status, 'active'));

    // Note: For more complex filtering, we'd need to build dynamic where clauses
    // For now, we'll fetch all active properties and filter in memory
    const allProperties = await query;
    
    let results = allProperties;

    if (filters.fruitType && filters.fruitType !== 'all') {
      results = results.filter(prop => 
        prop.fruitType.toLowerCase().includes(filters.fruitType!.toLowerCase())
      );
    }

    if (filters.location) {
      results = results.filter(prop => 
        prop.address.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    return results;
  }

  async createProperty(property: InsertProperty & { ownerId: string }): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | undefined> {
    const [property] = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, id))
      .returning();
    return property || undefined;
  }

  // Applications
  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplicationsByProperty(propertyId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.propertyId, propertyId));
  }

  async getApplicationsByHarvester(harvesterId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.harvesterId, harvesterId));
  }

  async createApplication(application: InsertApplication & { harvesterId: string }): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  // Deals
  async getDeal(id: string): Promise<Deal | undefined> {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    return deal || undefined;
  }

  async getDealsByUser(userId: string): Promise<Deal[]> {
    return await db.select().from(deals).where(
      or(eq(deals.ownerId, userId), eq(deals.harvesterId, userId))
    );
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const [newDeal] = await db
      .insert(deals)
      .values(deal)
      .returning();
    return newDeal;
  }

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | undefined> {
    const [deal] = await db
      .update(deals)
      .set(updates)
      .where(eq(deals.id, id))
      .returning();
    return deal || undefined;
  }

  // Messages
  async getMessagesByDeal(dealId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.dealId, dealId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
