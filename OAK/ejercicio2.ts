import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import * as qs from "https://deno.land/x/querystring@v1.0.2/mod.js";
import {
  Application,
  Router,
  helpers,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

type Book = {
  id: number;
  title: string;
  authors: Person[];
};

type Person = {
  birth_year: number | null;
  death_year: number | null;
  name: string;
};

type ListBooksResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
};

type author = {
  name: string;
  books: Book[];
};

type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

let books: Book[] = [];

//obtener los libros de la siguiente url https://gutendex.com/
//y devolverlos en formato json
/*const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch("https://gutendex.com/books/");
  const data = await response.json();
  return data.results;
};*/

//obtener con excepciones los libros de la siguiente url https://gutendex.com/
//y devolverlos en formato json
const fetchBooks = async (page: number = 1): Promise<Book[]> => {
  if (page <= 0) {
    throw new Error("Page must be greater than 0");
  }

  const base = "https://gutendex.com/books";

  const url = qs.stringifyUrl(
    {
      url: base,
      query: {
        page: page,
      },
    },
    { arrayFormat: "comma" }
  );

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status == 404) {
      return [];
    } else {
      throw new Error(
        `non-OK status ${response.status}: ${response.statusText}`
      );
    }
  }
  const data = await response.json();
  return data.results;
};

//crear un router
const router = new Router();

/* el router Debe tener los siguientes endpoints
GET - /books -> Devuelve un array de libros de la página 1 con los campos "id" y "titulo"*/
router.get("/books", async (ctx) => {
  const page = getQuery(ctx, { mergeParams: true }).page;
  const books = await fetchBooks(page);
  const booksInfo: Book[] = books.map((book) => {
    return {
      id: book.id,
      title: book.title,
    };
  });
  ctx.response.body = booksInfo;
});

/*GET - /books/:page -> Devuelve un array de libros de la página correspondiente con los campos "id" y "titulo"*/
router.get("/books/:page", async (ctx) => {
  const page = ctx.params.page;
  const books = await fetchBooks(page);
  const booksInfo: Book[] = books.map((book) => {
    return {
      id: book.id,
      title: book.title,
    };
  });
  ctx.response.body = booksInfo;
});

/*GET - /book/:id -> Devuelve un libro con los campos "id", "titulo", "autores" y "año de nacimiento"*/
router.get("/book/:id", async (ctx) => {
  const id = ctx.params.id;
  const books = await fetchBooks();
  const book = books.find((book) => book.id == id);
  if (book) {
    const authors = book.authors.map((author) => {
      return {
        name: author.name,
        birth_year: author.birth_year,
      };
    });
    const bookInfo: Book = {
      id: book.id,
      title: book.title,
      authors: authors,
    };
    ctx.response.body = bookInfo;
  } else {
    ctx.response.body = "Book not found";
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8888 });
