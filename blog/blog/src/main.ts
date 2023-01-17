import {Server} from "https://deno.land/std@0.171.0/http/mod.ts"
import {makeExecutableSchema} from "gql_tools";
import { typeDefs } from "./gql/schema.ts";
import {GraphQLHTTP} from "gql";
import Context from "./gql/context.ts";
import { authorize } from "./auth/jwt.ts";
import resolvers from "./gql/resolvers.ts";

const envPort = Deno.env.get("PORT")
let port;
if (envPort === undefined || envPort === "") {
  port = 8080
} else {
  port = Number(envPort)
}

const server = new Server({
  port: port,
   handler: async (request: Request): Promise<Response> => {
      const url = new URL(request.url)
      return url.pathname === "/graphql" 
        ?  await (GraphQLHTTP<Request, Context>({
          graphiql: true,
          schema: makeExecutableSchema({
            typeDefs: typeDefs,
            resolvers: resolvers,
          }),
          context: async (req: Request): Promise<Context> => {
            const secret = Deno.env.get("JWT_SECRET")
            if (secret === undefined || secret === "") {
              throw new Error("empty jwt secret");
            }
            const user = await authorize(req.headers, secret);

            return {
              request: req,
              user: user
            };
          },
        }))(request)
      : new Response("Not found", {status: 404})
   }
  })

server.listenAndServe()