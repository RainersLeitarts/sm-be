import { relations, sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  username: varchar({ length: 24 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  refreshToken: varchar(),
  password: varchar().notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => {
  return {
    posts: many(postsTable),
    comments: many(commentsTable),
    likes: many(likesTable),
  };
});

export const postsTable = pgTable("posts", {
  id: uuid().defaultRandom().primaryKey(),
  textContent: varchar({ length: 1000 }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id),
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  modifiedAt: timestamp("modified_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const postRelations = relations(postsTable, ({ one, many }) => {
  return {
    media: many(mediaTable),
    author: one(usersTable, {
      fields: [postsTable.authorId],
      references: [usersTable.id],
    }),
    comments: many(commentsTable),
    likes: many(likesTable),
  };
});

export const mediaTable = pgTable("media", {
  id: uuid().defaultRandom().primaryKey(),
  publicUrl: varchar({ length: 200 }).notNull(),
  mimeType: varchar({ length: 30 }),
  postId: uuid("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaRelations = relations(mediaTable, ({ one }) => {
  return {
    post: one(postsTable, {
      fields: [mediaTable.postId],
      references: [postsTable.id],
    }),
  };
});

export const commentsTable = pgTable(
  "comments",
  {
    id: uuid().defaultRandom().primaryKey(),
    textContent: varchar({ length: 450 }).notNull(),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.id),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    modifiedAt: timestamp("modified_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => {
    return {
      _: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      }).onDelete("cascade"),
    };
  }
);

export const commentsRelations = relations(commentsTable, ({ one }) => {
  return {
    post: one(postsTable, {
      fields: [commentsTable.postId],
      references: [postsTable.id],
    }),
    author: one(usersTable, {
      fields: [commentsTable.postId],
      references: [usersTable.id],
    }),
    parent: one(commentsTable, {
      fields: [commentsTable.parentId],
      references: [commentsTable.id],
    }),
  };
});

export const likesTable = pgTable("likes", {
  id: uuid().defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  modifiedAt: timestamp("modified_at").defaultNow().notNull(),
});

export const likesRelations = relations(likesTable, ({ one }) => {
  return {
    post: one(postsTable, {
      fields: [likesTable.postId],
      references: [postsTable.id],
    }),
    author: one(usersTable, {
      fields: [likesTable.postId],
      references: [usersTable.id],
    }),
  };
});
