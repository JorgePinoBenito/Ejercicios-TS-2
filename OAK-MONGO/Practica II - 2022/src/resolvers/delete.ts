import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { characterCollection } from "../db/mongo.ts";
type DeleteCharacterContext = RouterContext<
  "/character/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

// @route DELETE /characters/:id
export const deleteCharacter = async (context: DeleteCharacterContext) => {
  if (context.params?.id) {
    const count = await characterCollection.deleteOne({
      _id: new ObjectId(context.params.id),
    });
    if (count) {
      context.response.body = "OK";
      context.response.status = 200;
    } else {
      context.response.body = "Not Found";
      context.response.status = 404;
    }
  }
};
