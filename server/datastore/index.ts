import { CommentDao } from './dao/CommentDao';
import { PostDao } from './dao/PostDao';
import { LikeDao } from './dao/LikeDao';
import { UserDao } from './dao/UserDao';
// import { InMemoryDatastore } from './memorydb';
import { SqlDataStore } from './sql';

export interface Datastore extends UserDao, PostDao, LikeDao, CommentDao {}

export let db: Datastore;

export async function initDB() {
  // db = new InMemoryDatastore();
  db = await new SqlDataStore().openDb();
}
