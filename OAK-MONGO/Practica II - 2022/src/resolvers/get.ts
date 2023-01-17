import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { characterCollection } from "../db/mongo.ts";
import { CharacterSchema } from "../db/schemas.ts";

type GetStatusContext = RouterContext<
  "/status",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetCharacterContext = RouterContext<
  "/characters",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetCharacterIdContext = RouterContext<
  "/character/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

// @route GET /status
export const getStatus = async (context: GetStatusContext) => {
  context.response.body = "OKProgramacion-I";
  context.response.status = 200;
};

// @route GET /characters
export const getCharacters = async (context: GetCharacterContext) => {
  const params = getQuery(context, { mergeParams: true });
  if (params?.sort === "desc") {
    const characters = await characterCollection
      .find({})
      .sort({ name: -1 })
      .toArray();
    context.response.body = characters.map((character) => ({
      id: character._id.toString(),
      name: character.name,
      status: character.status,
      species: character.species,
      episode: character.episode,
    }));
    return;
  } else if (params?.sort === "asc") {
    const characters = await characterCollection

      .find({})
      .sort({ name: 1 })
      .toArray();
    context.response.body = characters.map((character) => ({
      id: character._id.toString(),
      name: character.name,
      status: character.status,
      species: character.species,
      episode: character.episode,
    }));
  }

  const characters = await characterCollection.find({}).toArray();
  context.response.body = characters.map((character) => ({
    id: character._id.toString(),
    name: character.name,
    status: character.status,
    species: character.species,
    episode: character.episode,
  }));
};

// @route GET /characters/:id Devuelve un objeto con los datos del personaje con id
export const getCharacterId = async (context: GetCharacterIdContext) => {
  if (context.params?.id) {
    const character = await characterCollection.findOne({
      _id: new ObjectId(context.params.id),
    });
    if (character) {
      context.response.body = {
        id: character._id.toString(),
        name: character.name,
        status: character.status,
        episode: character.episode,
      };
      context.response.status = 200;
    } else {
      context.response.body = "Not Found";
      context.response.status = 404;
    }
  }
};
