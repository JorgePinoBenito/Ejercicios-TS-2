import { CarsCollection, HumansCollection } from "../db/dbconnection.ts";
import { ObjectId } from "mongo";
import { Car } from "../types.ts";
import { CarSchema, HumanSchema } from "../db/schema.ts";

export const Query = {
  Car: {
    driver: (parent: CarSchema): HumanSchema | undefined => {
      return HumansCollection.findOne({ _id: new ObjectId(parent.driver) });
    },
  },
  Human: {
    car: (parent: HumanSchema): CarSchema | undefined => {
      return CarsCollection.findOne({ _id: new ObjectId(parent.car) });
    },
  },
  getCar: async (
    _: unknown,
    args: { plate: string }
  ): Promise<CarSchema | undefined> => {
    try {
      const car = await CarsCollection.findOne({ plate: args.plate });
      return car;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  getHuman: async (
    _: unknown,
    args: { id: string }
  ): Promise<HumanSchema | undefined> => {
    try {
      const human = await HumansCollection.findOne({
        _id: new ObjectId(args.id),
      });
      return human;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
