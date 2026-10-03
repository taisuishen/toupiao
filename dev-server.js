// Local preview without Vercel: serves public/ and routes /api/poll to the function.
// Uses an in-memory store unless UPSTASH_REDIS_REST_URL / _TOKEN are set.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import * as poll from './api/poll.js';

const port = process.env.PORT || 3000;

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === '/api/poll') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const handler = poll[req.method];
    const response = handler
      ? await handler(new Request(url, {
          method: req.method,
          headers: req.headers,
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
        }))
      : new Response('Method Not Allowed', { status: 405 });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    return res.end(Buffer.from(await response.arrayBuffer()));
  }
  try {
    const html = await readFile(new URL('./public/index.html', import.meta.url));
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html);
  } catch {
    res.writeHead(404).end();
  }
}).listen(port, () => console.log(`http://localhost:${port}`));
