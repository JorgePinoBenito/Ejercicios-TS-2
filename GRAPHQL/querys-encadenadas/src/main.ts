import { Server } from "std/http/server.ts";
import { gql } from "graphql_tag";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

type HumanSchema = {
  name: string;
  id: string;
};

type CarSchema = {
  plate: string;
  driver: string;
};

type Human = {
  name: string;
  id: string;
  car: Car;
};

type Car = {
  plate: string;
  driver: Human;
};

const CarsCollection: Array<CarSchema> = [
  {
    plate: "ABC123",
    driver: "1",
  },
  {
    plate: "DEF456",
    driver: "2",
  },
];

const HumansCollection: Array<HumanSchema> = [
  {
    name: "John",
    id: "1",
  },
  {
    name: "Jane",
    id: "2",
  },
];

const typeDefs = gql`
  type Car {
    plate: String!
    driver: Human!
  }
  type Human {
    id: String!
    car: Car
    name: String!
  }
  type Query {
    getCar(plate: String!): Car!
    getHuman(id: String!): Human!
  }
`;

const resolvers = {
  Car: {
    driver: (parent: CarSchema): HumanSchema | undefined => {
      return HumansCollection.find((human) => human.id === parent.driver);
    },
  },
  Human: {
    car: (parent: HumanSchema): CarSchema | undefined => {
      return CarsCollection.find((car) => car.driver === parent.id);
    },
  },
  Query: {
    getCar: (_: unknown, args: { plate: string }): CarSchema | undefined => {
      return CarsCollection.find((car) => car.plate === args.plate);
    },
    getHuman: (_: unknown, args: { id: string }): HumanSchema | undefined => {
      return HumansCollection.find((human) => human.id === args.id);
    },
  },
};

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);
