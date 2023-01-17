import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { CarSchema } from "./schemas.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const connectMongoDB = async (): Promise<Database> => {
  const env = config();

  if (!env.MONGO_USR || !env.MONGO_PWD) {
    throw new Error("MONGO_USR and MONGO_PWD must be set in .env file");
  }

  env.MONGO_USR;
  env.MONGO_PWD;
  //const mongo_usr = "jopibe";
  //const mongo_pwd = "Murcielago1";
  const db_Name = "Cabify";
  const mongo_url = `mongodb+srv://${env.MONGO_USR}:${env.MONGO_PWD}@nebrija.bvmsqgm.mongodb.net/${db_Name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  try {
    await client.connect(mongo_url);
    console.log("Connected to database");
  } catch (e) {
    console.log("Error connecting to MongoDB: ", e);
  }

  const db = client.database(db_Name);
  return db;
};

const db = await connectMongoDB();

export const CarsCollection = db.collection<CarSchema>("Cars");
