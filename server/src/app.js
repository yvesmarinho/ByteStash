const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const snippetRoutes = require('./routes/snippetRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../client/build')));

app.set('trust proxy', true);
app.use((req, res, next) => {
  res.header('X-Powered-By', null);
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('X-Content-Type-Options', 'nosniff');
  next();
});

app.use('/api/snippets', snippetRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

async function startServer() {
  try {
    await initializeDatabase();
    return new Promise((resolve) => {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        resolve(server);
      });
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

if (require.main === module) {
  startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = { app, startServer };