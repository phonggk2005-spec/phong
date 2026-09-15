const setupDatabase = require('./db');

async function seedData() {
  const db = await setupDatabase();

  console.log('-> Đang dọn dẹp dữ liệu cũ...');
  await db.run('DELETE FROM episodes');
  await db.run('DELETE FROM movies');

  console.log('-> Đang thêm phim mới...');
  
await db.run(`
  INSERT INTO users (username, password, role) 
  VALUES ('admin', 'admin123', 'ADMIN')
`);
console.log('Đã tạo tài khoản Admin thành công!');

  // 1. Yêu tinh
  const m1 = await db.run(`
    INSERT INTO movies (title, description, poster_url, banner_url, release_year, type, genre, country, views_count)
  VALUES (
    'Yêu Tinh (Goblin)',
    'Kim Shin - một tướng quân bất tử bị nguyền rủa phải sống hàng trăm năm để tìm kiếm cô dâu loài người - người duy nhất có thể rút thanh kiếm trên ngực anh để giải thoát cho anh.',
    'https://thegioidienanh.vn/stores/news_dataimages/hoangtuan/112016/22/04/0954_goblin_4.jpg',
    'https://upload.wikimedia.org/wikipedia/vi/6/69/Golbin_Poster.jpg?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=original',
    2016, 'SERIES', 'Tình Cảm', 'Hàn Quốc', 250000
  )
  `);
  await db.run(`
  INSERT INTO episodes (movie_id, episode_number, title, video_url)
  VALUES (?, 1, 'Tập 1', 'https://playmogo.com/e/outl6myc9qgq')
`, [m1.lastID]);
  //2. Phim Dưa Hấu Lấp Lánh
  const m2 = await db.run(`
    INSERT INTO movies (title, description, poster_url, banner_url, release_year, type, genre, country, views_count)
    VALUES (
      'Dưa Hấu Lấp Lánh',
      'Eun Gyeol - một học sinh CODA (con của người khiếm thính) có năng khiếu âm nhạc thiên bẩm. Trong một lần ghé thăm tiệm nhạc cụ kỳ lạ, cậu vô tình du hành thời gian về năm 1995 và gặp lại người bố thời trẻ của mình.',
      'https://preview.redd.it/tvn-twinkling-watermelon-teaser-poster-2-ryeoun-choi-hyun-v0-b6zonb4opwob1.jpg?width=640&crop=smart&auto=webp&s=16fc6dcb6c2914fdf05aebeb08b97e3033143d8a',
      'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/9/25/1246057/Dua-Hau-Lap-Lanh.jpg?w=800&h=496&crop=auto&scale=both',
      2023, 'SERIES', 'Tình Cảm', 'Hàn Quốc', 98000
    )
  `);

  await db.run(`
    INSERT INTO episodes (movie_id, episode_number, title, video_url) 
    VALUES (?, 1, 'Tập 1', 'https://drive.google.com/file/d/1i8ukuOGQj4dY6Vd16_n-9lbXk_JdjmW-/preview')
  `, [m2.lastID]);
  // 3. Bố Già
  const m3 = await db.run(`
    INSERT INTO movies (title, description, poster_url, banner_url, release_year, type, genre, country, views_count)
  VALUES (
    'Bố Già',
    'Bộ phim xoay quanh cuộc sống thường nhật của một xóm lao động nghèo tại TP.HCM, nơi ông Ba Sang - một người cha giàu tình cảm nhưng hay bao đồng, luôn hy sinh cho gia đình và đứa con trai tên Quắn.',
    'https://i.pinimg.com/736x/12/30/b2/1230b26c5f91ff3b87cce060d6f446ef.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBZUB7cCEmJIxmQGakMtD1QSumNIrYZQblliYTAN4hN64hhwR__8BUs4nH&s=10',
    2021, 'CINEMA', 'Tâm Lý', 'Việt Nam', 400000
    )
  `);
  await db.run(`
  INSERT INTO episodes (movie_id, episode_number, title, video_url)
  VALUES (?, 1, 'Tập 1', 'https://www.youtube.com/embed/Lz8nvVp3MNE')
`, [m3.lastID]);
await db.run(`
  INSERT INTO episodes (movie_id, episode_number, title, video_url)
  VALUES (?, 2, 'Tập 2', 'https://www.youtube.com/embed/UYgH1TJGXGU')
`, [m3.lastID]);
  // 4. Mắt Biếc (Phim mới thêm)
  const m4 = await db.run(`
    INSERT INTO movies (title, description, poster_url, banner_url, release_year, type, genre, country, views_count)
    VALUES (
      'Mắt Biếc',
      'Chuyện tình đơn phương ngây thơ và da diết của Ngạn dành cho cô bạn thân từ thuở nhỏ - Hà Lan.',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxJ2wfCp8VV5TlYT_sYikUDdTZjR8vnUEqyRLK6IaquanNIeij2OVRUFbA&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxJ2wfCp8VV5TlYT_sYikUDdTZjR8vnUEqyRLK6IaquanNIeij2OVRUFbA&s=10',
      2019, 'CINEMA', 'Tình Cảm', 'Việt Nam', 18500
    )
  `);
  await db.run(`INSERT INTO episodes (movie_id, episode_number, title, video_url) VALUES (?, 1, 'Full Movie', 'https://www.youtube.com/embed/OPNiMQboyM8?si=SHwhMqsCaVESZbgk')`, [m4.lastID]);

 // 5. Phim Chàng Hậu (Mr. Queen)
  const m5 = await db.run(`
    INSERT INTO movies (title, description, poster_url, banner_url, release_year, type, genre, country, views_count)
    VALUES (
      'Chàng Hậu',
      'Linh hồn của Jang Bong Hwan - một đầu bếp thời hiện đại làm việc tại Nhà Dải Ngân Hà - đột nhiên xuyên không về quá khứ và kẹt trong cơ thể của Triết Nhân Vương hậu Kim So Yong thời Joseon.',
      'https://thegioidienanh.vn/stores/news_dataimages/vananh/032021/10/13/5253_Poster.jpg?rt=20210310135256',
      'https://thegioidienanh.vn/stores/news_dataimages/vananh/032021/10/13/5253_Poster.jpg?rt=20210310135256',
      2020, 'SERIES', 'Hài Hước', 'Hàn Quốc', 120000
    )
  `);
  await db.run(`
    INSERT INTO episodes (movie_id, episode_number, title, video_url) 
    VALUES (?, 1, 'Tập 1', 'https://playmogo.com/e/karewqwmqzny')
  `, [m5.lastID]);
   await db.run(`
    INSERT INTO episodes (movie_id, episode_number, title, video_url) 
    VALUES (?, 2, 'Tập 2', 'https://drive.google.com/file/d/1vecEX9I0LH5v62vHZFPsvxZQ75EdPl11/preview')
  `, [m5.lastID]);
   await db.run(`
    INSERT INTO episodes (movie_id, episode_number, title, video_url) 
    VALUES (?, 3, 'Tập 3', 'https://playmogo.com/e/vy1w2lum52m9')
  `, [m5.lastID]);
  console.log('✅ ĐÃ NẠP DỮ LIỆU THÀNH CÔNG!');
  process.exit();
}

seedData();