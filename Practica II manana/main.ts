import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { getStatus, getCar, getAskCar } from "./resolvers/get.ts";
import { postCars } from "./resolvers/post.ts";
import { removeCar } from "./resolvers/delete.ts";
import { releaseCar } from "./resolvers/put.ts";

const router = new Router();

router
  .get("/car/:id", getCar)
  .get("/askCar", getAskCar)
  .post("/addCar", postCars)
  .delete("/removeCar/:id", removeCar)
  .put("/releaseCar/:id", releaseCar)
  .get("/status", getStatus);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
