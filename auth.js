const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'chuoibamat_xacthuc_123456'; 


module.exports = function(db) {

  
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!' });
    }

    
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    }

    
    const result = await db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, 'USER']
    );

    res.json({
      message: 'Đăng ký tài khoản thành công!',
      user: { id: result.lastID, username, role: 'USER' }
    });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký!' });
  }
});


  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!' });
      }

      
      const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
      if (!user) {
        return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
      }

      
if (user.password !== password) {
  return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
}

      
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' } 
      );

      return res.json({
        message: 'Đăng nhập thành công!',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server khi đăng nhập!' });
    }
  });

  return router;
};