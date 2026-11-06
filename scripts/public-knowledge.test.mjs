import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {buildPublicKnowledge} from './build-public-knowledge.mjs';

test('published built sources refresh additions, edits and withdrawals without exposing drafts or code',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'public-knowledge-test-'));
  const write=async(p,s)=>{await fs.mkdir(path.dirname(path.join(root,p)),{recursive:true});await fs.writeFile(path.join(root,p),s);};
  try{
    for(const k of ['blog','notes','works'])await fs.mkdir(path.join(root,'src/content',k),{recursive:true});
    await write('src/data/cv.json',JSON.stringify({profile:{name:{ko:'이름',en:'Name'}},education:[],experiences:[],projects:[]}));
    await write('src/data/series.json','{}');await write('src/layouts/Layout.astro','public footer');await fs.mkdir(path.join(root,'dist'));
    const article=(status,text)=>`---\nslug: "21"\ntitle: {ko: 새 글, en: New article}\nstatus: ${status}\npublishedAt: "2026-11-06"\n---\n${text}\n\n> [!ai-opinion]
> PRIVATE AI OPINION SHOULD NOT BECOME AUTHOR EVIDENCE

<!-- PRIVATE COMMENT -->\n\n\`\`\`js\nPRIVATE CODE\n\`\`\`\n`;
    await write('src/content/blog/21.md',article('published','새롭게 공개한 글의 내용은 다음 세대가 자신만의 경험을 만들어가는 과정에 대한 이야기입니다.'));
    await write('src/content/blog/22.md',article('draft','SECRET DRAFT MATERIAL NEVER PUBLISHED'));
    await write('src/content/blog/_hidden.md',article('published','SECRET HIDDEN MATERIAL NEVER PUBLISHED'));
    for(const p of ['ko/blog/21','blog/21'])await write(`dist/${p}/index.html`,'public page');
    const first=await buildPublicKnowledge(root);
    assert(first.documents.some(d=>d.source.endsWith('/21.md')));
    assert(!JSON.stringify(first).match(/SECRET|PRIVATE|_hidden|22\.md/));
    const {hash,...payload}=first;assert.equal(hash,createHash('sha256').update(JSON.stringify(payload)).digest('hex'));
    await write('src/content/blog/21.md',article('published','수정된 글은 세대 사이에 이야기를 건네고 새로운 추억을 쌓는다는 점을 더욱 분명하게 설명합니다.'));
    const edited=await buildPublicKnowledge(root);assert.notEqual(edited.hash,first.hash);assert(!edited.documents.some(d=>d.text.includes('새롭게 공개한')));
    await write('src/content/blog/21.md',article('draft','이제 비공개로 전환된 글의 본문은 최신 공개 자료에 남아 있으면 안 됩니다.'));
    const removed=await buildPublicKnowledge(root);assert.equal(removed.documents.length,0);assert(!removed.revisions['src/content/blog/21.md']);
    await write('src/content/blog/21.md',article('published','실제 공개 페이지 없이 자료만 추가되면 빌드가 실패해야 비공개 노출을 막을 수 있습니다.'));
    await fs.unlink(path.join(root,'dist/blog/21/index.html'));await assert.rejects(buildPublicKnowledge(root),/ENOENT/);
  }finally{await fs.rm(root,{recursive:true,force:true});}
});
