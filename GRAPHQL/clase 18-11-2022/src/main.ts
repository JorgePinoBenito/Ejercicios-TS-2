import { ApolloServer } from "apollo";
import { startStandaloneServer } from "server";
import { graphql } from "graphql";

export const typeDefs = `
type Car{
    brand : String!
    plate : String!
    seats : Int
}
type Query{
    test : String!
    getCar : [Car!]!
}
type Mutation{
    addCar(brand : String!, plate : String!, seats : Int) : Car!
    deleteCar(plate : String!) : Car[]!
    deleteAllCars(plate: String, brand: String, seats: Int ) : Car[]!
`;

type Car = {
  brand: string;
  plate: string;
  seats?: number;
};

const cars: Car[] = [
  {
    brand: "BMW",
    plate: "ABC123",
    seats: 5,
  },
  {
    brand: "Audi",
    plate: "DEF456",
  },
];

const resolvers = {
  Query: {
    test: () => "working",
    getCars: () => {
      console.log("here");
      return cars;
    },
    getCar: (_: unknown, args: { plate: string }) => {
      return cars.filter((car) => car.plate === args.plate);
    },
  },
  Mutation: {
    addCar: (
      _: unknown,
      args: { plate: string; brand: string; seats?: number }
    ): Car => {
      const car = cars.find((car) => car.plate === args.plate);
      if (car) throw new Error("Car already exists");
      const { brand, plate, seats } = args;
      cars.push({ brand, plate, seats });
      return { brand, plate, seats };
    },
    deleteCar: (_: unknown, args: { plate: string }): Car[] => {
      const car = cars.find((car) => car.plate === args.plate);
      if (!car) throw new Error("Car does not exist");
      cars.splice(cars.indexOf(car), 1);
      return cars;
    },
    deleteAllCars: (
      _: unknown,
      args: { plate?: string; brand?: string; seats?: number }
    ): Car[] => {
      //borrar coches de la misma marca
      if (args.brand) {
        cars.forEach((car) => {
          if (car.brand === args.brand) {
            cars.splice(cars.indexOf(car), 1);
          }
        }, this);
      }
      //borrar coches con el mismo numero de asientos
      if (args.seats) {
        cars.forEach((car) => {
          if (car.seats === args.seats) {
            cars.splice(cars.indexOf(car), 1);
          }
        }, this);
      }
      //borrar coches con la misma matricula
      if (args.plate) {
        cars.forEach((car) => {
          if (car.plate === args.plate) {
            cars.splice(cars.indexOf(car), 1);
          }
        }, this);
      }
      //borrar coches con la misma marca y asientos
      if (args.brand && args.seats) {
        cars.forEach((car) => {
          if (car.brand === args.brand && car.seats === args.seats) {
            cars.splice(cars.indexOf(car), 1);
          }
        }, this);
      }
      return cars;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 7777 },
});
