import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { parse } from 'parse5';
globalThis.HTMLElement = class {};
const { clampPage, pageItems } = await import('../src/utils/blogHubPagination.js');
const find=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>find(c,p))];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
test('page bounds and bounded navigation',()=>{
  for(const value of [null,'','abc','-2','1.5']) assert.equal(clampPage(value,4),1);
  assert.equal(clampPage('99',4),4); assert.equal(clampPage('0',4),1);
  assert.deepEqual(pageItems(50,100),[1,'…',49,50,51,'…',100]);
});
for(const route of ['','ko/','en/']) test(`${route||'default'} hub order, independent 8-post limits and no-JS links`,async()=>{
 const doc=parse(await readFile(new URL(`../dist/${route}blog/index.html`,import.meta.url),'utf8'));
 const cards=find(doc,n=>attr(n,'class')==='series-card');
 const numbers=cards.map(card=>Number(find(card,n=>attr(n,'class')==='series-card-kicker')[0].childNodes[0].value.match(/\d+/)[0]));
 assert.ok(numbers.length>=3); assert.deepEqual(numbers,[...numbers].sort((a,b)=>b-a));
 const lists=find(doc,n=>n.tagName==='blog-hub-list');
 assert.equal(lists.length,2);
 assert.deepEqual(lists.map(n=>attr(n,'data-page-param')),['writingPage','newsPage']);
 for(const list of lists){assert.equal(attr(list,'data-page-size'),'8');assert.ok(find(list,n=>n.tagName==='a').length>0);assert.ok(find(list,n=>attr(n,'data-hub-entry')!==undefined).every(n=>attr(n,'hidden')===undefined));}
});
