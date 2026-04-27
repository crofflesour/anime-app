const express = require('express');
const axios = require('axios');
const app = express();

// Proxy ke Jikan API v4
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query wajib diisi, Sann.' });
  try {
    const resp = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
    const anime = resp.data.data.map(m => ({
      id: m.mal_id,
      title: m.title,
      image: m.images.jpg.large_image_url,
      synopsis: m.synopsis || 'Tidak ada sinopsis.'
    }));
    res.json({ results: anime });
  } catch (e) {
    console.error('Gagal ambil data:', e.message);
    res.status(500).json({ error: 'Gagal ambil data' });
  }
});

// Sajikan frontend dari folder public
app.use(express.static('public'));

// Hapus baris app.listen() — Vercel nggak butuh itu

// Ekspor app buat Vercel
module.exports = app;