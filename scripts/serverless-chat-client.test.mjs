import test from 'node:test';
import assert from 'node:assert/strict';
import {createServerlessChatClient} from '../src/utils/serverless-chat-client.mjs';
test('prepared browser transport gets a session and sends once with same id, credentials and no retry',async()=>{
  const calls=[];
  const client=createServerlessChatClient({apiOrigin:'https://api.mapsycoy.com',fetchImpl:async(url,init)=>{calls.push({url:String(url),init});return new Response('{}',{status: calls.length===1?200:503});}});
  const id='00000000-0000-4000-8000-000000000001';
  assert.equal((await client.send({question:'test'},{requestId:id})).status,503);
  assert.equal(calls.length,2);assert.equal(calls[1].init.headers['Idempotency-Key'],id);assert.equal(calls[1].init.credentials,'include');
  assert.throws(()=>createServerlessChatClient({apiOrigin:'http://example.com'}));
});
test('cancellation while connecting never starts a charged POST',async()=>{
  const controller=new AbortController();let calls=0;
  const client=createServerlessChatClient({apiOrigin:'https://api.mapsycoy.com',fetchImpl:async()=>{calls++;controller.abort();return new Response('{}');}});
  await assert.rejects(client.send({question:'test'},{signal:controller.signal,requestId:'00000000-0000-4000-8000-000000000001'}),/abort/i);
  assert.equal(calls,1);
});
