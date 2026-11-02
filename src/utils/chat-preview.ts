import type { getChatPreview } from "../data/chatPreview";
import {isPublicChatLink} from './chat-public-links.mjs';
import {createServerlessChatClient} from './serverless-chat-client.mjs';
const publicApiOrigin=import.meta.env.PUBLIC_PORTFOLIO_API_ORIGIN;
type Content = ReturnType<typeof getChatPreview>;
type PublicLink = {label:string;url:string};
type HistoryTurn = {role:'user'|'assistant';content:string;reference?:string};
class PortfolioChatPreview extends HTMLElement {
  private events?: AbortController;
  connectedCallback() {
    if (this.events) return;
    const localPreview=["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
    if (!publicApiOrigin&&!localPreview) { this.remove(); return; }
    const remote=publicApiOrigin?createServerlessChatClient({apiOrigin:publicApiOrigin}):null;
    // Remove legacy citations from both DOM and accessibility tree on reconnect.
    this.querySelectorAll('.chat-citations,.chat-source').forEach(node=>node.remove());
    this.events = new AbortController();
    const { signal } = this.events;
    const copy: Content = JSON.parse(this.dataset.content!);
    const form = this.querySelector<HTMLFormElement>("form")!;
    const input = this.querySelector<HTMLTextAreaElement>("textarea")!;
    const submit = this.querySelector<HTMLButtonElement>(".chat-submit")!;
    const invitation = this.querySelector<HTMLHeadingElement>("h1")!;
    const messages = this.querySelector<HTMLElement>("[data-chat-messages]")!;
    const historyPane = this.querySelector<HTMLElement>('[data-chat-conversation]')!;
    const composerArea = this.querySelector<HTMLElement>('.chat-composer-area')!;
    const error = this.querySelector<HTMLElement>("[data-chat-error]")!;
    const wrap = this.querySelector<HTMLElement>(".chat-input-wrap")!;
    // Measure the inline width in both layouts so moving the button cannot
    // change its own threshold. This is local text measurement, never logging.
    const measure = document.createElement("div");
    measure.setAttribute("aria-hidden","true");
    Object.assign(measure.style,{position:"fixed",left:"-10000px",top:"0",visibility:"hidden",pointerEvents:"none",whiteSpace:"pre-wrap",overflowWrap:"anywhere",padding:"0",border:"0"});
    this.append(measure);
    let reactionTimer: number | undefined;
    let count = 0, composing = false;
    let conversation: HistoryTurn[] = [];
    let pending: {controller:AbortController; body:HTMLElement} | undefined;
    let placementAnimation:Animation|undefined;
    let followTail=true;
    const scrollTail=()=>{if(followTail)historyPane.scrollTop=Math.max(0,historyPane.scrollHeight-historyPane.clientHeight);};
    historyPane.addEventListener('scroll',()=>{followTail=historyPane.scrollHeight-historyPane.clientHeight-historyPane.scrollTop<=32;},{signal});
    const robot = (state: string) => {
      window.clearTimeout(reactionTimer); reactionTimer = undefined;
      document.dispatchEvent(new CustomEvent("mapsycoy:chat-preview-state", { detail: { state } }));
    };
    const setBusy = (busy:boolean) => {
      this.dataset.pending=String(busy); messages.setAttribute("aria-busy",String(busy));
      submit.setAttribute("aria-label",busy?copy.cancel:copy.submit);
    };
    const cancel = (visible=true) => {
      const old=pending; pending=undefined;
      if(old){old.controller.abort();if(visible)old.body.textContent=copy.cancelled;}
      setBusy(false);robot("closed");scrollTail();
    };
    const viewport = () => {
      const height = window.visualViewport?.height ?? innerHeight;
      this.dataset.keyboard = String(height < 540 && innerWidth < 781);
      document.documentElement.style.setProperty("--chat-viewport-height", `${height}px`);
      document.documentElement.style.setProperty("--chat-keyboard-inset", `${Math.max(0, innerHeight - height - (window.visualViewport?.offsetTop ?? 0))}px`);
    };
    const sizeInput = () => {
      if(signal.aborted)return;
      wrap.dataset.stacked="false";input.style.height="26px";
      const style=getComputedStyle(input),box=getComputedStyle(wrap);
      const inlineWidth=wrap.clientWidth-parseFloat(box.paddingLeft)-parseFloat(box.paddingRight)-submit.getBoundingClientRect().width-8;
      Object.assign(measure.style,{width:`${Math.max(1,inlineWidth)}px`,font:style.font,lineHeight:style.lineHeight,letterSpacing:style.letterSpacing,wordBreak:style.wordBreak});
      measure.textContent=input.value+"\u200b";
      wrap.dataset.stacked=String(measure.getBoundingClientRect().height>parseFloat(style.lineHeight)+1);
      input.style.height="0px";
      input.style.height=`${Math.max(26,input.scrollHeight)}px`;
      const available=Math.max(80,this.clientHeight-64);
      this.style.setProperty('--chat-composer-max-height',`${available}px`);
      const overflow=wrap.getBoundingClientRect().height+error.getBoundingClientRect().height>available;
      composerArea.dataset.overflow=String(overflow);
      // The textarea never clips or gets its own scrollbar. Only exceptionally
      // tall drafts scroll their outer composer area, within the fixed shell.
      if(overflow&&input.selectionStart===input.value.length)composerArea.scrollTop=composerArea.scrollHeight;
      if(!overflow)composerArea.scrollTop=0;
      scrollTail();
    };
    const clear = () => {
      placementAnimation?.cancel();placementAnimation=undefined;
      cancel(false);count = 0; composing = false; conversation=[]; messages.replaceChildren(); error.textContent = "";
      input.value = ""; input.removeAttribute("aria-invalid");
      delete this.dataset.hasMessages; invitation.hidden = false;followTail=true;historyPane.scrollTop=0; sizeInput();
    };
    const addMessage = (label: string, text: string, question = false) => {
      const article = document.createElement("div"); article.className = `chat-message${question ? " chat-message-question" : ""}`;
      const heading = document.createElement("span"); heading.className = "sr-only"; heading.textContent = `${label}: `;
      const body = document.createElement("div"); body.className = "chat-message-body"; body.textContent = text;
      article.append(heading, body); messages.append(article); return {article,body};
    };
    const showPending = (body:HTMLElement) => {
      const loading=document.createElement('span');loading.className='chat-loading';loading.setAttribute('role','status');
      const description=document.createElement('span');description.className='sr-only';description.textContent=copy.pending;
      const dots=document.createElementNS('http://www.w3.org/2000/svg','svg');
      dots.setAttribute('viewBox','0 0 36 16');dots.setAttribute('aria-hidden','true');dots.setAttribute('focusable','false');
      // Fixed, slightly uneven ink marks. Animation changes only opacity, so
      // there is no layout movement or per-frame random geometry.
      for(const shape of [
        'M4.2 7.8Q4 5.8 6 5.7Q8.1 5.6 8.2 7.7Q8.1 9.8 6.1 9.9Q4.1 10 4.2 7.8Z',
        'M16.1 8Q15.9 6 17.9 5.9Q20 5.7 20.1 7.8Q20.3 9.8 18.2 10Q16.2 10.1 16.1 8Z',
        'M28 7.7Q28.1 5.7 30.1 5.8Q32.1 5.6 32.2 7.9Q32 10 29.9 9.8Q27.9 9.7 28 7.7Z'
      ]){const dot=document.createElementNS('http://www.w3.org/2000/svg','path');dot.setAttribute('d',shape);dots.append(dot);}
      loading.append(description,dots);body.replaceChildren(loading);
    };
    const renderLinks = (body:HTMLElement,links:PublicLink[]) => {
      for(const item of links){
        const link=document.createElement('a');link.href=item.url;link.textContent=item.label;link.rel='noreferrer';
        body.append(document.createTextNode(' '),link);
      }
    };
    form.addEventListener("submit", async event => {
      event.preventDefault(); if(composing)return;
      if(pending){cancel();return;}
      const question=input.value.trim();
      if(!question||question.length>600){error.textContent=copy.empty;input.setAttribute("aria-invalid","true");input.focus();return;}
      if(!remote&&count>=12){error.textContent=copy.limit;return;}
      const firstSubmission=!this.dataset.hasMessages;
      const initialBottom=firstSubmission?composerArea.getBoundingClientRect().bottom:0;
      error.textContent="";input.removeAttribute("aria-invalid");
      addMessage(copy.you,question,true);count++;this.dataset.hasMessages="true";invitation.hidden=true;
      input.value="";sizeInput();
      const notice=addMessage(copy.noticeLabel,''), controller=new AbortController();showPending(notice.body);
      pending={controller,body:notice.body};setBusy(true);robot("thinking");sizeInput();scrollTail();
      if(firstSubmission&&typeof composerArea.animate==='function'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        placementAnimation=composerArea.animate([{transform:`translateY(${initialBottom-composerArea.getBoundingClientRect().bottom}px)`},{transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
      let timedOut=false;
      const timeout=window.setTimeout(()=>{timedOut=true;controller.abort();},25000);
      const history=conversation.slice(-4);
      try {
        const body={question,language:document.documentElement.lang==="ko"?"ko":"en",history};
        // Deployment is opt-in at build time. Local previews retain their own
        // endpoint and cumulative test budget; no automatic retry or fallback.
        const response=remote?await remote.send(body,{signal:controller.signal}):await fetch("http://127.0.0.1:4352/api/chat",{method:"POST",mode:"cors",credentials:"omit",redirect:"error",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:controller.signal});
        const raw=await response.text();if(raw.length>16000)throw new Error("invalid_response");
        const answer=JSON.parse(raw);
        if(pending?.controller!==controller)return;
        if(!["answer","unconfigured","refused","quota","error","cancelled","invalid","duplicate","session_required"].includes(answer.kind)||answer.sources!==undefined||answer.grounding!==undefined||(answer.presentation!==undefined&&answer.presentation!=='conversation')||typeof answer.message!=="string"||answer.message.length>900||!Array.isArray(answer.links)||answer.links.length>3||answer.links.some((s:PublicLink)=>typeof s.label!=="string"||s.label.length>300||!isPublicChatLink(s.url))||(answer.reference!==undefined&&(typeof answer.reference!=='string'||!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(answer.reference))))throw new Error("invalid_response");
        notice.body.textContent=answer.message;
        if(response.ok&&answer.kind==="answer"){
          renderLinks(notice.body,answer.links);
          conversation.push({role:'user',content:question},{role:'assistant',content:answer.message,...(answer.reference?{reference:answer.reference}:{})});
          conversation=conversation.slice(-4);
          sizeInput();robot("replying");
          reactionTimer=window.setTimeout(()=>robot(input.value?"listening":"closed"),2400);
        }else {robot("closed");scrollTail();}
      }catch{
        if(pending?.controller===controller){notice.body.textContent=timedOut?copy.failed:controller.signal.aborted?copy.cancelled:copy.failed;robot("closed");scrollTail();}
      }finally{
        window.clearTimeout(timeout);
        if(pending?.controller===controller){pending=undefined;setBusy(false);}
      }
    },{signal});
    input.addEventListener("keydown",event=>{
      if(event.key==="Enter"&&!event.shiftKey&&!event.isComposing&&event.keyCode!==229){event.preventDefault();form.requestSubmit();}
      if(event.key==="Escape"&&!event.isComposing){cancel();input.blur();}
    },{signal});
    input.addEventListener("compositionstart",()=>{composing=true;},{signal});
    input.addEventListener("compositionend",()=>{composing=false;},{signal});
    input.addEventListener("focus",()=>robot(pending?"thinking":input.value?"listening":"idle"),{signal});
    input.addEventListener("blur",()=>robot("closed"),{signal});
    input.addEventListener("input",()=>{if(pending)cancel();error.textContent="";input.removeAttribute("aria-invalid");sizeInput();robot(input.value?"listening":"idle");},{signal});
    window.visualViewport?.addEventListener("resize",()=>{viewport();sizeInput();},{signal});
    window.visualViewport?.addEventListener("scroll",viewport,{signal});
    window.addEventListener("resize",()=>{viewport();sizeInput();},{signal});
    window.addEventListener("pagehide",clear,{signal});
    window.addEventListener("pageshow",event=>{if(event.persisted)clear();viewport();},{signal});
    document.fonts?.ready.then(()=>{if(!signal.aborted)sizeInput();});
    document.fonts?.addEventListener("loadingdone",sizeInput,{signal});
    let resizeObserver:ResizeObserver|undefined,lastWidth=wrap.clientWidth;
    if(typeof ResizeObserver!=="undefined"){
      resizeObserver=new ResizeObserver(()=>{if(wrap.clientWidth!==lastWidth){lastWidth=wrap.clientWidth;sizeInput();}});
      resizeObserver.observe(wrap);
    }
    signal.addEventListener("abort",()=>{clear();resizeObserver?.disconnect();measure.remove();document.documentElement.style.removeProperty("--chat-viewport-height");document.documentElement.style.removeProperty("--chat-keyboard-inset");},{once:true});
    viewport();sizeInput();setBusy(false);
  }
  disconnectedCallback(){this.events?.abort();this.events=undefined;}
}
if(!customElements.get("portfolio-chat-preview"))customElements.define("portfolio-chat-preview",PortfolioChatPreview);
