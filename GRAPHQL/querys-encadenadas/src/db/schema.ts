import { Car, Human } from "../types.ts";
import { ObjectId } from "mongo";

export type HumanSchema = Omit<Human, "id"> & {
  _id: ObjectId;
};

export type CarSchema = Omit<Car, "id"> & {
  _id: ObjectId;
};
