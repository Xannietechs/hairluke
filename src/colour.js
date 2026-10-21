export const shades=[{name:'Natural black',hex:'#231b18'},{name:'Chocolate',hex:'#65402e'},{name:'Caramel',hex:'#bd8a50'},{name:'Auburn',hex:'#9d4a32'},{name:'Burgundy',hex:'#742c48'}];
export function tintPixels(original,mask,hex,strength){
 if(mask.length*4!==original.length)throw Error('Mask and image dimensions differ');
 const colour=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));if(colour.some(Number.isNaN))throw Error('Invalid colour');
 const out=new Uint8ClampedArray(original),amount=Math.min(.9,Math.max(0,strength));
 for(let i=0;i<mask.length;i++){const j=i*4,alpha=Math.max(0,Math.min(1,(mask[i]/255-.4)/.45))*amount;if(!alpha)continue;const light=(original[j]*.2126+original[j+1]*.7152+original[j+2]*.0722)/255;const factor=.55+light*1.1;for(let c=0;c<3;c++)out[j+c]=original[j+c]*(1-alpha)+Math.min(255,colour[c]*factor)*alpha;}
 return out;
}
