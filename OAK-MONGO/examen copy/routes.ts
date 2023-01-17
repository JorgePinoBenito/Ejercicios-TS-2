import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import {
  addBook,
  getBooks,
  getBook,
  //updateQuote,
  deleteBook,
} from "./controllers.ts";

const router = new Router();

router
  .get("/books", getBooks) // Get all books
  .get("/books/id", getBook) // Get one book of bookID: id
  .post("/books", addBook) // Add a book
  //.put("/api/quote/:id", updateQuote) // Update a quote
  .delete("/books/:id", deleteBook); // Delete a book by bookID: id

export default router;
