import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // 'landowner' | 'harvester'
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  bio: text("bio"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fruitType: text("fruit_type").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accessInstructions: text("access_instructions"),
  harvestStartDate: date("harvest_start_date").notNull(),
  harvestEndDate: date("harvest_end_date").notNull(),
  ownerShare: integer("owner_share").notNull(), // percentage
  harvesterShare: integer("harvester_share").notNull(), // percentage
  estimatedYield: decimal("estimated_yield", { precision: 8, scale: 2 }).notNull(),
  yieldUnit: text("yield_unit").notNull(), // 'kg', 'lbs', 'baskets'
  images: jsonb("images").$type<string[]>().default([]),
  preferredQualities: jsonb("preferred_qualities").$type<string[]>().default([]),
  specialRequirements: text("special_requirements"),
  status: text("status").default("active"), // 'active', 'inactive', 'completed'
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  harvesterId: varchar("harvester_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  preferredDates: jsonb("preferred_dates").$type<string[]>().default([]),
  hasExperience: boolean("has_experience").default(false),
  hasEquipment: boolean("has_equipment").default(false),
  isFlexible: boolean("is_flexible").default(false),
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
});

export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  harvesterId: varchar("harvester_id").notNull().references(() => users.id),
  applicationId: varchar("application_id").notNull().references(() => applications.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  ownerShare: integer("owner_share").notNull(),
  harvesterShare: integer("harvester_share").notNull(),
  actualYield: decimal("actual_yield", { precision: 8, scale: 2 }),
  status: text("status").default("active"), // 'active', 'completed', 'cancelled'
  ownerRating: integer("owner_rating"), // 1-5
  harvesterRating: integer("harvester_rating"), // 1-5
  ownerReview: text("owner_review"),
  harvesterReview: text("harvester_review"),
  completedAt: date("completed_at"),
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull().references(() => deals.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  rating: true,
  totalRatings: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  ownerId: true,
  status: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  harvesterId: true,
  status: true,
  createdAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  actualYield: true,
  status: true,
  ownerRating: true,
  harvesterRating: true,
  ownerReview: true,
  harvesterReview: true,
  completedAt: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
