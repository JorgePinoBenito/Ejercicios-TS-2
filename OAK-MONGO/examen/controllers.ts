import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Quote } from "./types.ts";

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

const db = client.database("quotesApp");
const quotes = db.collection<Quote>("quotes");

// @description: GET all Quotes
// @route GET /api/quotes
const getQuotes = async ({ response }: { response: any }) => {
  try {
    const allQuotes = await quotes.find({}).toArray();
    console.log(allQuotes);
    if (allQuotes) {
      response.status = 200;
      response.body = {
        success: true,
        data: allQuotes,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// @description: GET single quote by ID
// @route GET /api/quotes/:id
const getQuote = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  try {
    const quote = await quotes.findOne({ _id: params.id });
    if (quote) {
      response.status = 200;
      response.body = {
        success: true,
        data: quote,
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: "No quote found",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// @description: ADD single quote
// @route POST /api/quotes
const addQuote = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await request.body({ type: "json" });
      const quote = await body.value;
      await quotes.insertOne(quote);
      response.status = 201;
      response.body = {
        success: true,
        data: quote,
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// @description: UPDATE single quote
// @route PUT /api/quotes/:id
const updateQuote = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body();
    const inputQuote = await body.value;
    await quotes.updateOne(
      { _id: params.id },
      { $set: { quote: inputQuote.quote } }
    );
    response.status = 200;
    response.body = {
      success: true,
      data: inputQuote,
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// @description: DELETE single quote
// @route DELETE /api/quotes/:id
const deleteQuote = async ({
  params,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    await quotes.deleteOne({ _id: params.id });
    response.status = 200;
    response.body = {
      success: true,
      msg: "Quote deleted",
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export { getQuotes, getQuote, addQuote, updateQuote, deleteQuote };
