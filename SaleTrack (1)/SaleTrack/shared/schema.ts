import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usuario: text("usuario").notNull(),
  quantidade: integer("quantidade").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  data: timestamp("data").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  data: true,
}).extend({
  usuario: z.string().min(1, "Usuário é obrigatório"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  valor: z.number().min(0.01, "Valor deve ser maior que 0"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;
