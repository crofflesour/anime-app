const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Proxy ke Jikan API v4 (MyAnimeList unofficial) – gratis & stabil
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
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

// Sajikan file statis (frontend lo)
app.use(express.static('public'));
// Fallback buat static file kalau folder public kosong/kagak ada
app.use(express.static('.'));

// Kalau nggak ada route lain, redirect ke index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Server ngaceng di http://localhost:${PORT}`);
});