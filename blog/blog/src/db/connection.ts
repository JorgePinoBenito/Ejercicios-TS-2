import { MongoClient } from "mongo";
import { config } from "dotenv";
import { UserSchema, PostSchema } from "./schema.ts";

await config({ export: true, allowEmptyValues: true });

const client = new MongoClient();

const connectionString = Deno.env.get("MONGO_URI")
if (connectionString === undefined || connectionString === "") {
  throw new Error("No database connection string")
}

const db = await client.connect(connectionString);


export const UsersCollection = db.collection<UserSchema>("users");
export const PostsCollection = db.collection<PostSchema>("posts");