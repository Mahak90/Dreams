import Redis from "ioredis";
import env_config from './env.config.js';

const redis = new Redis(env_config.REDIS_URL);

console.log('connect to redis')
redis.on("error", (err) => console.error("Redis Error : ", err));

export default redis;
