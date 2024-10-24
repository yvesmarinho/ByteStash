const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeDatabase } = require('./config/database');
const snippetRoutes = require('./routes/snippetRoutes');

const expressApp = express();
const port = process.env.PORT || 5000;

function app(server) {
    // Configure the provided server instance
    server.use(bodyParser.json());
    server.use(express.static(path.join(__dirname, '../../client/build')));
    server.set('trust proxy', true);
    server.use('/api/snippets', snippetRoutes);
    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
}

async function startServer() {
    try {
        await initializeDatabase();
        return new Promise((resolve) => {
            expressApp.listen(port, () => {
                console.log(`Server running on port ${port}`);
                resolve();
            });
        });
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}

if (require.main === module) {
    app(expressApp);
    startServer().catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}

module.exports = { app, startServer };