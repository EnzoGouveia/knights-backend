import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import redisConfig from './redis.config';

@Module({
  providers: [
    {
      provide: RedisService,
      useValue: new RedisService(redisConfig),
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}