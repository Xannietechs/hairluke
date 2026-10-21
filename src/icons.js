export const icon=(name)=>{const paths={sliders:'<path d="M4 7h4m4 0h8M4 17h8m4 0h4"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/>',sort:'<path d="M4 6h12M4 12h8M4 18h4M18 10v10m-3-3 3 3 3-3"/>',arrowUpRight:'<path d="M6 18 18 6M6 6h12v12"/>',refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 7a7 7 0 0 1 11.5-2L20 8M4 16l2.4 3A7 7 0 0 0 18 17"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',circle:'<circle cx="12" cy="12" r="8"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M5 12h14M12 5v14"/>',bag:'<path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',box:'<path d="m3 7 9-5 9 5v10l-9 5-9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/>',check:'<path d="m5 12 4 4L19 6"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>'};return `<svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.arrow}</svg>`};
export function enhanceIcons(root){
 const symbols={'✳':'spark','↗':'arrowUpRight','↻':'refresh','✓':'check','○':'circle','→':'arrow'};
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){const parent=node.parentElement;if(!parent||parent.closest('svg,script,style,textarea,option,input'))continue;let text=node.nodeValue;
 const close=parent.closest('button.close'),qty=parent.closest('.qty button');
 if(close&&text.includes('×')){parent.innerHTML=icon('close');continue}
 if(qty&&['−','+'].includes(text.trim())){parent.innerHTML=icon(text.trim()==='+'?'plus':'minus');continue}
 if(!/[✳↗↻✓○→]/u.test(text))continue;
 const fragment=document.createDocumentFragment();for(const part of text.split(/([✳↗↻✓○→])/u)){if(symbols[part]){const template=document.createElement('template');template.innerHTML=icon(symbols[part]);fragment.append(template.content)}else fragment.append(document.createTextNode(part))}node.replaceWith(fragment);
 }
}
