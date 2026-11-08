import '../../tools/stage.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const {version}=JSON.parse(await fs.readFile('package.json','utf8'));
if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error('Invalid site release version.');
// Published kit docs remain immutable; render website links against its current demo pin.
for(const file of ['index.html','docs/index.html']){
  const target=path.join('_site',file);
  const source=await fs.readFile(target,'utf8');
  await fs.writeFile(target,source.replaceAll(/fragment-kit-v\d+\.\d+\.\d+/g,`fragment-kit-v${version}`).replaceAll(/FRAGMENT KIT · \d+\.\d+\.\d+/g,`FRAGMENT KIT · ${version}`));
}
