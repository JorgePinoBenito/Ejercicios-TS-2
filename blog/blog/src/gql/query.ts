import { PostsCollection, UsersCollection } from "../db/connection.ts";
import { Iterator, newPost, newUser, Post, User, UserType } from "./types.ts";
import { ObjectId } from "mongo";

type SearchUsersArgs = {
  query?: string;
  authors?: boolean;
  iter: Iterator;
};

const Query = {
  listLatestPosts: async (
    _: unknown,
    { iter }: { iter: Iterator },
  ): Promise<Post[]> => {
    const posts = await PostsCollection
      .find({ deletedAt: undefined })
      .sort({ createdAt: -1 })
      .skip(iter.page * iter.limit)
      .limit(iter.limit)
      .toArray();
    return posts.map((x) => newPost(x));
  },

  listUserPosts: async (
    _: unknown,
    { iter, userID }: { iter: Iterator; userID?: string },
  ) => {
    const posts = await PostsCollection
      .find({
        authorID: userID === undefined ? undefined : new ObjectId(userID),
      })
      .sort({ createdAt: -1 })
      .limit(iter.limit)
      .skip(iter.page * iter.limit)
      .toArray();
    return posts.map((post) => newPost(post));
  },

  searchUsers: async (
    _: unknown,
    { query, iter, authors }: SearchUsersArgs,
  ): Promise<User[]> => {
    const re = (() => {
      if (query === undefined || query === "") {
        return undefined;
      }
      const cleanQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      return new RegExp(`.*${cleanQuery}.*`);
    })();

    const author = (() => {
      if (authors === undefined) {
        return undefined;
      }
      if (authors) {
        return UserType.Author;
      }
      return UserType.Regular;
    })();

    const users = await UsersCollection
      .find({
        username: re,
        type: author,
      })
      .skip(iter.limit * iter.page)
      .limit(iter.limit);
    return users.map((x) => newUser(x));
  },

  searchPosts: async (
    _: unknown,
    { query, iter }: { query?: string; iter: Iterator },
  ) => {
    const re = (() => {
      if (query === undefined || query === "") {
        return undefined;
      }
      const cleanQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      return new RegExp(`.*${cleanQuery}.*`);
    })();
    const posts = await PostsCollection
      .find({
        $or: [{ content: re }, { title: re }],
      })
      .limit(iter.limit)
      .skip(iter.limit * iter.page);
    return posts.map((x) => newPost(x));
  },

  getUser: async (
    _: unknown,
    {id}: {id: string},
  ): Promise<User> => {
    const user = await UsersCollection.findOne({_id: new ObjectId(id)})
    if (user === undefined) {
      throw new Error("not found")
    }
    return newUser(user)
  },

  getPost: async (
    _: unknown,
    {id}: {id: string},
  ): Promise<Post> => {
    const post = await PostsCollection.findOne({_id: new ObjectId(id)})
    if (post === undefined) {
      throw new Error("not found")
    }
    return newPost(post)
  },

};

export default Query;
