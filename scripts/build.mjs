import {mkdir,cp,readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
await mkdir('dist',{recursive:true});for(const p of ['index.html','style.css','app.js','shared','contracts','docs/research'])await cp(p,`dist/${p}`,{recursive:true});
const data=await readFile('contracts/study.schema.json');console.log(`Built static demo; study contract SHA-256 ${createHash('sha256').update(data).digest('hex')}`);
