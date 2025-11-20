import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service.js';
import KeyvRedis from '@keyv/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: new KeyvRedis(configService.get('REDIS_URL')),
        ttl: configService.get('TTL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, RedisModule],
})
export class RedisModule {}
