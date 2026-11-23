import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  credential: varchar("credential", { length: 40 }).notNull(),
  years: integer("years").notNull(),
  careType: varchar("care_type", { length: 20 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  stateName: varchar("state_name", { length: 40 }).notNull(),
  degree: text("degree").notNull(),
  credentialBlurb: text("credential_blurb").notNull(),
  bio: text("bio").notNull(),
  quote: text("quote").notNull(),
  specialties: text("specialties").array().notNull(),
  styles: text("styles").array().notNull(),
  languages: text("languages").array().notNull(),
  insurances: text("insurances").array().notNull(),
  ages: text("ages").array().notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  badge: varchar("badge", { length: 140 }),
  photo: varchar("photo", { length: 140 }).notNull(),
  photoPos: varchar("photo_pos", { length: 14 }).notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  nextAvailable: varchar("next_available", { length: 40 }).notNull(),
  accepting: boolean("accepting").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  author: varchar("author", { length: 80 }).notNull(),
  rating: integer("rating").notNull(),
  sessionType: varchar("session_type", { length: 60 }).notNull(),
  publishedOn: varchar("published_on", { length: 40 }).notNull(),
  body: text("body").notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id"),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  insurance: varchar("insurance", { length: 80 }),
  reason: text("reason"),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Provider = typeof providers.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
