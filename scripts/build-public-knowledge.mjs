// Public knowledge is built from published source files whose routes exist in this build.
// Never include private archives, history packs, draft inventories or external page contents.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';
import { splitAiOpinionBlocks } from '../src/utils/noteGarden.mjs';
import {cvEntryIdentity,stableId,buildSiteIndex,seriesDocuments} from './public-knowledge-schema.mjs';


const hash = text => createHash('sha256').update(text).digest('hex');
export async function buildPublicKnowledge(root=process.cwd()) {
  const read = p => fs.readFile(path.join(root,p),'utf8');
  const documents=[],siteEntries=[],revisions={};
  const manifest={cvFields:['education','experiences','projects']};
  const localize = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.ko || value?.en || '';
  const clean = text => splitAiOpinionBlocks(String(text)).userContent
    .replace(/<!--[\s\S]*?-->/g, '').replace(/```[\s\S]*?```/g, '')
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '')
    .replace(/^\s*#{1,6}\s+/gm, '').replace(/[*_`]/g, '').replace(/\r/g, '').trim();
  const paragraphs = text => clean(text).split(/\n\s*\n/).flatMap(p => {
    const value = p.replace(/\s+/g, ' ').trim();
    if (value.length < 28 || /^[-|>]/.test(value)) return [];
    // Preserve contiguous original text, cut at sentence boundaries where possible.
    const result = []; let remaining = value;
    while (remaining.length > 650) {
      const part = remaining.slice(0, 650); const boundary = Math.max(part.lastIndexOf('. '), part.lastIndexOf('다. '));
      const end = boundary > 200 ? boundary + (part.slice(boundary).startsWith('다.') ? 2 : 1) : 650;
      result.push(remaining.slice(0, end)); remaining = remaining.slice(end).trim();
    }
    if (remaining.length >= 28) result.push(remaining);
    return result;
  });
  const add = async (source, route, title, lang, texts, status, sourceHash, aliases = [], metadata = {}) => {
    const url = `${lang === 'ko' ? '/ko' : ''}/${route}/`;
    await fs.access(path.join(root, 'dist', url, 'index.html')); // Must actually have a public built page.
    const excerpts = [...new Set(texts.flatMap(paragraphs))];
    excerpts.forEach((text, i) => documents.push({id:stableId(metadata.cvIdentity||route.replaceAll('/','-'),lang,text),source,title,lang,url,status,sourceHash,text,aliases,passageOrder:i,...metadata}));
  };
  const cvRaw = await read('src/data/cv.json'); revisions['src/data/cv.json']=hash(cvRaw); const cv = JSON.parse(cvRaw);
  for (const lang of ['ko','en']) for (const field of manifest.cvFields) {
    for (const item of cv[field] || []) {
      const keys = ['institution','degree','minor','period','organization','role','employmentType','team','title'];
      const heading = keys.map(k => localize(item[k],lang)).filter(Boolean).join(' · ');
      const descriptions = (item.description || []).map(d => localize(d,lang));
      await add('src/data/cv.json','cv',`CV — ${localize(cv.profile.name,lang)}`,lang,[`${heading}. ${descriptions.join(' ')}`],'published',hash(cvRaw),field==='education'?['학력','교육','공부해온 길','education','studied','degree']:field==='experiences'?['경력','일한','career','experience']:['프로젝트','projects'],{cvField:field,cvIdentity:cvEntryIdentity(field,item)});
    }
  }
  for (const kind of ['blog','works','notes']) {
    const files = (await fs.readdir(path.join(root,'src/content',kind))).filter(f=>f.endsWith('.md')).sort();
    for (const file of files) {
      const source = `src/content/${kind}/${file}`, raw = await read(source);
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!match) continue;
      const meta = yaml.load(match[1],{schema:yaml.JSON_SCHEMA}), id=file.slice(0,-3);
      const status=meta.status || (kind==='notes'?'working':'published');
      const publicStatus=kind==='notes'?['working','settled'].includes(status):status==='published';
      const included=publicStatus&&!file.startsWith('_')&&!meta.private&&!meta.draft;
      if (!included) continue;
      revisions[source]=hash(raw);
      const route=kind==='notes'?`blog/notes/${id}`:`${kind}/${kind==='blog'?meta.slug:id}`;
      if(kind!=='works'&&meta.series)siteEntries.push({source,kind:kind==='notes'?'note':'article',series:meta.series,order:meta.seriesOrder??null,hub:meta.seriesHub===true,
        title:kind==='notes'?{ko:meta.title||id,en:meta.titleEn||meta.title||id}:meta.title,status,
        publishedAt:String(meta.publishedAt||meta.date||'').match(/^\d{4}-\d{2}-\d{2}/)?.[0]||null,url:`/${route}/`});
      for (const lang of ['ko','en']) {
        // Notes have Korean body only; never fabricate an English translation.
        if (kind==='notes'&&lang==='en') continue;
        const textBlocks=(meta.contentBlocks||[]).filter(b=>b.type==='text').map(b=>localize(b.body,lang));
        const info=kind==='works'?[['year','artistOrRole','venue'].map(k=>localize(meta[k],lang)).filter(Boolean).join(' · ')]:[];
        const originalDate=meta.publishedAt||meta.date;
        const publishedAt=typeof originalDate==='string'&&/^\d{4}-\d{2}-\d{2}/.test(originalDate)?originalDate.slice(0,10):null;
        await add(source,route,localize(meta.title,lang)||id,lang,[...info,localize(meta.summary,lang),...textBlocks,raw.slice(match[0].length)],status,hash(raw),[],{...(kind==='works'?{workMedia:[...new Set((meta.contentBlocks||[]).map(b=>b.type).filter(t=>['image','video','text'].includes(t)))],workYear:Number(String(meta.year).match(/\d{4}/)?.[0])||0}:{}),publishedAt,dateProvenance:publishedAt?'original publication frontmatter':null,articleKey:source,originalTitle:localize(meta.title,'ko'),...(meta.series?{series:meta.series,seriesOrder:meta.seriesOrder??null,seriesHub:meta.seriesHub===true}:{})});
      }
    }
  }
  const seriesRaw=await read('src/data/series.json'); revisions['src/data/series.json']=hash(seriesRaw);
  revisions['src/layouts/Layout.astro']=hash(await read('src/layouts/Layout.astro'));
  const siteIndex=buildSiteIndex(JSON.parse(seriesRaw),siteEntries);
  documents.push(...seriesDocuments(siteIndex,hash(seriesRaw)));
  const payload={version:1,documents,siteIndex,revisions};
  const snapshot={...payload,hash:hash(JSON.stringify(payload))};
  await fs.writeFile(path.join(root,'dist','site-knowledge.json'),JSON.stringify(snapshot)+'\n');
  console.log(JSON.stringify({publicKnowledge:{documents:documents.length,sources:Object.keys(revisions).length,hash:snapshot.hash}}));
  return snapshot;
}
