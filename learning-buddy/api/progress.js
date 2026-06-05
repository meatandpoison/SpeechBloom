import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'missing id' });
      const data = await redis.get('buddy:' + id);
      return res.status(200).json(data || null);
    }

    if (req.method === 'POST') {
      const { id, data } = req.body || {};
      if (!id) return res.status(400).json({ error: 'missing id' });
      await redis.set('buddy:' + id, data);
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
}