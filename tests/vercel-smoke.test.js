import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
// Set dummy server values before loading the API. No remote requests are made.
process.env.SUPABASE_SERVICE_ROLE_KEY='test-only-not-a-real-key';
process.env.VITE_SUPABASE_URL='https://example.supabase.co';
process.env.VITE_SUPABASE_PUBLISHABLE_KEY='test-only';
process.env.YOCO_WEBHOOK_SECRET='whsec_'+Buffer.from('webhook-test-only').toString('base64');
process.env.STORE_READY='false';
const {default:app}=await import('../api/index.js');
test('Vercel API export preserves routing, admin protection and raw webhook signatures',async()=>{
 const server=app.listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const admin=await fetch(base+'/api/admin');assert.equal(admin.status,401);
  const blocked=await fetch(base+'/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(blocked.status,503);
  const unknown=await fetch(base+'/api/missing');assert.equal(unknown.status,404);assert.match(unknown.headers.get('content-type'),/json/);
  const unsigned=await fetch(base+'/api/webhooks/yoco',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(unsigned.status,403);
  const body='{ "type": "integration.test" }',timestamp=String(Math.floor(Date.now()/1000)),id='integration-event';
  const signature=crypto.createHmac('sha256',Buffer.from('webhook-test-only')).update(id+'.'+timestamp+'.'+body).digest('base64');
  const signed=await fetch(base+'/api/webhooks/yoco',{method:'POST',headers:{'Content-Type':'application/json','webhook-id':id,'webhook-timestamp':timestamp,'webhook-signature':'v1,'+signature},body});
  assert.equal(signed.status,204);
 }finally{await new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()))}
});
