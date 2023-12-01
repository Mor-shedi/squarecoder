import { Post, User, Like, Comment } from './types';

// Post APIs
export interface ListPostRequest {}
export interface ListPostResponse {
  posts: Post[];
}
export type CreatePostRequest = Pick<Post, 'title' | 'url'>;
export interface CreatePostResponse {}

export type GetPostRequest = { postId: string };
export interface GetPostResponse {
  post: Post;
}

export type DeletePostRequest = { postId: string };
export type DeletePostResponse = {};

// Comment APIs
export type CreateCommentRequest = Pick<Comment, 'postId' | 'comment'>;
export interface CreateCommentResponse {}

export type GetCommentRequest = { postId: string };
export interface GetCommentResponse {
  comments: Comment[];
}

export type DeleteCommentRequest = { commentId: string };
export type DeleteCommentResponse = {};

// Like APIs
export type CreateLikeRequest = Like;
export interface CreateLikeResponse {}

export type GetLikeRequest = { postId: string };
export interface GetLikeResponse {
  likes: Number;
}

// User APIs
export type SignUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'password' | 'username'
>;
export interface SignUpResponse {
  jwt: string;
}

export interface SignInRequest {
  login: string;
  password: string;
}
export type SignInResponse = {
  user: Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
  jwt: string;
};
