import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createConfig, createUrlState } from '../src/index.js';
import { corpusAdapter } from '../testing/fixtures/corpus-adapter.js';

for (const file of await fs.readdir(new URL('./corpus/', import.meta.url))) {
  const corpus = JSON.parse(await fs.readFile(new URL('./corpus/' + file, import.meta.url)));
  const type = corpusAdapter(corpus);
  const config = createConfig({ slug: corpus.slug, name: corpus.repo, storagePrefix: corpus.slug,
    canonicalOrigin: `https://${corpus.slug}.hashbin.page/`, recoveryOrigin: `https://curtcox.github.io/${corpus.repo}/`, repo: 'curtcox/' + corpus.repo, docs: 'docs/', gallery: 'gallery.html', documentType: type.type });
  const kit = createUrlState({ config, type });
  for (const entry of corpus.cases) test(`${corpus.repo}: ${entry.label}`, () => {
    const intent = kit.parse(entry.href);
    assert.equal(intent.kind, entry.kind);
    if (entry.kind === 'source') {
      assert.deepEqual(intent.doc, type.normalize(entry.raw ? type.parseLegacy(entry.raw) : { src: entry.src }));
      assert.deepEqual(kit.parse(kit.build(intent.doc).href).doc, intent.doc);
      assert.equal(intent.doc.src, entry.raw ? JSON.parse(entry.raw).src : entry.src);
    } else if (entry.kind === 'cid') assert.equal(intent.cid, entry.cid);
    else if (entry.kind === 'example') assert.equal(intent.id, entry.id);
  });
  test(`${corpus.repo}: recorded baseline has provenance and preserves all envelope fields`, () => {
    assert.match(corpus.commit, /^[a-f0-9]{40}$/);
    assert.ok(Object.keys(corpus.sourceFiles).length);
    assert.equal(corpus.example.expected.src ?? corpus.example.expected.files?.find(file => file.name === corpus.example.expected.entry).text, corpus.example.source);
    const doc = kit.parse(corpus.cases.find(entry => entry.label === 'document query').href).doc;
    const wire = JSON.parse(corpus.example.raw);
    for (const key of Object.keys(wire).filter(key => !['format', 'version', 'type'].includes(key))) assert.deepEqual(doc[key], wire[key]);
  });
}
