import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { DocumentoSchema } from "../db/schemas.ts";
import { Documento } from "../types.ts";
import { DocumentosCollection } from "../db/database.ts";

type PostDocumentContext = RouterContext<
  "/book",
  {
    day: number;
    month: number;
    year: number;
    seat: number;
    //token: number;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type PostFreeContext = RouterContext<
  "/FREE",
  {
    day: number;
    month: number;
    year: number;
    token: number;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postBook = async (ctx: PostDocumentContext) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const value = await body.value;

    if (!value.day || !value.month || !value.year || !value.seat) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Please enter a day, month, year, seat",
      };
      return;
    }
    if (
      value.day == null ||
      value.month == null ||
      value.year == null ||
      value.seat == null
    ) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Bad request" };
      return;
    } else if (
      value.day < 1 ||
      value.day > 31 ||
      value.month < 1 ||
      value.month > 12 ||
      value.year < 2021
    ) {
      ctx.response.status = 500;
      return;
    }

    const found = await DocumentosCollection.findOne({
      day: value.day,
      month: value.month,
      year: value.year,
      seat: 0,
    });
    //si el sitio esta disponible en esa fecha
    if (found) {
      //Generar el token de la reserva
      const token = Math.floor(Math.random() * 1000000000);
      await DocumentosCollection.insertOne({
        ...value,
        token: token,
      });
      ctx.response.status = 200;
      ctx.response.body = {
        /*Body: Un JSON con un campo “token” que se utilizará para gestionar la reserva realizada.
         */
        token: token,
      };
      return;
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "This seat is not available",
      };
    }
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};

export const postFree = async (ctx: PostFreeContext) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const value = await body.value;

    if (!value.day || !value.month || !value.year || !value.token) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Please enter a day, month, year, token",
      };
      return;
    }
    if (
      value.day == null ||
      value.month == null ||
      value.year == null ||
      value.token == null
    ) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Bad request" };
      return;
    } else if (
      value.day < 1 ||
      value.day > 31 ||
      value.month < 1 ||
      value.month > 12 ||
      value.year < 2021
    ) {
      ctx.response.status = 500;
      return;
    }

    const found = await DocumentosCollection.findOne({
      day: value.day,
      month: value.month,
      year: value.year,
      token: value.token,
    });
    if (found) {
      //Libera el seat

      await DocumentosCollection.updateOne(
        {
          day: value.day,
          month: value.month,
          year: value.year,
          token: value.token,
        },
        {
          $set: {
            day: value.day,
            month: value.month,
            year: value.year,
            token: value.token,
            seat: 0,
          },
        }
      );

      ctx.response.status = 200;
      ctx.response.body = {
        message: "Seat freed",
      };
      return;
    } else {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "This seat is not available",
      };
    }
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};
