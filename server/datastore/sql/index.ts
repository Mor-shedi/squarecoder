import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '..';
import { Comment, Like, Post, User } from '../../types';

export class SqlDataStore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb() {
    // open the database
    this.db = await sqliteOpen({
      filename: path.join(__dirname, 'squarecode.sqlite'),
      driver: sqlite3.Database,
    });

    this.db.run('PRAGMA foreign_keys = ON;'); // force the foreign keys in sqlite

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
    });

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      'INSERT INTO users (id, email, password, firstName, lastName, userName) VALUES (?,?,?,?,?,?)',
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.username
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.get<User>(`SELECT * FROM users WHERE id = ?`, id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.db.get<User>(`SELECT * FROM users WHERE email = ?`, email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.db.get<User>(`SELECT * FROM users WHERE username = ?`, username);
  }

  async listPost(): Promise<Post[]> {
    return await this.db.all<Post[]>('SELECT * FROM posts');
  }

  async getLikes(postId: string): Promise<number> {
    let result = await this.db.get<{ count: number }>(
      'SELECT COUNT(*) as count from likes WHERE postId = ?',
      postId
    );
    return result?.count ?? 0;
  }

  async isDuplicateLike(like: Like): Promise<boolean> {
    let awaitResult = await this.db.get<number>(
      'SELECT 1 FROM likes WHERE postId = ? and userId = ?',
      like.postId,
      like.userId
    );
    let val: boolean = awaitResult === undefined ? false : true;
    return val;
  }

  async createPost(post: Post): Promise<void> {
    await this.db.run(
      'INSERT INTO posts (id, title, url, userId, postedAt) VALUES (?,?,?,?,?)',
      post.id,
      post.title,
      post.url,
      post.userId,
      post.postedAt
    );
  }

  async getPost(id: string, userId: string): Promise<Post | undefined> {
    return await this.db.get<Post>(
      `SELECT *, EXISTS(
        SELECT 1 FROM likes WHERE likes.postId = ? AND likes.userId = ?
      ) as liked FROM posts WHERE id = ?`,
      id,
      userId,
      id
    );
  }
  async deletePost(id: string): Promise<void> {
    await this.db.run('Delete FROM posts WHERE id = ?', id);
  }

  async createLike(like: Like): Promise<void> {
    await this.db.run('INSERT INTO likes(userId, postId) VALUES(?,?)', like.userId, like.postId);
  }

  async createComment(comment: Comment): Promise<void> {
    await this.db.run(
      'INSERT INTO comments (id, postId, postedAt, userId, comment) VALUES (?,?,?,?,?)',
      comment.id,
      comment.postId,
      comment.postedAt,
      comment.userId,
      comment.comment
    );
  }

  async listComments(postId: string): Promise<Comment[]> {
    return await this.db.all<Comment[]>('SELECT * FROM comments WHERE postId = ?', postId);
  }

  async deleteComment(id: string): Promise<void> {
    await this.db.run('DELETE FROM comments WHERE id = ?', id);
  }
}
