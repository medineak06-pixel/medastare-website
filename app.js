(()=>{
'use strict';
const body=document.body,header=document.querySelector('#header'),progress=document.querySelector('#progress');
// The decorative double-line hamburger was intentionally removed at the founder's request.
// The existing header CTA and the cities anchor remain usable.
function update(){const y=window.scrollY;header.classList.toggle('is-scrolled',y>15);const available=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.width=(Math.min(100,y/available*100))+'%'}
window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});update();
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px 60px 0px'});
 document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));body.classList.add('js-ready');
 // No hidden content forever when loading directly from a ZIP extracted folder.
 setTimeout(()=>document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el=>{let r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('revealed')}),500);
}
let timeout;const toast=document.querySelector('#toast');function notify(msg){toast.textContent=msg;toast.classList.add('visible');clearTimeout(timeout);timeout=setTimeout(()=>toast.classList.remove('visible'),4400)}
// Live Google Play store URL verified. iOS listing has not yet been independently verified.
const googlePlay='https://play.google.com/store/apps/details?id=com.medastare.app';
document.querySelectorAll('[data-store="android"]').forEach(a=>{a.href=googlePlay;a.target='_blank';a.rel='noopener noreferrer'});
document.querySelectorAll('[data-store="ios"]').forEach(a=>{a.href='https://apps.apple.com/app/id6813994639';a.setAttribute('aria-label','Download MedaStaré on the App Store')});
document.querySelectorAll('[data-social]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();notify('Resmi sosyal medya bağlantısı henüz eklenmedi.') }));
document.querySelector('#year').textContent=new Date().getFullYear();
})();


// MedaStaré V2 editorial art viewer: supports click, keyboard and touch navigation.
(()=>{
 const cards=[...document.querySelectorAll('.edit__item[data-art]')];
 const viewer=document.getElementById('artviewer');
 if(!viewer||!cards.length)return;
 const photo=viewer.querySelector('.artviewer__img');
 const title=viewer.querySelector('.artviewer__title');
 const count=viewer.querySelector('.artviewer__count');
 const btnClose=viewer.querySelector('.artviewer__close');
 let current=0, previousFocus=null, startX=null;
 function show(n){current=(n+cards.length)%cards.length;const card=cards[current];photo.src=card.querySelector('img').src;photo.alt=card.querySelector('img').alt;title.textContent=card.dataset.artTitle;count.textContent=String(current+1).padStart(2,'0')+' / '+cards.length;}
 function open(n){previousFocus=document.activeElement;show(n);viewer.hidden=false;viewer.setAttribute('aria-hidden','false');document.body.classList.add('viewer-open');btnClose.focus();}
 function close(){viewer.hidden=true;viewer.setAttribute('aria-hidden','true');document.body.classList.remove('viewer-open');photo.removeAttribute('src');if(previousFocus?.focus)previousFocus.focus();}
 cards.forEach((card,n)=>card.addEventListener('click',()=>open(n)));
 btnClose.addEventListener('click',close);
 viewer.querySelector('.artviewer__nav--prev').addEventListener('click',()=>show(current-1));
 viewer.querySelector('.artviewer__nav--next').addEventListener('click',()=>show(current+1));
 viewer.addEventListener('click',e=>{if(e.target===viewer)close()});
 window.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='Tab'){const controls=[btnClose,viewer.querySelector('.artviewer__nav--prev'),viewer.querySelector('.artviewer__nav--next')];if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls[2].focus()}else if(!e.shiftKey&&document.activeElement===controls[2]){e.preventDefault();controls[0].focus()}}});
 viewer.addEventListener('touchstart',e=>{startX=e.changedTouches[0]?.clientX??null},{passive:true});
 viewer.addEventListener('touchend',e=>{if(startX===null)return;const end=e.changedTouches[0]?.clientX??startX;const delta=end-startX;if(Math.abs(delta)>65)show(current+(delta<0?1:-1));startX=null},{passive:true});
})();
