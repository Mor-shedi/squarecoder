import crypto from 'crypto';

import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, User } from '../types';
import { signJWT } from '../auth';

// token will be the same for signup and signin
export const signInHandler: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.sendStatus(400);
  }

  const existing = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));
  if (!existing || existing.password !== hashPassword(password)) {
    return res.sendStatus(403);
  }

  const jwt = signJWT({ userId: existing.id });

  return res.status(200).send({
    user: {
      email: existing.email,
      firstName: existing.firstName,
      lastName: existing.lastName,
      username: existing.username,
      id: existing.id,
    },
    jwt,
  });
};

export const signUpHandler: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  if (!email || !firstName || !lastName || !username || !password) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const existing = (await db.getUserByEmail(email)) || (await db.getUserByUsername(username));
  if (existing) {
    return res.status(403).send({ error: 'User already exists' });
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    firstName,
    lastName,
    username,
    password: hashPassword(password),
  };
  await db.createUser(user);
  const jwt = signJWT({ userId: user.id });
  return res.status(200).send({
    jwt,
  });
};

function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(
      password,
      process.env.PASSWORD_SALT!,
      Number(process.env.HASH_NOTIME!),
      64,
      'sha512'
    )
    .toString('hex');
}
