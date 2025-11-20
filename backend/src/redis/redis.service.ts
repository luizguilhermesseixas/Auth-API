import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setRefreshToken(
    userId: string,
    sessionId: string,
    token: string,
  ): Promise<void> {
    const key = `refresh:${userId}:${sessionId}`;
    await this.cacheManager.set(key, token, 7 * 24 * 60 * 60 * 1000);
  }

  async getRefreshToken(
    userId: string,
    sessionId: string,
  ): Promise<string | null> {
    const key = `refresh:${userId}:${sessionId}`;
    const value = await this.cacheManager.get(key);
    return value as string | null;
  }

  async deleteRefreshToken(userId: string, sessionId: string): Promise<void> {
    const key = `refresh:${userId}:${sessionId}`;
    await this.cacheManager.del(key);
  }

  async addToBlacklist(token: string): Promise<void> {
    const key = `blacklist:${token}`;
    await this.cacheManager.set(key, 'true', 7 * 24 * 60 * 60 * 1000);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const result = await this.cacheManager.get(key);
    return result === 'true';
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    const pattern = `refresh:${userId}:*`;
    const store = this.cacheManager.stores as unknown as {
      iterator: (pattern: string) => AsyncIterableIterator<string>;
    };

    const keysToDelete: string[] = [];
    for await (const key of store.iterator(pattern)) {
      keysToDelete.push(key);
    }

    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((key) => this.cacheManager.del(key)));
    }
  }
}
