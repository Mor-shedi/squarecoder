import {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  GetCommentRequest,
  GetCommentResponse,
} from '../api';
import { db } from '../datastore';
import { Comment, ExpressHandler } from '../types';
import crypto from 'crypto';

export const createCommentHandler: ExpressHandler<
  CreateCommentRequest,
  CreateCommentResponse
> = async (req, res) => {
  if (!req.body.postId) return res.status(400).send({ error: 'No Post Id' });

  if (!res.locals.userId) return res.status(400).send({ error: 'No User Id' });

  if (!req.body.comment) return res.status(400).send({ error: 'No Comment' });

  const commentToInserion: Comment = {
    id: crypto.randomUUID(),
    postedAt: Date.now(),
    postId: req.body.postId,
    userId: res.locals.userId,
    comment: req.body.comment,
  };
  await db.createComment(commentToInserion);
  return res.sendStatus(200);
};

export const listCommentHandler: ExpressHandler<GetCommentRequest, GetCommentResponse> = async (
  req,
  res
) => {
  if (!req.body.postId) {
    return res.sendStatus(400);
  }
  let result = await db.listComments(req.body.postId);
  return res.send({ comments: result });
};

export const deleteCommentHandler: ExpressHandler<
  DeleteCommentRequest,
  DeleteCommentResponse
> = async (req, res) => {
  if (!req.body.commentId) {
    return res.status(400).send({ error: 'No comment id' });
  }
  await db.deleteComment(req.body.commentId);
  return res.sendStatus(200);
};
