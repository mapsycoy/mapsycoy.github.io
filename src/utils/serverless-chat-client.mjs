// Enabled only by an explicit public API origin at build time. This is an URL,
// never a provider secret. The Strict-cookie design needs a same-site API host.
export function createServerlessChatClient({apiOrigin,fetchImpl=fetch,uuid=()=>crypto.randomUUID()}) {
  const origin=new URL(apiOrigin);
  if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw Error('invalid_api_origin');
  let ready=false,connecting=null;
  async function connect(signal) {
    if(ready)return;
    if(!connecting)connecting=fetchImpl(new URL('/api/session',origin),{credentials:'include',signal,cache:'no-store'}).then(response=>{if(!response.ok)throw Error('session_unavailable');ready=true;}).finally(()=>{connecting=null;});
    await connecting;
  }
  return {async send(body,{signal,requestId=uuid()}={}) {
    await connect(signal);
    signal?.throwIfAborted();
    // Exactly one POST, including errors/timeouts. UI must reuse requestId when
    // retrying an uncertain submission, never generate a silent second charge.
    return fetchImpl(new URL('/api/chat',origin),{method:'POST',credentials:'include',cache:'no-store',signal,
      headers:{'Content-Type':'application/json','Idempotency-Key':requestId},body:JSON.stringify(body)});
  }};
}
