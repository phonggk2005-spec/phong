const express = require('express');
const cors = require('cors');
const setupDatabase = require('./db');
const createAuthRoutes = require('./auth');
const createMovieRoutes = require('./movies');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Server và CSDL đã sẵn sàng!');
});

const PORT = 5000;


setupDatabase().then((db) => {

  
  app.use('/api/auth', createAuthRoutes(db));

  
  app.use('/api/movies', createMovieRoutes(db));

  app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Khởi tạo CSDL thất bại:', err);
});