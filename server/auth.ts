import { JWTObject } from './types';
import jwt from 'jsonwebtoken';

export function signJWT(ob: JWTObject): string {
  return jwt.sign(ob, getSecret(), { expiresIn: '1d' });
}

export function verifyJWT(token: string): JWTObject {
  return jwt.verify(token, getSecret()) as JWTObject;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('Missing jwt secret');
    process.exit(1);
  }
  return secret;
}
