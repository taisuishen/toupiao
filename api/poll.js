import { createHash } from 'node:crypto';
import config from '../poll.config.js';
import { addVote, addComment, getResults, throttle } from '../lib/store.js';

const MAX_COMMENT = 500;

const json = (data, status = 200) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store' } });

function canSeeResults(request) {
  if (config.publicResults) return true;
  const key = new URL(request.url).searchParams.get('key');
  return Boolean(process.env.ADMIN_KEY) && key === process.env.ADMIN_KEY;
}

export async function GET(request) {
  const { id, title, question, description, options, allowComment, commentPlaceholder } = config;
  const body = { poll: { id, title, question, description, options, allowComment, commentPlaceholder } };
  if (canSeeResults(request)) body.results = await getResults(id);
  return json(body);
}

export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: '请求格式错误' }, 400);
  }

  const option = typeof input.option === 'string' ? input.option : '';
  const text = config.allowComment && typeof input.comment === 'string' ? input.comment.trim() : '';

  if (config.options.length && !config.options.includes(option)) {
    return json({ error: '请选择一个选项' }, 400);
  }
  if (!config.options.length && !text) return json({ error: '请填写意见' }, 400);
  if (text.length > MAX_COMMENT) return json({ error: `意见最多 ${MAX_COMMENT} 字` }, 400);

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const salt = process.env.ADMIN_KEY || 'toupiao';
  const ipHash = createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
  if (!(await throttle(ipHash, 5))) return json({ error: '提交太频繁，请稍后再试' }, 429);

  const pollId = config.id;
  if (option) await addVote(pollId, option);
  if (text) {
    // Day-level timestamp only, to make submissions harder to correlate.
    await addComment(pollId, { option: option || null, text, date: new Date().toISOString().slice(0, 10) });
  }

  return json({ ok: true, results: canSeeResults(request) ? await getResults(pollId) : undefined });
}
