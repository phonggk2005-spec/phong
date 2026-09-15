const express = require('express');

function createMovieRoutes(db) {
  const router = express.Router();

  // Lấy danh sách phim (Lọc theo Tìm kiếm, Thể loại, Quốc gia, Loại phim)
  router.get('/', async (req, res) => {
    try {
      const { search, genre, country, type } = req.query;
      let query = 'SELECT * FROM movies WHERE 1=1';
      let params = [];

      if (search) {
        query += ' AND title LIKE ?';
        params.push(`%${search}%`);
      }
      if (genre) {
        query += ' AND genre = ?';
        params.push(genre);
      }
      if (country) {
        query += ' AND country = ?';
        params.push(country);
      }
      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }

      const movies = await db.all(query, params);
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server khi lấy danh sách phim!' });
    }
  });

  // Top Trending
  router.get('/featured/trending', async (req, res) => {
    try {
      const movies = await db.all('SELECT * FROM movies ORDER BY views_count DESC LIMIT 5');
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server khi lấy phim trending!' });
    }
  });

  // Phim Đề Cử
  router.get('/featured/recommended', async (req, res) => {
    try {
      const movies = await db.all('SELECT * FROM movies ORDER BY RANDOM() LIMIT 4');
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server khi lấy phim đề cử!' });
    }
  });

  // Chi tiết phim
  router.get('/:id', async (req, res) => {
    try {
      const movie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
      if (!movie) {
        return res.status(404).json({ message: 'Không tìm thấy phim!' });
      }

      await db.run('UPDATE movies SET views_count = views_count + 1 WHERE id = ?', [req.params.id]);

      const episodes = await db.all('SELECT * FROM episodes WHERE movie_id = ? ORDER BY episode_number ASC', [req.params.id]);
      movie.episodes = episodes;

      return res.json(movie);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server khi lấy thông tin phim!' });
    }
  });

  return router;
}

module.exports = createMovieRoutes;