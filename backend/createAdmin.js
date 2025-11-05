const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hash = await bcrypt.hash('admin123', 10);
    
    await User.findOneAndUpdate(
      { username: 'admin' },
      { username: 'admin', password: hash, isAdmin: true },
      { upsert: true, new: true }
    );
    
    console.log('Admin created: admin / admin123');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
})();