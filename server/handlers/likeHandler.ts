import { CreateLikeRequest, CreateLikeResponse, GetLikeRequest, GetLikeResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Like } from '../types';

export const createLikeHandler: ExpressHandler<CreateLikeRequest, CreateLikeResponse> = async (
  req,
  res
) => {
  if (!req.body.postId) {
    return res.status(400).send({ error: 'No Post Id' });
  }

  if (!res.locals.userId) {
    return res.status(400).send({ error: 'No User Id' });
  }

  let found = await db.isDuplicateLike({
    postId: req.body.postId,
    userId: res.locals.userId,
  });
  if (found) {
    return res.status(400).send({ error: 'No more Likes for the same post' });
  }

  const likeForInsert: Like = {
    postId: req.body.postId,
    userId: res.locals.userId,
  };
  await db.createLike(likeForInsert);
  return res.sendStatus(201);
};

export const getLikeHandler: ExpressHandler<GetLikeRequest, GetLikeResponse> = async (req, res) => {
  let params: any = req.params;
  const count: number = await db.getLikes(params.postId);
  return res.send({ likes: count });
};
