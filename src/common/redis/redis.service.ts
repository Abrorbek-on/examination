import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';


@Injectable()
export class RedisService implements OnModuleInit {
    private client: Redis

    async onModuleInit() {
        this.client = new Redis()
    }

    async set(key: string, value: string, seconds: number) {
        await this.client.set(key, value, 'EX', seconds)
    }

    async get(key: string) {
        return await this.client.get(key)
    }

    async del(key: string) {
        await this.client.del(key)
    }
}