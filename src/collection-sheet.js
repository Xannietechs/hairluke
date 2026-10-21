import {icon} from './icons.js';
export function openCollectionSheet({panel,title,trigger,applyLabel='Show results',onApply=()=>{},onDismiss=()=>{}}){
 let applied=false;
 const marker=document.createComment('collection panel');panel.before(marker);
 const dialog=document.createElement('dialog');dialog.className='collection-sheet';dialog.setAttribute('aria-labelledby','collection-sheet-title');
 dialog.innerHTML='<div class="sheet-handle" aria-hidden="true"></div><div class="sheet-heading"><h2 id="collection-sheet-title"></h2><button class="sheet-close" aria-label="Close '+title+'">'+icon('close')+'</button></div><div class="sheet-content"></div><div class="sheet-footer"><button class="sheet-dismiss">Close</button><button class="primary sheet-apply"></button></div>';
 dialog.querySelector('h2').textContent=title;dialog.querySelector('.sheet-apply').textContent=applyLabel;
 dialog.querySelector('.sheet-content').append(panel);panel.classList.remove('hidden');document.querySelector('#app').append(dialog);
 const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';trigger.setAttribute('aria-expanded','true');
 dialog.addEventListener('close',()=>{if(!applied)onDismiss();panel.classList.add('hidden');marker.replaceWith(panel);document.body.style.overflow=previousOverflow;trigger.setAttribute('aria-expanded','false');dialog.remove();trigger.focus()},{once:true});
 dialog.querySelector('.sheet-close').onclick=()=>dialog.close();dialog.querySelector('.sheet-dismiss').onclick=()=>dialog.close();dialog.querySelector('.sheet-apply').onclick=()=>{onApply();applied=true;dialog.close()};
 dialog.onclick=e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}};
 dialog.showModal();dialog.querySelector('.sheet-close').focus();return dialog;
}
