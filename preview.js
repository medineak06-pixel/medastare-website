/**
 * MedaStaré — local preview server.
 *
 *   node preview.js            → http://localhost:5173
 *   node preview.js 8080       → http://localhost:8080
 *
 * Mirrors vercel.json (cleanUrls: true, trailingSlash: false) so that
 * root-absolute asset paths (/assets/v4/...) and extensionless document
 * links (/privacy, /delete-account) behave exactly as they do in production.
 *
 * Opening index.html straight from disk with file:// will NOT work: the
 * browser resolves "/assets/..." against the drive root, so the CSS, JS and
 * images all 404 and the page renders unstyled. Always use this server.
 *
 * No dependencies — Node's standard library only.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.argv[2]) || 5173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  let rel;
  try {
    rel = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('400 Bad Request');
  }

  if (rel === '/' || rel === '') rel = '/index.html';

  // trailingSlash: false — /privacy/ behaves like /privacy
  if (rel.length > 1 && rel.endsWith('/')) rel = rel.slice(0, -1);

  // Resolve inside ROOT only; reject anything that escapes it.
  const target = path.resolve(ROOT, '.' + rel);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  let file = target;
  // cleanUrls: true — /privacy resolves to privacy.html
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    const index = path.join(file, 'index.html');
    file = fs.existsSync(index) ? index : file;
  }

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    console.log('404  ' + rel);
    // Vercel serves /404.html with a 404 status for any unmatched route.
    const notFound = path.join(ROOT, '404.html');
    if (fs.existsSync(notFound)) {
      res.writeHead(404, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' });
      return fs.createReadStream(notFound).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 — not found: ' + rel);
  }

  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(file).pipe(res);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try:  node preview.js ${PORT + 1}`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log('');
  console.log('  MedaStaré preview');
  console.log('  ─────────────────────────────────────────');
  console.log('  http://localhost:' + PORT);
  console.log('  serving ' + ROOT);
  console.log('  Ctrl+C to stop');
  console.log('');
});
