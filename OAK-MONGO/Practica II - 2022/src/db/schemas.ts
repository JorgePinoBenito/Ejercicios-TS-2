import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Character } from "../types.ts";

export type CharacterSchema = Omit<Character, "id"> & { _id: ObjectId };
