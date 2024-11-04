const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { initializeDatabase } = require('./config/database');
const snippetRoutes = require('./routes/snippetRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middleware/auth');

const expressApp = express();
const port = 5000;

function app(server) {
    server.use(bodyParser.json());
    server.set('trust proxy', true);

    const clientBuildPath = '/client/build';

    server.use(express.static(clientBuildPath));
    server.use('/api/auth', authRoutes);
    server.use('/api/snippets', authenticateToken, snippetRoutes);
    
    server.get('*', (req, res) => {
        if (req.path.includes('/assets/') || req.path.endsWith('.json')) {
            console.log('404 for static file:', req.path);
            res.status(404).send('File not found');
        } else {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        }
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