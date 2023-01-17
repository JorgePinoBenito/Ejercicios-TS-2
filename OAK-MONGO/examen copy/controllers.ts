import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Book } from "./types.ts";

const URI =
  "mongodb+srv://jopibe:Murcielago1@nebrija.bvmsqgm.mongodb.net/?authMechanism=SCRAM-SHA-1";

// Mongo Connection Init
const client = new MongoClient();
try {
  await client.connect(URI);
  console.log("Database successfully connected");
} catch (err) {
  console.log(err);
}

const db = client.database("bookstore");
const quotes = db.collection<Book>("books");

// @description: GET all books
// @route GET /books
const getBooks = async ({ response }: { response: any }) => {
  try {
    const books = await quotes.find();
    response.body = books;
  } catch (err) {
    response.body = { msg: err };
  }
};

// @description: GET one book of bookID: id
// @route GET /books/id
const getBook = async ({
  params,
  response,
}: {
  params: {
    id: string;
  };
  response: any;
}) => {
  try {
    const book = await quotes.findOne({ _id: { $oid: params.id } });
    if (book) {
      response.status = 200;
      response.body = book;
    } else {
      response.status = 404;
      response.body = { msg: "Book not found" };
    }
  } catch (err) {
    response.body = { msg: err };
  }
};

// @description: ADD a book
// @route POST /books
const addBook = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const book: Book = body.value;
    const insertedBook = await quotes.insertOne(book);
    response.body = { msg: "OK", book: insertedBook };
  } catch (err) {
    response.body = { msg: err };
  }
};

// @description: DELETE a book by bookID: id
// @route DELETE /books/:id
const deleteBook = async ({
  params,
  response,
}: {
  params: {
    id: string;
  };
  response: any;
}) => {
  try {
    const count = await quotes.deleteOne({ _id: { $oid: params.id } });
    if (count) {
      response.body = { msg: "OK" };
    } else {
      response.status = 404;
      response.body = { msg: "Book not found" };
    }
  } catch (err) {
    response.body = { msg: err };
  }
};

export { getBooks, getBook, addBook, deleteBook };
