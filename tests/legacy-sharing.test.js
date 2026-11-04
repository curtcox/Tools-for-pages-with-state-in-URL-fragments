// Ported verbatim except module imports from R/tests/sharing.test.js.
import test from 'node:test'; import assert from 'node:assert/strict';
import { ShareClient } from '../src/share/shortener.js';
test('shortener accepts only is.gd links and preserves source on provider failure', async () => {
  const links={long:'https://example.com/',fallback:'https://example.com/'};
  let result = await new ShareClient({fetchLink:async()=>({ok:true,json:async()=>({contents:'https://is.gd/abc'})})}).shorten(links); assert.equal(result.shortened,true);
  result = await new ShareClient({fetchLink:async()=>({ok:true,json:async()=>({contents:'Error: URL too long'})})}).shorten(links); assert.equal(result.shortened,false); assert.match(result.error.message,/HashBin/);
});
