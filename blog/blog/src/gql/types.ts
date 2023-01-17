import { ObjectId } from "mongo";
import { CommentSchema, PostSchema, UserSchema } from "../db/schema.ts";

export enum UserType {
  Author = "Author",
  Regular = "Regular",
}

export function ParseUserType(value: string): UserType {
  switch (value) {
    case "Author":
      return UserType.Author;
    case "Regular":
      return UserType.Regular;
    default:
      throw new Error("invalid UserType value");
  }
}

export type User = {
  id: ObjectId;
  type: UserType;
  username: string;
};

export const newUser = (document: UserSchema): User => {
    return {
        id: document._id,
        type: document.type as UserType,
        username: document.username
    }
}

export type Comment = {
  id: ObjectId;
  createdAt: Date;
  deletedAt?: Date;
  content: string;
  userID: ObjectId;
  user?: User;
};

export const newComment = (doc: CommentSchema): Comment => {
  return {
    id: doc._id,
    content: doc.content,
    createdAt: doc.createdAt,
    deletedAt: doc.deletedAt,
    userID: doc.userID,
  }
}

export type Post = {
  id: ObjectId;
  createdAt: Date;
  deletedAt?: Date;
  authorID: ObjectId;
  author?: User;
  title: string;
  content: string;
  comments: Comment[];
};

export const newPost = (doc: PostSchema): Post => {
  return {
    id: doc._id,
    createdAt: doc.createdAt,
    deletedAt: doc.deletedAt,
    authorID: doc.authorID,
    content: doc.content,
    title: doc.title,
    comments: doc.comments.map(x => newComment(x))
  }
}

export type PostInput = {
  title: string;
  content: string;
};

export type Iterator = {
    page: number;
    limit: number;
}
