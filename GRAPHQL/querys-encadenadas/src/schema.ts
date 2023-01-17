import { gql } from "graphql_tag";

export const typeDefs = gql`
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
