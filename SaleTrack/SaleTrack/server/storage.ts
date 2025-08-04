import { users, sales, type User, type InsertUser, type Sale, type InsertSale } from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllSales(): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  deleteSale(id: string): Promise<boolean>;
  getSalesByUser(usuario: string): Promise<Sale[]>;
  getSalesByDateRange(start: Date, end: Date): Promise<Sale[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  async getAllSales(): Promise<Sale[]> {
    const salesData = await db.select().from(sales).orderBy(sql`${sales.data} DESC`);
    return salesData;
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const [sale] = await db
      .insert(sales)
      .values({
        ...insertSale,
        valor: insertSale.valor.toString()
      })
      .returning();
    return sale;
  }

  async deleteSale(id: string): Promise<boolean> {
    const result = await db
      .delete(sales)
      .where(eq(sales.id, id));
    return result.rowCount > 0;
  }

  async getSalesByUser(usuario: string): Promise<Sale[]> {
    const salesData = await db
      .select()
      .from(sales)
      .where(eq(sales.usuario, usuario))
      .orderBy(sql`${sales.data} DESC`);
    return salesData;
  }

  async getSalesByDateRange(start: Date, end: Date): Promise<Sale[]> {
    const salesData = await db
      .select()
      .from(sales)
      .where(and(
        gte(sales.data, start),
        lte(sales.data, end)
      ))
      .orderBy(sql`${sales.data} DESC`);
    return salesData;
  }
}

export const storage = new DatabaseStorage();
