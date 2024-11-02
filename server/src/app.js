const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeDatabase } = require('./config/database');
const snippetRoutes = require('./routes/snippetRoutes');

const expressApp = express();
const port = process.env.PORT || 5000;

function app(server) {
    const basePath = process.env.BASE_PATH;
    server.use(bodyParser.json());
    server.set('trust proxy', true);

    server.use((req, res, next) => {
        console.log(`[REQUEST] ${req.method} ${req.path}`);
        next();
    });

    if (basePath) {
        const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        console.log(`Initializing server with base path: ${normalizedBasePath}`);
        
        server.get('/', (req, res) => {
            console.log(`[REDIRECT] Redirecting / to ${normalizedBasePath}`);
            res.redirect(normalizedBasePath);
        });

        server.get(normalizedBasePath, (req, res) => {
            console.log(`[BASE] Serving index.html for base path`);
            res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
        });

        const staticPath = path.join(__dirname, '../../client/build');
        console.log(`Serving static files from: ${staticPath}`);
        server.use(express.static(staticPath));

        console.log(`Mounting API at: ${normalizedBasePath}/api/snippets`);
        server.use(`${normalizedBasePath}/api/snippets`, snippetRoutes);

        server.get(`${normalizedBasePath}/*`, (req, res) => {
            console.log(`[SPA] Serving index.html for: ${req.path}`);
            res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
        });

        server.use('*', (req, res) => {
            console.log(`[404] Not found: ${req.path}`);
            res.status(404).send('Not Found');
        });
    } else {
        server.use(express.static(path.join(__dirname, '../../client/build')));
        server.use('/api/snippets', snippetRoutes);
        server.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
        });
    }
}

async function startServer() {
    try {
        await initializeDatabase();
        return new Promise((resolve) => {
            expressApp.listen(port, () => {
                console.log(`Server running on port ${port}${process.env.BASE_PATH || ''}`);
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