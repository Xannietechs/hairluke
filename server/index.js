import app from './app.js';
import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(process.env.NODE_ENV==='production'){
 app.use(express.static(path.join(root,'dist')));
 app.get('/{*path}',(req,res)=>res.sendFile(path.join(root,'dist/index.html')));
}else{
 const {createServer}=await import('vite');
 const vite=await createServer({root,server:{middlewareMode:true},appType:'spa'});
 app.use(vite.middlewares);
}
app.listen(Number(process.env.PORT||5173),process.env.HOST||'127.0.0.1',()=>console.log('Hairluke: http://localhost:'+(process.env.PORT||5173)));
