import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { encodeQr, qrSvg, qrNotes, decodePixels, QrScanner, acceptScannedText, createUrlState, computeCID } from '../src/index.js';
import { config, type } from '../testing/fixtures/helpers.js';
import fs from 'node:fs/promises';

export function pixels(qr, scale = 4) {
  const width = (qr.size + 8) * scale, data = new Uint8ClampedArray(width * width * 4); data.fill(255);
  qr.modules.forEach((row, y) => row.forEach((dark, x) => {
    if (!dark) return;
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      const offset = (((y + 4) * scale + dy) * width + (x + 4) * scale + dx) * 4;
      data[offset] = data[offset + 1] = data[offset + 2] = 0;
    }
  }));
  return { data, width, height: width };
}
test('default encoder retains the legacy golden grid and guidance', () => {
  const qr = encodeQr('hello'); assert.equal(qr.version, 1);
  assert.equal(createHash('sha256').update(qr.modules.map(row => row.map(Number).join('')).join('\n')).digest('hex'), '69eec149521d0daf8dd3263acf22740ee26b4a844714a559cabedbf5de3f1bad');
  assert.match(qrSvg(qr), /viewBox/); assert.match(qrNotes('http://localhost/', qr), /computer/);
  assert.match(qrNotes('https://x/', { version: 21 }), /dense/); assert.equal(encodeQr('x'.repeat(4000)), null);
});
test('checked-in RGBA image fixture decodes independently of the encoder', async () => {
  const fixture = JSON.parse(await fs.readFile(new URL('../testing/fixtures/qr-known.json', import.meta.url)));
  assert.equal(decodePixels({ data: new Uint8ClampedArray(Buffer.from(fixture.rgba64, 'base64')), width: fixture.width, height: fixture.height }), fixture.text);
});
for (const ecc of ['L', 'M', 'Q', 'H']) for (let version = 1; version <= 40; version++) test(`QR encode/decode version ${version} ECC ${ecc}`, () => {
  const input = `v${version}-${ecc}`, qr = encodeQr(input, { version, ecc });
  assert.equal(qr.version, version); assert.equal(decodePixels(pixels(qr, 3)), input);
});
test('decoder handles Unicode and invalid images', () => {
  const value = 'Café 😀 日本語'; assert.equal(decodePixels(pixels(encodeQr(value))), value);
  assert.equal(decodePixels({ data: new Uint8ClampedArray(400).fill(255), width: 10, height: 10 }), null);
  assert.throws(() => decodePixels({ data: [], width: 100000, height: 100000 }), /oversized/);
});
test('scan policy checks application path as well as shared origin', async () => {
  const urlState = createUrlState({ config, type });
  assert.equal(acceptScannedText(await computeCID('hello'), { config, urlState }).kind, 'cid');
  assert.equal(acceptScannedText(config.recoveryOrigin + '#hello', { config, urlState }).kind, 'app');
  assert.equal(acceptScannedText('https://curtcox.github.io/other/#hello', { config, urlState }).kind, 'text');
  const other = { ...config, name: 'Other', canonicalOrigin: 'https://other.hashbin.page/', recoveryOrigin: 'https://curtcox.github.io/other/' };
  assert.equal(acceptScannedText(other.recoveryOrigin + '#hello', { config, registry: [other], urlState }).name, 'Other');
  for (const value of ['javascript:alert(1)', 'https://evil.example', 'https://hashbin.org/#hello']) assert.equal(acceptScannedText(value, { config, urlState }).kind, 'text');
});
test('a late camera permission result is stopped after dialog cancellation', async () => {
  let resolve, stopped = 0;
  const scanner = new QrScanner({ navigator: { mediaDevices: { getUserMedia: () => new Promise(done => { resolve = done; }) } } });
  const controller = new AbortController(), video = { srcObject: null };
  const pending = scanner.fromCamera(video, { signal: controller.signal }); controller.abort();
  resolve({ getTracks: () => [{ stop() { stopped++; } }] }); await pending;
  assert.equal(stopped, 1); assert.equal(video.srcObject, null);
});
test('unsupported native detection falls back without requesting camera', async () => {
  const scanner = new QrScanner({ BarcodeDetector: class { static async getSupportedFormats() { return []; } } });
  assert.equal(await scanner.detector(), null);
  await assert.rejects(scanner.fromImage({ type: 'text/plain', size: 1 }), /Choose an image/);
});
