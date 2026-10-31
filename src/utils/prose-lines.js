// Decorative, deterministic strokes measured only after layout/font changes.
const root=document.querySelector('.home-manifesto');
if(root&&!root.dataset.inkInitialized){
 root.dataset.inkInitialized='true';
 const paragraphs=[...root.querySelectorAll('p')],ns='http://www.w3.org/2000/svg';
 let timer=0,fontsReady=false,lastSignature='',revision=0;
 const round=n=>Math.round(n*100)/100;
 function measure(p){
  const box=p.getBoundingClientRect(),threshold=parseFloat(getComputedStyle(p).lineHeight)*.35;
  const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),range=document.createRange(),lines=[];
  while(walker.nextNode()){
   const node=walker.currentNode;let offset=0;
   for(const char of node.textContent){
    const end=offset+char.length;
    if(char.trim()){
     range.setStart(node,offset);range.setEnd(node,end);
     for(const rect of range.getClientRects()){
      if(!rect.width||!rect.height)continue;
      const center=(rect.top+rect.bottom)/2;
      let line=lines.find(l=>Math.abs(l.center-center)<threshold);
      if(!line){line={left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,center};lines.push(line)}
      else{line.left=Math.min(line.left,rect.left);line.right=Math.max(line.right,rect.right);line.top=Math.min(line.top,rect.top);line.bottom=Math.max(line.bottom,rect.bottom)}
     }
    }
    offset=end;
   }
  }
  lines.sort((a,b)=>a.center-b.center);
  return{width:box.width,height:box.height,lines:lines.map((line,i)=>({left:round(line.left-box.left),right:round(line.right-box.left),bottom:round(line.bottom-box.top),y:round(Math.min(line.bottom+2.8,lines[i+1]?lines[i+1].top-2:Infinity)-box.top)}))};
 }
 function draw(){
  timer=0;if(!fontsReady||!root.isConnected)return;
  const layout=paragraphs.map(measure),signature=JSON.stringify(layout);
  if(signature===lastSignature)return;lastSignature=signature;
  layout.forEach((p,pi)=>{
   let svg=paragraphs[pi].querySelector('.manifesto-underlines');
   if(!svg){svg=document.createElementNS(ns,'svg');svg.classList.add('manifesto-underlines');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('preserveAspectRatio','none');paragraphs[pi].append(svg)}
   svg.setAttribute('viewBox',`0 0 ${p.width} ${p.height}`);
   const paths=p.lines.map((line,li)=>{
    const path=document.createElementNS(ns,'path'),w=line.right-line.left;
    const direction=(pi+li)%2?1:-1,wiggle=.3+((pi*7+li*3)%5)*.045;
    const x=t=>round(line.left+w*t),y=t=>round(line.y+t);
    path.setAttribute('d',`M${x(0)} ${y(direction*.15)} C${x(.16)} ${y(-direction*wiggle)} ${x(.34)} ${y(direction*wiggle)} ${x(.52)} ${y(direction*.08)} S${x(.83)} ${y(-direction*wiggle)} ${x(1)} ${y(direction*.18)}`);
    path.setAttribute('stroke-width',String(.62+((pi+li)%3)*.04));
    return path;
   });svg.replaceChildren(...paths);
  });
  root.dataset.inkLines=String(layout.reduce((sum,p)=>sum+p.lines.length,0));root.dataset.inkRevision=String(++revision);root.dataset.inkReady='true';
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(draw,80)}
 const observer=new ResizeObserver(schedule);observer.observe(root);
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('pageshow',schedule);
 document.fonts.addEventListener('loadingdone',schedule);
 document.fonts.ready.then(()=>{fontsReady=true;schedule()});
 window.addEventListener('pagehide',()=>clearTimeout(timer));
}
