import { gql } from "gql_tag";

export const typeDefs = gql`
    scalar Date

    enum UserType {
        Regular
        Author
    }

    type User {
        id: String!
        type: UserType!
        username: String!
    }

    type Comment {
        id: String!
        createdAt: Date!
        deletedAt: Date
        content: String!
        userID: String!
        user: User!
    }

    type Post {
        id: String!
        createdAt: Date!
        deletedAt: Date
        authorID: String!
        author: User!
        title: String!
        content: String!
        comments: [Comment!]!
    }

    input PostInput {
        title: String!
        content: String!
    }

    input Iterator {
        page: Int!
        limit: Int!
    }

    type Query {
        listLatestPosts(iter: Iterator!): [Post!]!
        listUserPosts(authorID: String, iter: Iterator!): [Post!]!
        searchPosts(query: String, iter: Iterator!): [Post!]!
        getPost(id: String!): Post!

        searchUsers(query: String, authors: Boolean, iter: Iterator!): [User!]!
        getUser(id: String!): User!
    }

    type Mutation {
        register(username: String!, password: String!, type: UserType!): User!
        login(username: String!, password: String!): String!

        createComment(postID: String!, content: String!): Post!
        editComment(postID: String!, commentID: String!, content: String!): Post!
        deleteComment(postID: String!, commentID: String!): Post!

        createPost(post: PostInput!): Post!
        editPost(postID: String!, post: PostInput!): Post!
        deletePost(postID: String!): Post!
    }
`;