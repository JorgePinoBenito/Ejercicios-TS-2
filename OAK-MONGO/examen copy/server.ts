import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import router from "./routes.ts";
const PORT = 4000;

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on ${PORT}`);

await app.listen({ port: PORT });
