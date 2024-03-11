import { Redis} from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisOptions } from './redis.config';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(options: RedisOptions) {
    this.redisClient = new Redis(options); // Aqui está o problema, não podemos instanciar assim
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async deleteKey(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
