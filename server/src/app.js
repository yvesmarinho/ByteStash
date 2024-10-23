const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeDatabase } = require('./config/database');
const snippetRoutes = require('./routes/snippetRoutes');

const app = express();
const port = process.env.PORT || 8500;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../client/build')));

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