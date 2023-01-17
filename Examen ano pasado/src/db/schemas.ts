import { Documento } from "../types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export type DocumentoSchema = Documento & { _id: ObjectId };
