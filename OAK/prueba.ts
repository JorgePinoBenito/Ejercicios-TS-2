import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import {
  Application,
  Router,
  helpers,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

//let books: Book[] = [];

//obtener los libros de la siguiente url https://gutendex.com/
//y devolverlos en formato json
const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch("https://gutendex.com/books/");
  const data = await response.json();
  return data.results;
};
