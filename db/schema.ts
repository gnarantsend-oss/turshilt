import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ── Хэрэглэгч ─────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id:        text("id").primaryKey(),                         // Auth.js session id
  name:      text("name"),
  email:     text("email").notNull().unique(),
  image:     text("image"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// ── Үзэх жагсаалт ─────────────────────────────────────────────────────────────
export const watchlist = sqliteTable(
  "watchlist",
  {
    userId:  text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    movieId: integer("movie_id").notNull(),
    addedAt: text("added_at").default(sql`(datetime('now'))`),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.movieId] }) })
);

// ── Үнэлгээ ───────────────────────────────────────────────────────────────────
export const ratings = sqliteTable(
  "ratings",
  {
    userId:  text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    movieId: integer("movie_id").notNull(),
    score:   real("score").notNull(),           // 1–5
    ratedAt: text("rated_at").default(sql`(datetime('now'))`),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.movieId] }) })
);

// ── Auth.js шаардлагатай хүснэгтүүд ──────────────────────────────────────────
export const accounts = sqliteTable(
  "accounts",
  {
    userId:            text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type:              text("type").notNull(),
    provider:          text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token:     text("refresh_token"),
    access_token:      text("access_token"),
    expires_at:        integer("expires_at"),
    token_type:        text("token_type"),
    scope:             text("scope"),
    id_token:          text("id_token"),
    session_state:     text("session_state"),
  },
  // Auth.js DrizzleAdapter шаарддаг composite primary key
  (t) => ({ pk: primaryKey({ columns: [t.provider, t.providerAccountId] }) })
);

export const sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId:       text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires:      text("expires").notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token:      text("token").notNull(),
    expires:    text("expires").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.identifier, t.token] }) })
);

// TypeScript төрлүүд
export type User              = typeof users.$inferSelect;
export type NewUser           = typeof users.$inferInsert;
export type WatchlistEntry    = typeof watchlist.$inferSelect;
export type Rating            = typeof ratings.$inferSelect;
