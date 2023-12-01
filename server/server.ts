import express from 'express';
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  listPostHandler,
} from './handlers/postHandler';
import asyncHandler from 'express-async-handler';
import { initDB } from './datastore';
import { signInHandler, signUpHandler } from './handlers/authHandler';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { errHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/authMiddleware';
import { createLikeHandler, getLikeHandler } from './handlers/likeHandler';
import {
  createCommentHandler,
  deleteCommentHandler,
  listCommentHandler,
} from './handlers/commentHandler';

(async () => {
  await initDB();

  dotenv.config();

  const app = express();

  app.use(express.json());

  app.use(loggerMiddleware);

  // public endpoints
  app.get('/healthz', (req, res) => res.send({ status: 'OK' }));
  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));

  app.use(authMiddleware);

  // protected endpoints
  app.get('/v1/posts/list', asyncHandler(listPostHandler));
  app.post('/v1/posts/create', asyncHandler(createPostHandler));
  app.delete('/v1/posts/:postId', asyncHandler(deletePostHandler));
  app.get('/v1/posts/:postId', asyncHandler(getPostHandler));

  app.post('/v1/likes', asyncHandler(createLikeHandler));
  app.get('/v1/likes/:postId', asyncHandler(getLikeHandler));

  app.post('/v1/comments', asyncHandler(createCommentHandler));
  app.delete('/v1/comments', asyncHandler(deleteCommentHandler));
  app.get('/v1/comments/list', asyncHandler(listCommentHandler));

  app.use(errHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`running on port: ${port}`);
  });
})();
