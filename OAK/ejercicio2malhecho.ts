import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
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
const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch("https://gutendex.com/books/");
  const data = await response.json();
  return data.results;
};

//crear un router
const router = new Router();

/* el router Debe tener los siguientes endpoints
GET - /books -> Devuelve un array de libros de la página 1 con los campos "id" y "titulo"*/
router.get("/books", async (context) => {
  const books = await fetchBooks();
  const booksInfo: Book[] = books.map((book) => {
    return { id: book.id, title: book.title };
  });
  context.response.body = booksInfo;
});

/*GET - /books/:page -> Devuelve un array de libros de la página correspondiente con los campos "id" y "titulo"*/
router.get("/books/:page", async (context) => {
  const page = context.params.page;
  const books = await fetchBooks();
  const booksInfo: Book[] = books.map((book) => {
    return { id: book.id, title: book.title };
  });
  const booksPerPage = 20;
  const start = (page - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksPage = booksInfo.slice(start, end);
  context.response.body = booksPage;
});
/*fetchBookById */
const fetchBookById = async (id: number): Promise<Book> => {
  const response = await fetch(`https://gutendex.com/books/${id}`);
  const data = await response.json();
  return data;
};

/*GET - /book/:id -> Devuelve un libro con los campos "id", "titulo", "autores" y "año de nacimiento"*/
router.get("/book/:id", async (context) => {
  const id = context.params.id;
  const book = await fetchBookById(id);
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
  context.response.body = bookInfo;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8888 });
