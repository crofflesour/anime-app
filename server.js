const express = require('express');
const axios = require('axios');
const app = express();

// Jangan pake app.listen() – Vercel serverless, dia butuh exported app
// Jangan pake static fallback aneh-aneh, cukup public/

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query wajib, Sann.' });
  try {
    const resp = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`
    );
    const results = resp.data.data.map(m => ({
      id: m.mal_id,
      title: m.title,
      image: m.images?.jpg?.large_image_url || '',
      synopsis: m.synopsis || 'Tidak ada sinopsis.'
    }));
    res.json({ results });
  } catch (e) {
    console.error('Gagal ambil data:', e.message);
    res.status(500).json({ error: 'Gagal ambil data' });
  }
});

// Sajikan file statis dari folder public/
app.use(express.static('public'));

// Fallback ke index.html untuk semua rute selain /api
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;