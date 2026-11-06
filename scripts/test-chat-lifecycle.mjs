// Event-level mock regression, not native IME/device validation. No network.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {build} from 'esbuild';
import {isPublicChatLink} from '../src/utils/chat-public-links.mjs';
const production=process.argv.includes('--production');
for(const host of ['mapsycoy.com','mapsycoy.github.io'])for(const prefix of ['','ko/']){
 assert.equal(isPublicChatLink(`https://${host}/${prefix}blog/`),true);
 assert.equal(isPublicChatLink(`https://${host}/${prefix}blog/21/`),true);
}
for(const url of ['https://mapsycoy.com.evil.test/ko/blog/','https://evil.test/ko/blog/','http://mapsycoy.com/ko/blog/','https://mapsycoy.com/admin/','https://mapsycoy.com/ko/blog/?next=https://evil.test','https://mapsycoy.com/ko/blog/../admin/','https://mapsycoy.com@evil.test/ko/blog/','javascript:alert(1)','file:///private'])assert.equal(isPublicChatLink(url),false,url);
// Captured public production response: a series index and its article together.
const seriesLinks=JSON.parse(await fs.readFile(new URL('./fixtures/chat-series-links.json',import.meta.url),'utf8'));
const placements=[];let reducedMotion=false;
class Node extends EventTarget {
 dataset={};children=[];hidden=false;value='';text='';attributes=new Map();nodes=new Map();
 scrollHeight=26;clientWidth=740;clientHeight=500;scrollTop=0;style={setProperty(){},removeProperty(){}};
 get textContent(){return this.text+this.children.map(n=>n.textContent).join('');}
 set textContent(v){this.text=String(v);this.children=[];}
 querySelector(s){return this.nodes.get(s);}
 querySelectorAll(){return this.children.filter(n=>['chat-citations','chat-source'].includes(n.className));}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}
 replaceChildren(...nodes){this.text='';this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attributes.set(k,v);} removeAttribute(k){this.attributes.delete(k);}
 focus(){this.dispatchEvent(new Event('focus'));} blur(){this.dispatchEvent(new Event('blur'));}
 requestSubmit(){this.dispatchEvent(new Event('submit',{cancelable:true}));}
 get firstElementChild(){return this.children[0]??null;}
 getBoundingClientRect(){return {top:300,bottom:326,width:40,height:26};}
 remove(){this.removed=true;if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.children=[];}
 animate(frames,options){placements.push({frames,options});return {cancel(){}};}
}
const registry=new Map(),document=new Node(),window=new Node();
document.documentElement=new Node();document.documentElement.lang='ko';document.createElement=()=>new Node();document.createElementNS=()=>new Node();document.createTextNode=t=>Object.assign(new Node(),{textContent:t});
window.visualViewport=new Node();window.visualViewport.height=900;window.visualViewport.offsetTop=0;window.setTimeout=setTimeout;window.clearTimeout=clearTimeout;window.matchMedia=()=>({matches:reducedMotion});
const states=[];document.addEventListener('mapsycoy:chat-preview-state',e=>states.push(e.detail.state));
const sentBodies=[],reference='11111111-1111-4111-8111-111111111111';let mode='unconfigured',requestCount=0,cancelled=0;
const fetchMock=async(url,options)=>{
 if(production&&String(url)==='https://api.mapsycoy.com/api/session')return {ok:true};
 assert.equal(String(url),production?'https://api.mapsycoy.com/api/chat':'http://127.0.0.1:4352/api/chat');
 if(production){assert.equal(options.credentials,'include');assert.match(options.headers['Idempotency-Key'],/^[a-f0-9-]{36}$/);}
 requestCount++;sentBodies.push(JSON.parse(options.body));
 if(mode==='pending')return new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>{cancelled++;reject(Error('aborted'));},{once:true}));
 if(mode==='failure')throw Error('offline');
 let body={kind:'unconfigured',message:'AI not connected',links:[]};
 if(mode==='answer')body={kind:'answer',message:'A reply.',links:[]};
 if(mode==='conversation')body={kind:'answer',presentation:'conversation',message:'A grounded reply.',reference,links:[]};
 if(mode==='bad-grounding')body={kind:'answer',message:'Unsafe.',links:[],grounding:{}};
 if(mode==='bad-external')body={kind:'answer',message:'Unsafe.',links:[{label:'Spoof',url:'https://mapsycoy.tistory.com.evil.test/42'}]};
 if(mode==='public-links')body={kind:'answer',message:'Requested pages.',reference,links:[{label:'Article',url:'https://mapsycoy.github.io/ko/blog/19/'},{label:'Tistory',url:'https://mapsycoy.tistory.com/42'}]};
 if(mode==='series-links')body={...seriesLinks,reference};
 if(mode==='source-unavailable')body={kind:'unavailable',message:'최신 공개 자료를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.',links:[]};
 if(mode==='bad-history')body={kind:'answer',message:'Internal.',links:[{label:'Internal',url:'https://github.com/owner/source'}]};
 if(mode==='legacy-source')body={kind:'answer',message:'Legacy.',links:[],sources:[{id:'internal',url:'file:///private'}]};
 return {ok:body.kind==='answer',text:async()=>JSON.stringify(body)};
};
const compiled=await build({entryPoints:['src/utils/chat-preview.ts'],bundle:true,write:false,format:'iife',platform:'browser',define:{'import.meta.env.PUBLIC_PORTFOLIO_API_ORIGIN':JSON.stringify(production?'https://api.mapsycoy.com':'')}});
vm.runInNewContext(compiled.outputFiles[0].text,{HTMLElement:Node,window,document,crypto:globalThis.crypto,location:{hostname:production?'mapsycoy.com':'127.0.0.1'},innerHeight:900,innerWidth:1440,getComputedStyle:()=>({font:'15px sans-serif',lineHeight:'26px',letterSpacing:'normal',wordBreak:'normal',paddingLeft:'23px',paddingRight:'14px'}),AbortController,CustomEvent,URL,fetch:fetchMock,customElements:{get:n=>registry.get(n),define:(n,t)=>registry.set(n,t)}});
const Chat=registry.get('portfolio-chat-preview'),chat=new Chat(),form=new Node(),input=new Node(),invitation=new Node(),messages=new Node(),error=new Node(),submit=new Node(),historyPane=new Node(),composerArea=new Node();
chat.nodes=new Map([['form',form],['textarea',input],['h1',invitation],['[data-chat-messages]',messages],['[data-chat-error]',error],['.chat-submit',submit],['.chat-input-wrap',new Node()],['[data-chat-conversation]',historyPane],['.chat-composer-area',composerArea]]);
chat.dataset.content=JSON.stringify({you:'Question',noticeLabel:'Status',submit:'Send',cancel:'Cancel',cancelled:'Cancelled',pending:'Requesting',failed:'Unavailable',empty:'Write a question',limit:'Limit'});
const legacy=new Node();legacy.className='chat-citations';legacy.append(Object.assign(new Node(),{href:'https://github.com/owner/internal'}));chat.append(legacy);
chat.connectedCallback();assert.equal(legacy.removed,true);assert.ok(!chat.children.includes(legacy));assert.equal(legacy.children.length,0);chat.connectedCallback();
const key=extra=>{const e=new Event('keydown',{cancelable:true});Object.assign(e,{key:'Enter',shiftKey:false,isComposing:false,keyCode:13},extra);input.dispatchEvent(e);};
const settle=()=>new Promise(r=>setImmediate(r));
const send=async(text,kind='answer')=>{mode=kind;input.value=text;key({});await settle();return messages.children.at(-1);};
form.requestSubmit();assert.equal(messages.children.length,0);assert.equal(invitation.hidden,false);
input.value='한글 조합 중';input.dispatchEvent(new Event('input'));assert.equal(invitation.hidden,false);assert.equal(states.at(-1),'listening');
input.dispatchEvent(new Event('compositionstart'));form.requestSubmit();key({isComposing:true,keyCode:229});assert.equal(messages.children.length,0);input.dispatchEvent(new Event('compositionend'));
key({isComposing:true});key({keyCode:229});key({shiftKey:true});assert.equal(messages.children.length,0);
key({});const first=messages.children[1].children[1],loading=first.children[0];assert.equal(loading.className,'chat-loading');assert.equal(loading.attributes.get('role'),'status');assert.equal(loading.children[0].className,'sr-only');assert.equal(loading.children[1].children.length,3);assert.equal(states.at(-1),'thinking');
await settle();assert.equal(first.textContent,'AI not connected');assert.equal(first.children.length,0);assert.equal(requestCount,1);assert.equal(invitation.hidden,true);assert.equal(placements.length,1);input.blur();assert.equal(states.at(-1),'closed');assert.equal(invitation.hidden,true);
const second=await send('second');assert.equal(second.children.length,2);assert.equal(second.children[1].textContent,'A reply.');assert.equal(states.at(-1),'replying');
mode='pending';input.value='third';key({});await settle();key({key:'Escape'});await settle();assert.equal(cancelled,1);assert.equal(chat.dataset.pending,'false');assert.equal(messages.children.at(-1).children[1].textContent,'Cancelled');
mode='pending';input.value='fourth';key({});await settle();input.value='draft';input.dispatchEvent(new Event('input'));await settle();assert.equal(cancelled,2);assert.equal(states.at(-1),'listening');
const failed=await send('fifth','failure');assert.equal(failed.children[1].textContent,'Unavailable');assert.equal(failed.children[1].children.length,0);
mode='pending';input.value='sixth';key({});await settle();window.dispatchEvent(new Event('pagehide'));await settle();assert.equal(cancelled,3);assert.equal(messages.children.length,0);assert.equal(invitation.hidden,false);assert.equal(states.at(-1),'closed');
reducedMotion=true;await send('unsafe','bad-grounding');assert.equal(placements.length,1);assert.equal(messages.children.at(-1).children[1].textContent,'Unavailable');
const conversational=await send('김준엽을 소개해 줘','conversation');assert.equal(conversational.children.length,2);assert.equal(conversational.children[1].textContent,'A grounded reply.');
historyPane.scrollHeight=1400;historyPane.scrollTop=100;historyPane.dispatchEvent(new Event('scroll'));await send('그중 두 번째를 더 알려줘');assert.equal(historyPane.scrollTop,100);assert.equal(sentBodies.at(-1).history[1].reference,reference);assert.equal(sentBodies.at(-1).history[1].sourceIds,undefined);
await send('spoof','bad-external');assert.equal(messages.children.at(-1).children[1].textContent,'Unavailable');
historyPane.scrollTop=900;historyPane.dispatchEvent(new Event('scroll'));historyPane.scrollHeight=1600;await send('follow bottom');assert.equal(historyPane.scrollTop,1100);
const linked=await send('원문 링크를 보여줘','public-links');assert.equal(linked.children.length,2);assert.equal(linked.children[1].children[1].href,'https://mapsycoy.github.io/ko/blog/19/');assert.equal(linked.children[1].children[3].href,'https://mapsycoy.tistory.com/42');assert.equal(linked.children[1].children[1].rel,'noreferrer');
const seriesLinked=await send('그 시리즈의 글 제목과 원문 링크를 알려줘.','series-links');
assert.ok(seriesLinked.children[1].textContent.startsWith(seriesLinks.message),'A valid series link must not discard the entire answer');
assert.deepEqual(seriesLinked.children[1].children.filter(n=>n.href).map(n=>n.href),seriesLinks.links.map(l=>l.url));
await send('그 글을 설명해 줘');assert.equal(sentBodies.at(-1).history.at(-1).reference,reference);
const unavailable=await send('현재 자료를 알려줘','source-unavailable');
assert.equal(unavailable.children[1].textContent,'최신 공개 자료를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.');
assert.equal(unavailable.children[1].children.length,0);
for(const invalid of ['bad-history','legacy-source']){const result=await send('invalid fixture',invalid);assert.equal(result.children.length,2);assert.equal(result.children[1].textContent,'Unavailable');assert.equal(result.children[1].children.length,0);}
chat.disconnectedCallback();
console.log(JSON.stringify({passed:true,compositionAndShiftEnter:true,initialCenterAndFirstValidSubmit:true,loadingDotsCleanup:true,repeatAndCancelCleanup:true,noForcedHistoryJump:true,legacyCardsRemovedFromDOM:true,noAutomaticCitationLists:true,onlyRequestedPublicLinks:true,seriesIndexAndArticleLinks:true,unavailableMessagePreserved:true,opaqueHistoryReferences:true,internalAndSpoofLinksRejected:true,reducedMotion:true,nativeIME:false},null,2));
