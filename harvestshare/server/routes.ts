import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPropertySchema, insertApplicationSchema, insertDealSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(userData);
      res.json({ ...user, password: undefined }); // Don't send password back
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const { fruitType, location, radius, startDate, endDate } = req.query;
      
      if (Object.keys(req.query).length > 0) {
        const properties = await storage.searchProperties({
          fruitType: fruitType as string,
          location: location as string,
          radius: radius ? parseInt(radius as string) : undefined,
          startDate: startDate as string,
          endDate: endDate as string,
        });
        res.json(properties);
      } else {
        const properties = await storage.getAllProperties();
        res.json(properties);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get properties", error });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to get property", error });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const { ownerId } = req.body;

      if (!ownerId) {
        return res.status(400).json({ message: "Owner ID is required" });
      }

      const property = await storage.createProperty({ ...propertyData, ownerId });
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });

  app.get("/api/users/:id/properties", async (req, res) => {
    try {
      const properties = await storage.getPropertiesByOwner(req.params.id);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user properties", error });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const { harvesterId } = req.body;

      if (!harvesterId) {
        return res.status(400).json({ message: "Harvester ID is required" });
      }

      const application = await storage.createApplication({ ...applicationData, harvesterId });
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data", error });
    }
  });

  app.get("/api/properties/:id/applications", async (req, res) => {
    try {
      const applications = await storage.getApplicationsByProperty(req.params.id);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get applications", error });
    }
  });

  app.get("/api/users/:id/applications", async (req, res) => {
    try {
      const applications = await storage.getApplicationsByHarvester(req.params.id);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user applications", error });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const updates = req.body;
      const application = await storage.updateApplication(req.params.id, updates);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application", error });
    }
  });

  // Deal routes
  app.post("/api/deals", async (req, res) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      res.status(400).json({ message: "Invalid deal data", error });
    }
  });

  app.get("/api/users/:id/deals", async (req, res) => {
    try {
      const deals = await storage.getDealsByUser(req.params.id);
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user deals", error });
    }
  });

  app.patch("/api/deals/:id", async (req, res) => {
    try {
      const updates = req.body;
      const deal = await storage.updateDeal(req.params.id, updates);
      
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update deal", error });
    }
  });

  // Message routes
  app.get("/api/deals/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessagesByDeal(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages", error });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
