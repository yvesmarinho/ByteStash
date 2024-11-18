const express = require('express');
const { join } = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

const basePath = process.env.BASE_PATH || '';
const buildPath = join(__dirname, '../../client/build');
const assetsPath = join(buildPath, 'assets');

app.use(`${basePath}/assets`, express.static(assetsPath));
app.use(`${basePath}/monacoeditorwork`, express.static(join(buildPath, 'monacoeditorwork')));

app.use(basePath, express.static(buildPath, { index: false }));

app.get(`${basePath}/*`, (req, res, next) => {
  if (req.url.startsWith(`${basePath}/api`)) {
    return next();
  }

  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });

  fs.readFile(join(buildPath, 'index.html'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error loading index.html');
    }

    const modifiedHtml = data.replace(
      /(src|href)="\/assets\//g,
      `$1="${basePath}/assets/`
    ).replace(
      /\/monacoeditorwork\//g,
      `${basePath}/monacoeditorwork/`
    );

    const scriptInjection = `<script>window.__BASE_PATH__ = "${basePath}";</script>`;
    const injectedHtml = modifiedHtml.replace(
      '</head>',
      `${scriptInjection}</head>`
    );

    res.send(injectedHtml);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});