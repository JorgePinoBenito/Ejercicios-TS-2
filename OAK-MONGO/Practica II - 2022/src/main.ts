import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { getStatus, getCharacters, getCharacterId } from "./resolvers/get.ts";
import { deleteCharacter } from "./resolvers/delete.ts";
import { putSwitchStatus } from "./resolvers/put.ts";

const router = new Router();

router
  .get("/status", getStatus)
  .get("/characters", getCharacters)
  .get("/character/:id", getCharacterId)
  .put("/switchstatus/:id", putSwitchStatus)
  .delete("/character/:id", deleteCharacter);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
