import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { CarSchema } from "../db/schemas.ts";
import { Car } from "../types.ts";
import { CarsCollection } from "../db/database.ts";

type RemoveCarContext = RouterContext<
  "/removeCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeCar = async (context: RemoveCarContext) => {
  try {
    const plate = context.params?.id;
    const car = await CarsCollection.findOne({ plate: plate });
    if (!car) {
      context.response.status = 404;
      context.response.body = { message: "Car not found" };
      return;
    }
    if (!car.free) {
      context.response.status = 400;
      context.response.body = { message: "Car is not free" };
      return;
    } else {
      await CarsCollection.deleteOne({ plate: plate });
      context.response.body = { message: "Car removed" };
      context.response.status = 200;
    }
  } catch (e) {
    console.log(e);
    context.response.status = 500;
  }
};
