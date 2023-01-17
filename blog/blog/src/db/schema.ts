import { ObjectId } from "mongo";

export type UserSchema = {
  _id: ObjectId;
  type: string;
  username: string;
  password: string;
};


export type CommentSchema = {
  _id: ObjectId;
  createdAt: Date;
  deletedAt?: Date;
  content: string;
  userID: ObjectId;
};

export type PostSchema = {
  _id: ObjectId;
  createdAt: Date;
  deletedAt?: Date;
  authorID: ObjectId;
  title: string;
  content: string;
  comments: CommentSchema[];
};

