import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://api.pinterest.com/v5/search/pins?query=${query}&access_token=${accessToken}`
    );
    const data = await response.json();
    res.status(200).json(data.items || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pinterest results' });
  }
}