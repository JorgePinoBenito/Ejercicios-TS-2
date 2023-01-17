import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

const getCharactersPage = async (page: number) => {
    const data = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const json = await data.json();
    return json;
}

const router = new Router();
router
    .get("/characters/:page", async (ctx) => {
        let page = Number(ctx.params?.page);
        if(page > 42){
            ctx.response.body = "Page error";
            ctx.response.status = 404;
            return;
        }
        if(page < 1) page =1;
        ctx.response.body = await getCharactersPage(page);
        ctx.response.status = 200;
    })
    .get("/characters", async (ctx) => {
        ctx.response.body = await getCharactersPage(1);
    })
    .get("/hora", (ctx) => {
        ctx.response.body = new Date().getUTCHours.toString();
    })
    .get("/dia/:id", (ctx) => {
        if(Number(ctx?.params?.id) > 7){
            ctx.response.body = "Invalid day";
            ctx.response.status = 500;
        }else{
        ctx.response.body = { 
            dia: days[Number(ctx?.params?.id) - 1], 
            n: Number(ctx?.params?.id) };
        }
    })

    app.use(router.routes());