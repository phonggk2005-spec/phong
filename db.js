const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function setupDatabase() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Tạo bảng users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'USER'
    );
  `);

  // Tạo bảng movies
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      poster_url TEXT,
      banner_url TEXT,
      release_year INTEGER,
      type TEXT,
      genre TEXT,
      country TEXT,
      views_count INTEGER DEFAULT 0
    );
  `);

  // Tạo bảng episodes
  await db.exec(`
    CREATE TABLE IF NOT EXISTS episodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER,
      episode_number INTEGER,
      title TEXT,
      video_url TEXT,
      FOREIGN KEY(movie_id) REFERENCES movies(id)
    );
  `);

  return db;
}

module.exports = setupDatabase;