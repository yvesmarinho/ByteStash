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
    const basePath = process.env.BASE_PATH;
    server.use(bodyParser.json());
    server.set('trust proxy', true);

    const clientBuildPath = '/client/build';

    const injectBasePath = (req, res) => {
        const indexPath = path.join(clientBuildPath, 'index.html');
        let html = fs.readFileSync(indexPath, 'utf8');
        
        const script = `<script>window.BASE_PATH = "${basePath || ''}";</script>`;
        html = html.replace('<head>', '<head>' + script);
        
        res.send(html);
    };

    if (basePath) {
        const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        
        server.use(normalizedBasePath, express.static(clientBuildPath));
        server.use(express.static(clientBuildPath, {
            index: false
        }));

        server.use(`${normalizedBasePath}/api/auth`, authRoutes);
        server.use(`${normalizedBasePath}/api/snippets`, authenticateToken, snippetRoutes);
        server.use('/api/auth', authRoutes);
        server.use('/api/snippets', authenticateToken, snippetRoutes);
        
        server.get(normalizedBasePath, injectBasePath);
        server.get(`${normalizedBasePath}/*`, injectBasePath);
        server.get('/', (req, res) => {
            res.redirect(normalizedBasePath);
        });
    } else {
        server.use(express.static(clientBuildPath));
        server.use('/api/auth', authRoutes);
        server.use('/api/snippets', authenticateToken, snippetRoutes);
        server.get('*', injectBasePath);
    }

    server.use((req, res, next) => {
        if (req.path.includes('/assets/') || req.path.endsWith('.json')) {
            console.log('404 for static file:', req.path);
            res.status(404).send('File not found');
        } else {
            next();
        }
    });
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