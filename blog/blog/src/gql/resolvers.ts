import { UsersCollection } from "../db/connection.ts";
import  Mutation  from "./mutation.ts";
import Query from "./query.ts";
import { Comment, newUser, Post, User } from "./types.ts";

const resolvers = {
    Query: Query,
    Mutation: Mutation,
    Post: {
        author: async (post: Post): Promise<User> => {
            const user = await UsersCollection.findOne({_id: post.authorID})
            if (user === undefined) {
                throw new Error("not found")
            }
            return newUser(user)
        }
    },
    Comment: {
        user: async (comment: Comment): Promise<User> => {
            const user = await UsersCollection.findOne({_id: comment.userID})
            if (user === undefined) {
                throw new Error("not found")
            }
            return newUser(user);
        }
    }
}

export default resolvers;