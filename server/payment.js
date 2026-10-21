import crypto from 'node:crypto';
export function verifyWebhook(headers,raw,secret,now=Date.now()){
 if(!secret||!Buffer.isBuffer(raw))return false;
 const id=headers['webhook-id'],timestamp=headers['webhook-timestamp'],signature=headers['webhook-signature'];
 if(!id||!timestamp||!signature||!/^\d+$/.test(timestamp)||Math.abs(now/1000-Number(timestamp))>180)return false;
 const expected=crypto.createHmac('sha256',Buffer.from(secret.replace(/^whsec_/,''),'base64')).update(id+'.'+timestamp+'.').update(raw).digest();
 return signature.split(' ').some(s=>{const [v,value]=s.split(',');if(v!=='v1'||!value)return false;const got=Buffer.from(value,'base64');return got.length===expected.length&&crypto.timingSafeEqual(got,expected)});
}
