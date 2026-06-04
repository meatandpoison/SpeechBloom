import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const id = (req.query.id || 'guest').toString();
    const data = await redis.get('buddy:' + id);
    return res.status(200).json(data || null);
  }
  if (req.method === 'POST') {
    const { id = 'guest', data } = req.body || {};
    await redis.set('buddy:' + id, data);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: 'method not allowed' });
}