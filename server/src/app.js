const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { initializeDatabase } = require('./config/database');
const snippetRoutes = require('./routes/snippetRoutes');

const expressApp = express();
const port = process.env.PORT || 5000;

function app(server) {
    const basePath = process.env.BASE_PATH;
    server.use(bodyParser.json());
    server.set('trust proxy', true);

    const injectBasePath = (req, res) => {
        const indexPath = path.join(__dirname, '../../client/build', 'index.html');
        let html = fs.readFileSync(indexPath, 'utf8');
        
        const script = `<script>window.BASE_PATH = "${basePath || ''}";</script>`;
        html = html.replace('<head>', '<head>' + script);
        
        res.send(html);
    };

    if (basePath) {
        const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        server.get(normalizedBasePath, injectBasePath);
        server.use(express.static(path.join(__dirname, '../../client/build')));
        server.use(`${normalizedBasePath}/api/snippets`, snippetRoutes);
        server.get(`${normalizedBasePath}/*`, injectBasePath);
        server.get('/', (req, res) => {
            res.redirect(normalizedBasePath);
        });
    } else {
        server.use(express.static(path.join(__dirname, '../../client/build')));
        server.use('/api/snippets', snippetRoutes);
        server.get('*', injectBasePath);
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