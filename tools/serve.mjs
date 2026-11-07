/**
 * Servidor estático mínimo para desarrollo local.
 *
 * No usa dependencias externas, no registra las peticiones y solo sirve
 * archivos dentro de la raíz del proyecto. No forma parte del sitio publicado.
 *
 * Uso:
 *   npm start
 *   $env:PORT=3000; npm start
 *   $env:HOST='0.0.0.0'; npm start
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const HOST = process.env.HOST ?? '127.0.0.1';
const PORT = Number.parseInt(process.env.PORT ?? '8080', 10);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error('El puerto indicado en PORT no es válido.');
  process.exit(1);
}

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function sendText(response, status, message, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  response.end(message);
}

/** Convierte la ruta de la URL en una ruta absoluta dentro de ROOT. */
function resolveRequestPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (decoded.includes('\0')) return null;

  const relative = decoded.replace(/^\/+/, '');
  const candidate = resolve(ROOT, relative || 'index.html');
  const insideRoot = candidate === ROOT || candidate.startsWith(ROOT + sep);
  return insideRoot ? candidate : null;
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendText(response, 405, 'Método no permitido', { Allow: 'GET, HEAD' });
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, `http://${HOST}`).pathname;
  } catch {
    sendText(response, 400, 'Solicitud inválida');
    return;
  }

  let filePath = resolveRequestPath(pathname);
  if (!filePath) {
    sendText(response, 403, 'Acceso denegado');
    return;
  }

  try {
    let info = await stat(filePath);
    if (info.isDirectory()) {
      filePath = join(filePath, 'index.html');
      info = await stat(filePath);
    }

    if (!info.isFile()) {
      sendText(response, 404, 'Archivo no encontrado');
      return;
    }

    response.writeHead(200, {
      'Content-Type':
        MIME_TYPES.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    const stream = createReadStream(filePath);
    stream.on('error', () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      sendText(response, 404, 'Archivo no encontrado');
      return;
    }
    sendText(response, 500, 'Error interno del servidor');
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está en uso. Probá con otro: $env:PORT=3000; npm start`);
  } else {
    console.error(`No se pudo iniciar el servidor: ${error.message}`);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Servidor local: http://${displayHost}:${PORT}`);
  console.log('Presioná Ctrl+C para detenerlo.');
});
