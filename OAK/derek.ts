import {Application, Router} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as qs from "https://deno.land/x/querystring@v1.0.2/mod.js";

type Book = {
    id: number;
    title: string;
    authors: Person[];
    subjects: string[];
    translators: Person[];
    bookshelves: string[];
    languages: string[];
    copyright: boolean | null;
    media_type: string;
    formats: any;
    download_count: number;
}

type Person = {
    birth_year: number | null;
    death_year: number | null;
    name: string;
}

type ListBooksResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Book[];
};

// Forma simplificada de validar un entero. Lanza errores, ew.
function NumberInt(str: string): number {
    // Hay que chequear si str está vacío porque Number("") devuelve 0.
    if (str === "") {
        throw new Error("empty string")
    }

    const n = Number(str)

    if (isNaN(n)) {
        throw new Error("string is not a number")
    }

    if (!Number.isInteger(n)) {
        throw new Error("number is not an integer")
    }

    return n
}

async function fetchBookByID(id: number): Promise<Book | null> {
    const base = "https://gutendex.com/books"
    const url = qs.stringifyUrl(
        {
            url: base,
            query: {ids: id}
        },
        {arrayFormat: "comma"},
    )
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `non-OK status ${response.status}: ${response.statusText}`,
        )
    }
    const data: ListBooksResponse = await response.json()


    if (data.count > 1) {
        // Nunca debería ocurrir.
        throw new Error("how is this id returning more than 1 element")
    }

    if (data.count < 1) {
        return null
    }

    return data.results[0]
}

// Obtener los libros de la url https://gutendex.com/ y devolverlos en formato
// json de acuerdo al número de página.
async function fetchBooks(page = 1): Promise<Book[]> {
    if (page <= 0) {
        throw new Error("page must be greater than 0")
    }

    const base = "https://gutendex.com/books";

    const url = qs.stringifyUrl(
        {
            url: base,
            query: {page: page},
        },
        {arrayFormat: "comma"},
    )

    const response = await fetch(url);
    if (!response.ok) {
        if (response.status == 404) {
            return []
        } else {
            throw new Error(
                `non-OK status ${response.status}: ${response.statusText}`,
            )
        }
    }
    const data = await response.json();
    return data.results;
}

// GET - /books -> Devuelve un array de libros de la página 1 con los campos
// "id" y "título"
async function getBooksHandler(context: any) {
    const books = await fetchBooks();
    // Técnicamente, se puede evitar hacer la copia con "map" pero se vería feo.
    context.response.body = books.map((book: Book) => {
        return {
            id: book.id,
            title: book.title,
        }
    })
}

// GET - /books/:page -> Devuelve un array de libros de la página
// correspondiente con los campos "id" y "título".
async function getBooksPageHandler(context: any) {
    let page;
    try {
        page = NumberInt(context.params.page);
    } catch (e) {
        context.response.status = 400;
        context.response.body = "page uri param error: " + e.message;
        return
    }

    if (page < 1) {
        context.response.status = 400;
        context.response.body = "page uri param error: page must be greater than 0";
        return
    }

    const books = await fetchBooks(page);
    context.response.body = books.map((book: Book) => {
        return {
            id: book.id,
            title: book.title,
        }
    })
}

// GET - /book/:id -> Devuelve los detalles un libro de id determinado ->
// devuelve "id", "título", array de "autores" con todos sus datos.
async function getBookByIDHandler(context: any) {
    let id;
    try {
        id = NumberInt(context.params.id);
    } catch (e) {
        context.response.status = 400
        context.response.body = "id uri param error: " + e.message
        return
    }

    const elem = await fetchBookByID(id)
    if (elem === null) {
        context.response.status = 404
        return
    }

    context.response.body = {
        id: elem.id,
        title: elem.title,
        authors: elem.authors,
    }
}

// Todos los errores son excepciones porque no sé cómo les han enseñado a
// manejarlos.
//
// El error que tenías era porque el endpoint para :id es "book" mientras que el
// endpoint para :page es "books". Esa era la causa del error, por esa razón te
// decía que me parecía muy raro que un api estuviera hecho de esa manera.
//
// Está hecho superbásico. Si quieres agregarle un poco de "profesionalismo" le
// puedes agregar algunos middlewares de logging, timestamps, timeouts,
// rate-limiting, etc.
async function main() {
    const router = new Router();

    // Handlers.
    router.get("/books", getBooksHandler);
    router.get("/books/:page", getBooksPageHandler);
    router.get("/book/:id", getBookByIDHandler);

    const app = new Application();
    app.use(router.routes());
    app.use(router.allowedMethods());

    await app.listen({port: 8888});
}

await main()