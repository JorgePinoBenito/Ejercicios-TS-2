import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { CharacterSchema } from "./schemas.ts";

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = "jopibe";
  const mongo_pwd = "Murcielago1";
  const db_name = "Rick&Morty";
  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@nebrija.bvmsqgm.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  try {
    await client.connect(mongo_url);
    console.log("Database successfully connected");
  } catch (err) {
    console.log(err);
  }
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();

export const characterCollection = db.collection<CharacterSchema>("characters");
