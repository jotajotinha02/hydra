import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSaleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all sales
  app.get("/api/sales", async (req, res) => {
    try {
      const sales = await storage.getAllSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar vendas" });
    }
  });

  // Create new sale
  app.post("/api/sales", async (req, res) => {
    try {
      const validatedData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(validatedData);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Erro ao criar venda" });
      }
    }
  });

  // Delete sale
  app.delete("/api/sales/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSale(id);
      if (deleted) {
        res.json({ message: "Venda removida com sucesso" });
      } else {
        res.status(404).json({ message: "Venda não encontrada" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao remover venda" });
    }
  });

  // Get sales by user
  app.get("/api/sales/user/:usuario", async (req, res) => {
    try {
      const { usuario } = req.params;
      const sales = await storage.getSalesByUser(usuario);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar vendas do usuário" });
    }
  });

  // Get sales by date range
  app.get("/api/sales/date-range", async (req, res) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res.status(400).json({ message: "Datas de início e fim são obrigatórias" });
      }
      
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Formato de data inválido" });
      }
      
      const sales = await storage.getSalesByDateRange(startDate, endDate);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar vendas por data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
