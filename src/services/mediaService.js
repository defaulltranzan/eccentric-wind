const crypto = require('crypto');
const { driver } = require('../data');
const { httpError } = require('./contentService');

const MAX_BYTES = 8 * 1024 * 1024;
const FOLDERS = ['treks', 'expeditions', 'stories', 'general'];

/* Identify by magic bytes — never trust the client's filename or Content-Type. */
function sniff(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mime: 'image/png', ext: 'png' };
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return { mime: 'image/webp', ext: 'webp' };
  if (buf.toString('ascii', 4, 8) === 'ftyp' && /^avi[fs]$/.test(buf.toString('ascii', 8, 12))) return { mime: 'image/avif', ext: 'avif' };
  return null;
}

async function upload(folder, originalName, buffer) {
  if (FOLDERS.indexOf(folder) < 0) throw httpError(400, 'Unknown upload folder.');
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw httpError(400, 'No image received.');
  if (buffer.length > MAX_BYTES) throw httpError(413, 'Image is larger than 8 MB — please compress it first.');
  const type = sniff(buffer);
  if (!type) throw httpError(415, 'Only JPEG, PNG, WebP or AVIF images can be uploaded.');
  const base = String(originalName || 'image').replace(/\.[^.]*$/, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'image';
  const filename = base + '-' + crypto.randomBytes(4).toString('hex') + '.' + type.ext;
  const url = await driver.saveMedia(folder, filename, buffer, type.mime);
  return { url, bytes: buffer.length, mime: type.mime };
}

module.exports = { upload, MAX_BYTES };
