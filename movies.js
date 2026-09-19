const express = require('express');

function createMovieRoutes(db) {
  const router = express.Router();

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

  router.get('/featured/trending', async (req, res) => {
    try {
      const movies = await db.all('SELECT * FROM movies ORDER BY views_count DESC LIMIT 5');
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server khi lấy phim trending!' });
    }
  });

  router.get('/featured/recommended', async (req, res) => {
    try {
      const movies = await db.all('SELECT * FROM movies ORDER BY RANDOM() LIMIT 4');
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server khi lấy phim đề cử!' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { 
        title, 
        description, 
        poster_url, 
        banner_url, 
        release_year, 
        type, 
        genre, 
        country, 
        total_episodes, 
        video_url 
      } = req.body;

      if (!title || !poster_url) {
        return res.status(400).json({ message: 'Vui lòng điền Tên phim và Poster!' });
      }

      const result = await db.run(`
        INSERT INTO movies (title, description, poster_url, banner_url, release_year, type, genre, country, total_episodes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        title, 
        description || '', 
        poster_url, 
        banner_url || '', 
        release_year || 2026, 
        type || 'SERIES', 
        genre || '', 
        country || '', 
        total_episodes || '16 Tập'
      ]);

      const movieId = result.lastID;

      if (video_url && video_url.trim() !== '') {
        await db.run(`
          INSERT INTO episodes (movie_id, episode_number, title, video_url)
          VALUES (?, 1, 'Tập 1', ?)
        `, [movieId, video_url.trim()]);
      }

      return res.status(201).json({ message: 'Thêm phim thành công!', movieId });
    } catch (error) {
      console.error('Lỗi khi thêm phim:', error);
      return res.status(500).json({ message: 'Lỗi server khi thêm phim mới!' });
    }
  });

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