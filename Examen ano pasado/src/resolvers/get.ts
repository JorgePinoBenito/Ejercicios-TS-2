import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { DocumentosCollection } from "../db/database.ts";
import { DocumentoSchema } from "../db/schemas.ts";

type GetDocumentStatus = RouterContext<
  "/status",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetFreeSeatsContext = RouterContext<
  "/freeseats",
  {
    day: number;
    month: number;
    year: number;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getStatus = (ctx: GetDocumentStatus) => {
  try {
    //devuelve como body la fecha del dia en formato dd-mm-aaaa
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    ctx.response.body = { date: `${day}-${month}-${year}` };

    ctx.response.status = 200;
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};

export const getFreeSeats = async (ctx: GetFreeSeatsContext) => {
  try {
    const day = ctx.params?.day;
    const month = ctx.params?.month;
    const year = ctx.params?.year;
    /*const documents = await DocumentosCollection.find({
      day: day,
      month: month,
      year: year,
    }).toArray();*/
    if (day == null || month == null || year == null) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Bad request" };
      return;
    } else if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2021) {
      ctx.response.status = 500;
      return;
    } /*else if (!documents) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Document not found" };
      return;
    } */
    //const { year, month, day } = params;
    const documents = await DocumentosCollection.find({
      year: ctx.params.year,
      month: ctx.params.month,
      day: ctx.params.day,
      seat: 0,
    }).toArray();
    //else {
    if (documents.length > 0) {
      //obtener el numero de asientos libres
      let freeSeats = 0;
      for (let i = 0; i < documents.length; i++) {
        freeSeats += documents[i].seat;
      }
      ctx.response.body = { freeSeats: freeSeats };
      ctx.response.status = 200;
      /*const freeSeats = documents[0].seat;
        ctx.response.body = { freeSeats: freeSeats };
        ctx.response.status = 200;
      } */
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Document not found" };
    }
    //}
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};
