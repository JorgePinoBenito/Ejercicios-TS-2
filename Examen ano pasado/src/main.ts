import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { getStatus, getFreeSeats } from "./resolvers/get.ts";
import { postBook, postFree } from "./resolvers/post.ts";

const router = new Router();

router
  .get("/status", getStatus)
  .get("/freeseats", getFreeSeats)
  .post("/book", postBook)
  .post("/FREE", postFree);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
