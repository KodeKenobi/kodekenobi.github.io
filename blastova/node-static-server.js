const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = Number(process.env.PORT || 6753);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4'
};

function sanitize(urlPath) {
  return path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
}

function resolveCandidates(urlPath) {
  const candidates = [];
  candidates.push(path.join(root, sanitize(urlPath)));

  if (urlPath.startsWith('/assets/')) {
    candidates.push(path.join(root, 'game', sanitize(urlPath)));
  }

  if (urlPath === '/manifest.webmanifest') {
    candidates.push(path.join(root, 'game', 'manifest.webmanifest'));
  }

  if (urlPath === '/sw.js') {
    candidates.push(path.join(root, 'game', 'sw.js'));
  }

  if (urlPath.startsWith('/workbox-')) {
    candidates.push(path.join(root, 'game', path.basename(urlPath)));
  }

  if (urlPath.endsWith('.html') && urlPath.startsWith('/')) {
    candidates.push(path.join(root, 'game', path.basename(urlPath)));
  }

  return candidates;
}

function resolveFile(urlPath, done) {
  const candidates = resolveCandidates(urlPath);
  let idx = 0;

  function next() {
    if (idx >= candidates.length) {
      done(null);
      return;
    }

    let filePath = candidates[idx++];
    fs.stat(filePath, (err, stat) => {
      if (err) {
        next();
        return;
      }

      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        fs.stat(filePath, (dirErr, dirStat) => {
          if (dirErr || !dirStat.isFile()) {
            next();
            return;
          }
          done(filePath);
        });
        return;
      }

      if (!stat.isFile()) {
        next();
        return;
      }

      done(filePath);
    });
  }

  next();
}

const server = http.createServer((req, res) => {
  const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const urlPath = rawPath === '/' ? '/index.html' : rawPath;

  if (urlPath === '/__preview-icon-adjustments') {
    const previewPath = path.join(root, 'game', 'assets', 'generated', 'preview-icon-adjustments.json');
    fs.readFile(previewPath, (err, data) => {
      const body = err ? '{}' : data;
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(body);
    });
    return;
  }

  if (urlPath === '/__commander-store') {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      req.on('data', () => {});
      req.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end('{"ok":true}');
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end('{}');
    return;
  }

  resolveFile(urlPath, (filePath) => {
    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal Server Error');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': types[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log('Node static server running at http://localhost:' + port);
});
