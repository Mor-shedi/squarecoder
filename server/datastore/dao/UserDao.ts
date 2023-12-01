// Dao : data access object :  provides data operations without exposing database details. | separate db implementation from in memory model

import { User } from '../../types';

export interface UserDao {
  createUser(user: User): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
}
