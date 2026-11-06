import {createHash} from 'node:crypto';
export const stableId=(prefix,...parts)=>prefix+'-'+createHash('sha256').update(JSON.stringify(parts.map(v=>String(v??'').normalize('NFKC').trim()))).digest('hex').slice(0,20);
export const localized=(value,lang='ko')=>typeof value==='string'?value:value?.[lang]||value?.ko||value?.en||'';
export function cvEntryIdentity(field,item){
  // Identity excludes order, period and description. Explicit knowledgeId can
  // retain identity when an institution/project itself is renamed.
  return item.knowledgeId||stableId('cv-'+field,localized(item.institution||item.organization||item.title),localized(item.degree||item.role));
}

const localize=(value,lang)=>typeof value==='string'?value:value?.[lang]||value?.ko||value?.en||'';
export const seriesEvidenceId=(slug,lang)=>`site-series-${slug}-${lang}`;
// The registry and public, built entries are the authority. No series titles,
// numbers, membership, summaries or publication dates are hand-maintained here.
export function buildSiteIndex(registry,entries){
  const numbers=new Set();
  const series=Object.entries(registry).map(([slug,row])=>{
    if(!/^[a-z0-9-]+$/.test(slug)||!Number.isInteger(row.number)||row.number<1||numbers.has(row.number))throw Error('invalid_series_registry');
    numbers.add(row.number);
    const members=entries.filter(e=>e.series===slug&&Number.isInteger(e.order)).sort((a,b)=>a.order-b.order);
    if(new Set(members.map(e=>e.order)).size!==members.length)throw Error('duplicate_series_order');
    return {slug,number:row.number,status:row.status||'active',title:row.title,label:row.label||row.title,description:row.description,members,
      hubs:entries.filter(e=>e.series===slug&&e.hub&&!Number.isInteger(e.order))};
  }).sort((a,b)=>a.number-b.number);
  if(entries.some(e=>e.series&&!registry[e.series]))throw Error('unknown_series');
  return {version:1,series};
}
export function seriesDocuments(index,sourceHash){
  return index.series.flatMap(s=>['ko','en'].map(lang=>({
    id:seriesEvidenceId(s.slug,lang),source:'src/data/series.json',sourceKind:'site-series',sourceHash,
    title:localize(s.title,lang),lang,status:'published',url:lang==='ko'?'/ko/blog/':'/blog/',aliases:[s.slug,localize(s.label,lang)],series:s.slug,
    text:`Series ${s.number}: ${localize(s.title,lang)}. ${localize(s.description,lang)} (${s.members.length} ordered articles/notes.)`
  })));
}
