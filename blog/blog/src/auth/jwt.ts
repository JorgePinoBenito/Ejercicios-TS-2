import { create, Header, verify } from "jwt";
import { newUser, User } from "../gql/types.ts";
import { UsersCollection } from "../db/connection.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

export type Payload = {
  id: string;
};

const encoder = new TextEncoder();

const generateKey = async (secretKey: string): Promise<CryptoKey> => {
  const keyBuf = encoder.encode(secretKey);
  return await crypto.subtle.importKey(
    "raw",
    keyBuf,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );
};

export const createJWT = async (
  payload: Payload,
  secretKey: string,
): Promise<string> => {
  const header: Header = {
    alg: "HS256",
  };

  const key = await generateKey(secretKey);

  return create(header, payload, key);
};

export const verifyJWT = async (
  token: string,
  secretKey: string,
): Promise<Payload> => {
  try {
    const key = await generateKey(secretKey);
    const v = await verify(token, key) as Payload;
    return v;
  } catch (error) {
    return error.message;
  }
};

export const extractBearerToken = (headers: Headers): string | undefined => {
  const auth = headers.get("Authorization");
  if (auth !== null && auth.startsWith("Bearer ")) {
    return auth.substring(7);
  }
  return undefined;
};

export const authorize = async (
  headers: Headers,
  secretKey: string,
): Promise<User | undefined> => {
  const token = extractBearerToken(headers);
  if (token === undefined || token === "") {
    return undefined;
  }
  const { id } = await verifyJWT(token, secretKey);
  const userDoc = await UsersCollection.findOne({ _id: new ObjectId(id) });
  if (userDoc === undefined) {
    return undefined;
  }

  return newUser(userDoc);
};
