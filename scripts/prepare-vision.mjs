import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),target=path.join(root,'public/vision');
await fs.mkdir(target,{recursive:true});
await fs.cp(path.join(root,'node_modules/@mediapipe/tasks-vision/wasm'),path.join(target,'wasm'),{recursive:true});
const file=path.join(target,'hair_segmenter.tflite');
try{const data=await fs.readFile(file);if(data.subarray(4,8).toString()!=='TFL3')throw Error('Invalid model');}
catch{const r=await fetch('https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite',{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error('Could not download the official MediaPipe hair model: '+r.status);const data=Buffer.from(await r.arrayBuffer());if(data.subarray(4,8).toString()!=='TFL3')throw Error('Downloaded file is not a TFLite model');await fs.writeFile(file,data)}
console.log('Local hair-preview assets ready. Photos are processed in the browser.');
