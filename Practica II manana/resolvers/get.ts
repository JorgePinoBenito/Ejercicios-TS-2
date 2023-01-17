import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { CarsCollection } from "../db/database.ts";
import { CarSchema } from "../db/schemas.ts";

type GetCarsStatus = RouterContext<
  "/status",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetCarContext = RouterContext<
  "/car/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetAskCarContext = RouterContext<
  "/askCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getStatus = async (ctx: GetCarsStatus) => {
  ctx.response.body = "Hola";
};

export const getCar = async (context: GetCarContext) => {
  try {
    const plate = context.params?.id;
    const car = await CarsCollection.findOne({ plate: plate });
    if (!car) {
      context.response.status = 404;
      context.response.body = { message: "Car not found" };
      return;
    }
    context.response.body = car;
    context.response.status = 200;
  } catch (e) {
    console.log(e);
    context.response.status = 500;
  }
};

export const getAskCar = async (context: GetAskCarContext) => {
  try {
    const cars = await CarsCollection.find({ free: true }).toArray();
    if (cars.length > 0) {
      context.response.body = cars[0].plate;
      await CarsCollection.updateOne(
        { plate: cars[0].plate },
        { $set: { free: false } }
      );
    } else {
      context.response.status = 404;
      context.response.body = { message: "No cars available" };
      return;
    }
  } catch (e) {
    console.log(e);
    context.response.status = 500;
  }
};
