import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import {
  Bson,
  MongoClient,
} from "https://deno.land/x/mongo@LATEST_VERSION/mod.ts";

const client = new MongoClient();

// Connect using srv url
await client.connect(
  "mongodb+srv://jopibe:<password>@nebrija.bvmsqgm.mongodb.net/?authMechanism=SCRAM-SHA-1"
);

console.log("hola");
