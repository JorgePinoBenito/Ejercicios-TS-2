import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { CarSchema } from "../db/schemas.ts";
import { Car } from "../types.ts";
import { CarsCollection } from "../db/database.ts";

type PostCarsContext = RouterContext<
  "/addCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postCars = async (context: PostCarsContext) => {
  try {
    const body = context.request.body({ type: "json" });
    const value = await body.value;

    if (!value.plate || !value.seats) {
      context.response.status = 400;
      context.response.body = { message: "Please enter a plate and seats" };
      return;
    }

    const found = await CarsCollection.findOne({ plate: value.plate });
    if (found) {
      context.response.status = 400;
      context.response.body = { message: "Car already exists" };
      return;
    }

    await CarsCollection.insertOne({
      ...value,
      free: true,
    });
    context.response.body = {
      ...value,
      free: true,
    };
  } catch (e) {
    console.log(e);
    context.response.status = 500;
  }
};
