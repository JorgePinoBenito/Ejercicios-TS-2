import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { characterCollection } from "../db/mongo.ts";

type PutCharacterContext = RouterContext<
  "/switchstatus/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

/* @route PUT /switchsattus/:id
Cambia el status de un personaje: de vivo a muerto o de muerto a vivo.

Devuelve un objeto con los datos del personaje con id (con el status actualizado)

Si lo realiza correctamente (el personaje existe)

Status: 200 Body: objecto con el personaje con el formato del siguiente ejemplo.

{
id: 1,
name: "Nombre der personaje",
staus: "Alive",

episode: [
	{ 
		name: "nombre episodio 1",
		episode: "S0E1"
	},
	{ 
		name: "nombre episodio 2",
		episode: "S0E2"
	}]
}
*/
export const putSwitchStatus = async (context: PutCharacterContext) => {
  if (context.params?.id) {
    const character = await characterCollection.findOne({
      _id: new ObjectId(context.params.id),
    });
    if (character) {
      const status = character.status === "Alive" ? "Dead" : "Alive";
      const count = await characterCollection.updateOne(
        { _id: new ObjectId(context.params.id) },
        { $set: { status } }
      );
      if (count) {
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
  }
};
