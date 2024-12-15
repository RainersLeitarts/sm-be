import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  username: varchar({ length: 24 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  refreshToken: varchar(),
  password: varchar().notNull()
});

export const userRelations = relations(usersTable, ({ many }) => {
  return {
    posts: many(postsTable),
  };
});

export const postsTable = pgTable("posts", {
  id: uuid().defaultRandom().primaryKey(),
  textContent: varchar({ length: 500 }),
  authorId: uuid("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  modifiedAt: timestamp("modified_at").defaultNow().notNull(),
});

export const postRelations = relations(postsTable, ({ one }) => {
  return {
    author: one(usersTable, {
      fields: [postsTable.authorId],
      references: [usersTable.id],
    }),
  };
});
