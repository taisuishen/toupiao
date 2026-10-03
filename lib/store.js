import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Without Redis credentials (local dev), fall back to an in-memory store.
const redis = url && token ? new Redis({ url, token }) : null;
const mem = { votes: {}, comments: [], locks: new Map() };

export const usingMemory = !redis;

export async function addVote(pollId, option) {
  if (redis) return redis.hincrby(`poll:${pollId}:votes`, option, 1);
  mem.votes[option] = (mem.votes[option] || 0) + 1;
}

export async function addComment(pollId, comment) {
  if (redis) return redis.lpush(`poll:${pollId}:comments`, JSON.stringify(comment));
  mem.comments.unshift(comment);
}

export async function getResults(pollId, limit = 200) {
  if (!redis) return { votes: { ...mem.votes }, comments: mem.comments.slice(0, limit) };
  const [votes, comments] = await Promise.all([
    redis.hgetall(`poll:${pollId}:votes`),
    redis.lrange(`poll:${pollId}:comments`, 0, limit - 1),
  ]);
  return {
    votes: votes || {},
    // @upstash/redis auto-parses JSON strings
    comments: comments.map((c) => (typeof c === 'string' ? JSON.parse(c) : c)),
  };
}

// Short throttle keyed on a salted hash so the raw IP is never stored.
export async function throttle(key, seconds) {
  if (redis) return (await redis.set(`throttle:${key}`, 1, { nx: true, ex: seconds })) === 'OK';
  const until = mem.locks.get(key);
  if (until && until > Date.now()) return false;
  mem.locks.set(key, Date.now() + seconds * 1000);
  return true;
}
