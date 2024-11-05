const express = require('express');
const { initializeDatabase } = require('./config/database');
const snippetRoutes = require('./routes/snippetRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middleware/auth');
const { join } = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(join(__dirname, '../../client/build')));

app.get(/^\/(?!api)/, (req, res) => {
  res.sendFile(join(__dirname, '../../client/build/index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/snippets', authenticateToken, snippetRoutes);

(async () => {
  await initializeDatabase();

  return new Promise((resolve) => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        resolve();
    });
  });
})();