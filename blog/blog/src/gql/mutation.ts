import { CommentSchema, PostSchema, UserSchema } from "../db/schema.ts";
import { newPost, newUser, Post, PostInput, User, UserType } from "./types.ts";
import * as bcrypt from "bcrypt";
import { createJWT } from "../auth/jwt.ts";
import Context from "./context.ts";
import { InsertDocument, ObjectId } from "mongo";
import { UsersCollection, PostsCollection } from "../db/connection.ts";

type RegisterArgs = {
  username: string;
  password: string;
  type: UserType;
};

const Mutation = {
  register: async (_: unknown, args: RegisterArgs): Promise<User> => {
    const dup = await UsersCollection.findOne({ username: args.username });
    if (dup !== undefined) {
      throw new Error("username is in use");
    }

    const passwordHash = await bcrypt.hash(args.password);
    const userInsertDoc: InsertDocument<UserSchema> = {
      username: args.username,
      password: passwordHash,
      type: args.type,
    };
    await UsersCollection.insertOne(userInsertDoc);
    return newUser(userInsertDoc as UserSchema);
  },

  login: async (
    _: unknown,
    args: { username: string; password: string }
  ): Promise<string> => {
    const user = await UsersCollection.findOne({ username: args.username });
    if (user === undefined) {
      throw new Error("user not found");
    }
    const pwIsCorrect = bcrypt.compare(args.password, user.password);
    if (!pwIsCorrect) {
      throw new Error("incorrect password");
    }

    return await createJWT(
      { id: user._id.toString() },
      Deno.env.get("JWT_SECRET")!
    );
  },

  createComment: async (
    _: unknown,
    args: { postID: string; content: string },
    ctx: Context
  ): Promise<Post> => {
    if (ctx.user === undefined) {
      throw new Error("unauthorized");
    }
    const post = await PostsCollection.findOne({
      _id: new ObjectId(args.postID),
    });
    if (post === undefined) {
      throw new Error("post not found");
    }
    const comment: CommentSchema = {
      _id: new ObjectId(),
      content: args.content,
      createdAt: new Date(),
      deletedAt: undefined,
      userID: ctx.user.id,
    };
    post.comments.push(comment);

    await PostsCollection.updateOne({ _id: post._id }, {
      $push: { comments: comment },
    } as any);

    return newPost(post);
  },

  editComment: async (
    _: unknown,
    args: { postID: string; commentID: string; content: string },
    ctx: Context
  ): Promise<Post> => {
    if (ctx.user === undefined) {
      throw new Error("unauthorized");
    }

    const result = await PostsCollection.findAndModify({
      query: { _id: new ObjectId(args.postID) },
      update: { $set: { "comments.$[elem].content": args.content } },
      arrayFilters: { "elem._id": new ObjectId(args.commentID) },
    });

    if (result === undefined) {
      throw new Error("not found");
    }
    return newPost(result);
  },

  deleteComment: async (
    _: unknown,
    args: { postID: string; commentID: string },
    ctx: Context
  ): Promise<Post> => {
    if (ctx.user === undefined) {
      throw new Error("not authorized");
    }

    let post = await PostsCollection.findAndModify(
      {
        _id: new ObjectId(args.postID),
        deletedAt: undefined,
        comments: {
          $elemMatch: {
            _id: new ObjectId(args.commentID),
            userID: ctx.user.id,
            deletedAt: null,
          },
        },
      },
      {
        update: { $set: { "comments.$[elem].deletedAt": new Date() } },
        arrayFilters: [{ "elem._id": new ObjectId(args.commentID) }],
        new: true,
      }
    );

    if (post !== undefined && post !== null) {
      return newPost(post);
    }

    post = await PostsCollection.findAndModify(
      {
        _id: new ObjectId(args.postID),
        authorID: ctx.user.id,
        deletedAt: undefined,
        comments: {
          $elemMatch: {
            _id: new ObjectId(args.commentID),
            deletedAt: null,
          },
        },
      },
      {
        update: { $set: { "comments.$[elem].deletedAt": new Date() } },
        arrayFilters: [{ "elem._id": new ObjectId(args.commentID) }],
        new: true,
      }
    );

    if (post !== undefined && post !== null) {
      return newPost(post);
    }

    throw new Error("not found");
  },

  createPost: async (
    _: unknown,
    args: { post: PostInput },
    ctx: Context
  ): Promise<Post> => {
    if (ctx.user === undefined || ctx.user.type === UserType.Regular) {
      throw new Error("unauthorized");
    }

    const postInsertDoc: InsertDocument<PostSchema> = {
      authorID: ctx.user.id,
      comments: [],
      content: args.post.content,
      title: args.post.title,
      createdAt: new Date(),
      deletedAt: undefined,
    };

    await PostsCollection.insertOne(postInsertDoc);
    return newPost(postInsertDoc as PostSchema);
  },

  editPost: async (
    _: unknown,
    args: { postID: string; post: PostInput },
    ctx: Context
  ): Promise<Post> => {
    if (ctx.user === undefined || ctx.user.type === UserType.Regular) {
      throw new Error("unauthorized");
    }

    const post = await PostsCollection.findAndModify(
      {
        _id: new ObjectId(args.postID),
        authorID: ctx.user.id,
        deletedAt: undefined,
      },
      {
        update: {
          $set: {
            title: args.post.title,
            content: args.post.content,
          },
        },
        new: true,
      }
    );

    if (post === undefined) {
      throw new Error("not found");
    }

    return newPost(post);
  },

  deletePost: async (
    _: unknown,
    args: { postID: string },
    ctx: Context
  ): Promise<Post> => {
    if (ctx.user === undefined || ctx.user.type === UserType.Regular) {
      throw new Error("unauthorized");
    }

    const post = await PostsCollection.findAndModify(
      {
        deletedAt: undefined,
        authorID: ctx.user!.id,
        _id: new ObjectId(args.postID),
      },
      {
        update: { $set: { deletedAt: new Date() } },
        new: true,
      }
    );

    if (post === undefined) {
      throw new Error("not found");
    }

    return newPost(post);
  },
};

export default Mutation;
