import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const read = file => fs.readFile(path.join(root, file), "utf8");
const decode = value => value.replace(/&(?:quot|#34|amp|lt|gt|#39);/g, match => ({"&quot;":'"',"&#34;":'"',"&amp;":"&","&lt;":"<","&gt;":">","&#39;":"'"})[match]);
const results = [];
for (const [lang, prefix] of [["en", ""], ["ko", "ko/"]]) {
  const html = await read(`dist/${prefix}index.html`);
  const match = html.match(/<portfolio-chat-preview[^>]*data-content="([^"]+)"/);
  assert.ok(match, `${lang} preview is opt-in and rendered`);
  assert.equal((html.match(/<textarea\b/g) || []).length, 1, "Landing has one primary composer");
  assert.doesNotMatch(html, /<dialog\b|data-chat-open|data-chat-close|type="file"/);
  assert.ok(!html.includes('<home-manifesto'), "Experimental landing replaces the manifesto");
  assert.match(html, /chat-input-outline/, "Composer has a code-native drawn outline");
  assert.doesNotMatch(html, /chat-input-echo/, "Composer has one perimeter with no stray/double strokes");
  const copy = JSON.parse(decode(match[1]));
  assert.equal(copy.examples, undefined, "No canned answers in the prompt interface");
  assert.equal(copy.reset, undefined, "No reset control copy");
  assert.match(copy.unavailable, lang === "ko" ? /실제 AI가 연결되지/ : /AI service is not connected/);
  assert.doesNotMatch(html, /chat-disclaimer|chat-privacy|data-chat-example|data-chat-reset|대화 흐름 시안|Conversation prototype/);
  results.push({lang, persistentHelperUI:false, cannedAnswers:false});
}
const client = await read("src/utils/chat-preview.ts");
assert.doesNotMatch(client, /\b(XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|getUserMedia|speechSynthesis)\b/);
assert.match(client, /fetch\("http:\/\/127\.0\.0\.1:4352\/api\/chat"/);
assert.doesNotMatch(client, /GEMINI_API_KEY|generativelanguage|x-goog-api-key|OPENAI_API_KEY/);
assert.doesNotMatch(client, /innerHTML|insertAdjacentHTML/);
assert.doesNotMatch(client,/scrollIntoView/,'New replies cannot force the whole page to scroll');
assert.match(client,/historyPane\.scrollHeight-historyPane\.clientHeight-historyPane\.scrollTop<=32/,'Follow only a reader near the bottom');
const chatStyle=await read('src/components/PortfolioChatPreview.astro');
assert.match(chatStyle,/prefers-reduced-motion:reduce.*chat-loading path.*animation:none; opacity:1/s,'Reduced motion keeps three static dots');
assert.match(chatStyle,/\.chat-conversation.*overflow-y:auto/s,'Conversation has its own scrolling area');
assert.match(chatStyle,/\.chat-conversation\s*\{[^}]*scrollbar-width:none;[^}]*-ms-overflow-style:none;/,'Firefox and legacy Microsoft scrollbars are visually hidden');
assert.match(chatStyle,/\.chat-conversation::\-webkit-scrollbar\s*\{[^}]*display:none;/,'WebKit scrollbar is visually hidden');
assert.match(chatStyle,/data-chat-conversation tabindex="0"/,'History remains keyboard focusable');
assert.match(chatStyle,/home-main:has\(portfolio-chat-preview\).*overflow:clip/,'Main cannot be invisibly scrolled by textarea focus');
assert.doesNotMatch(client, /prepareGrounding|renderGroundedText|search_suggestions|chat-search-suggestions/, 'Google search rendering removed from active client');
assert.match(client, /!event\.isComposing\s*&&\s*event\.keyCode\s*!==\s*229/, "IME confirmation does not send");
const robot = await read("src/components/HomeFooterSketch.astro");
const bubble = robot.match(/<div class="sketch-chat-bubble"[^>]*>(.*?)<\/div>/s)?.[1];
assert.equal((bubble.match(/<i><\/i>/g) || []).length, 3, "Robot bubble contains exactly three decorative dots");
assert.equal(bubble.replace(/<[^>]+>/g, "").trim(), "", "Robot bubble has no text");
assert.match(bubble, /<svg.*?<path/s, "Bubble silhouette is a drawn SVG path");
assert.match(robot, /sketch-antenna-waves/);
assert.match(robot, /@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(robot, /position:\s*fixed/, "Robot remains anchored to the footer while listening");
const production = process.argv.includes('--production');
const prod = production ? undefined : process.argv[2];
if (prod) for (const prefix of ["", "ko/", "en/"]) {
  const html = await fs.readFile(path.join(prod, prefix, "index.html"), "utf8");
  assert.ok(!html.includes("<portfolio-chat-preview"), "Default production build excludes the experiment");
}
for(const file of await fs.readdir(path.join(root,'dist/_astro'))){if(file.endsWith('.js'))assert.doesNotMatch(await read(`dist/_astro/${file}`),/OPENAI_API_KEY|GEMINI_API_KEY|x-goog-api-key|generativelanguage\.googleapis\.com|api\.openai\.com\/v1/,'No provider credentials or endpoint in frontend artifacts');}
if(production){
  const walk=async dir=>(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();
  const files=await walk(path.join(root,'dist'));
  let apiBundle=false;
  for(const file of files){
    const relative=path.relative(path.join(root,'dist'),file).replaceAll('\\','/');
    assert.doesNotMatch(relative,/(?:^|\/)(?:server|\.local|archive|experiments)\/|history-db\.json|timeline\.txt|corpus\.json/i,'Server knowledge must not be a public artifact');
    if(!/\.(?:js|html|json|map)$/.test(file))continue;
    const value=await fs.readFile(file,'utf8');
    assert.doesNotMatch(value,/sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}|OPENAI_API_KEY|SESSION_SECRET|CLOUDFLARE_API_TOKEN|C:\\\\Users\\\\mapsycoy|api\.openai\.com\/v1|history-db\.json/,'No credentials or internal data in public artifact');
    if(file.endsWith('.js')&&value.includes('https://api.mapsycoy.com'))apiBundle=true;
  }
  assert.ok(apiBundle,'Production bundle includes the approved same-site API origin');
}
console.log(JSON.stringify({passed:true, results, productionApiChecked:production, noChatPersistence:true, safeText:true, bubbleDotsOnly:true, productionGateChecked:!!prod},null,2));
