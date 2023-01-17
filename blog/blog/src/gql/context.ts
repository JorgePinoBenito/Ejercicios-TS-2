import { User } from "../gql/types.ts";

type Context = {
    request: Request,
    user: User | undefined
}


export default Context;