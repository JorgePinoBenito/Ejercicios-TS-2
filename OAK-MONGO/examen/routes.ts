import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import {
  addQuote,
  getQuotes,
  getQuote,
  updateQuote,
  deleteQuote,
} from "./controllers.ts";

const router = new Router();

router
  .get("/api/quote", getQuotes) // Get all quotes
  .get("/api/quote/:id", getQuote) // Get one quote of quoteID: id
  .post("/api/quote", addQuote) // Add a quote
  .put("/api/quote/:id", updateQuote) // Update a quote
  .delete("/api/quote/:id", deleteQuote); // Delete a quote

export default router;
