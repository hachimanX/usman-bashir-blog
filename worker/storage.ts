import { users, posts } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import type { User, InsertUser, Post, InsertPost, UpdatePost } from "@shared/schema";
import type { Database } from "./db";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPosts(publishedOnly?: boolean): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: UpdatePost): Promise<Post | undefined>;
  deletePost(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor(private readonly db: Database) {}

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPosts(publishedOnly = false): Promise<Post[]> {
    if (publishedOnly) {
      return this.db.select().from(posts)
        .where(eq(posts.status, "published"))
        .orderBy(desc(posts.publishedAt));
    }
    return this.db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await this.db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await this.db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePost(id: string, updateData: UpdatePost): Promise<Post | undefined> {
    const [post] = await this.db
      .update(posts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: string): Promise<void> {
    await this.db.delete(posts).where(eq(posts.id, id));
  }
}

export function createStorage(db: Database): IStorage {
  return new DatabaseStorage(db);
}
