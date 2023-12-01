import { db } from '../datastore';
import { Post } from '../types';
import crypto from 'crypto';
import { ExpressHandler } from '../types';
import {
  CreatePostRequest,
  CreatePostResponse,
  ListPostRequest,
  ListPostResponse,
  GetPostRequest,
  GetPostResponse,
  DeletePostRequest,
  DeletePostResponse,
} from '../api';

export const listPostHandler: ExpressHandler<ListPostRequest, ListPostResponse> = async (
  req,
  res
) => {
  // TODO: add pagination and filtering
  res.send({ posts: await db.listPost() });
};

export const createPostHandler: ExpressHandler<CreatePostRequest, CreatePostResponse> = async (
  req,
  res
) => {
  if (!req.body.title || !req.body.url) {
    return res.sendStatus(400);
  }
  // TODO: validate user exits
  // TODO: get userid from session
  // TODO: validate title and url are non-empty
  // TODO: validate url is new, otherwise add +1 to exiting post
  const post: Post = {
    id: crypto.randomUUID(),
    postedAt: Date.now(),
    title: req.body.title,
    url: req.body.url,
    userId: res.locals.userId,
  };
  await db.createPost(post);
  res.sendStatus(200);
};

export const deletePostHandler: ExpressHandler<DeletePostRequest, DeletePostResponse> = async (
  req,
  res
) => {
  const params: any = req.params;
  if (!params.postId) {
    return res.sendStatus(400);
  }
  await db.deletePost(params.postId);
  return res.sendStatus(200);
};

export const getPostHandler: ExpressHandler<GetPostRequest, GetPostResponse> = async (req, res) => {
  let params: any = req.params;
  if (!params.postId) {
    return res.sendStatus(400);
  }
  return res.send({ post: await db.getPost(params.postId) });
};
