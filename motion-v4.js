/** MedaStaré V4 — ACTUAL scroll-scrubbed cinematic choreography, no dependency or timers. */
(()=>{
 'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const coarse=matchMedia('(pointer: coarse)');
 if(reduce.matches) return;
 const doc=document.documentElement, body=document.body;
 const hero=document.querySelector('.hero');
 const chapters=[...document.querySelectorAll('.chapter')];
 const edits=[...document.querySelectorAll('.edit')];
 const galleries=[...document.querySelectorAll('.edit__item')];
 const cities=[...document.querySelectorAll('.city')];
 const experiences=[...document.querySelectorAll('.experience')];
 const final=document.querySelector('.final');
 const markets=document.querySelector('.markets');
 const hud=document.querySelector('#motion-hud-fill');
 const hudLabel=document.querySelector('#motion-hud-chapter');
 const scenes=[...document.querySelectorAll('[data-motion-scene]')];
 const chapterNames={vision:'01 / VISION',medai:'02 / MEDAI',fashionstare:'03 / FASHIONSTARÉ',closete:'04 / CLOSETÉ',medavision:'05 / MEDAVISION',starematch:'06 / STARÉMATCH',musematch:'07 / MUSEMATCH',erafusion:'08 / ERAFUSION',medarena:'09 / MEDARENA',cities:'10 / CITIES',download:'11 / DOWNLOAD'};
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
 const put=(el,key,val)=>el&&el.style.setProperty(key,val);
 let scheduled=false,previousY=-1;
 // No content starts hidden. Motion is always optional and graphics remain readable if JS stops.
 body.classList.add('motion-v4');
 function tick(){
  scheduled=false;
  const height=innerHeight||800, y=scrollY||0;
  if(Math.abs(y-previousY)<.2&&previousY>=0)return;
  previousY=y;
  body.classList.toggle('scrolled',y>110);
  const max=Math.max(1,doc.scrollHeight-height);
  put(hud,'--hud-fill',(100*y/max).toFixed(2)+'%');
  // Hero: imagery moves behind typography, typography floats out as the page moves down.
  if(hero){
    const r=hero.getBoundingClientRect();
    if(r.bottom>-height&&r.top<height*1.5){
      const p=clamp((-r.top)/(r.height*.89));
      put(hero,'--v4-hero-y',(-p*94).toFixed(1)+'px');
      put(hero,'--v4-hero-scale',(1.07+p*.17).toFixed(4));
      put(hero,'--v4-hero-copy-y',(-p*88).toFixed(1)+'px');
      put(hero,'--v4-hero-copy-opacity',(1-.72*smooth(p)).toFixed(3));
      put(hero,'--v4-hero-bottom-y',(-p*28).toFixed(1)+'px');
      put(hero,'--v4-hero-bottom-opacity',(1-.82*p).toFixed(3));
    }
  }
  // The text, imagery and light in each product chapter advance at three separate speeds.
  for(const ch of chapters){
    const r=ch.getBoundingClientRect();
    if(r.bottom<-height*.1||r.top>height*1.4)continue;
    const entry=smooth((height*.95-r.top)/(height*.73));
    const center=clamp((height*.5-(r.top+r.height*.5))/(height+r.height),-1,1);
    const exit=clamp((height*.1-r.bottom)/(height*.6));
    const desc=smooth((height*.83-r.top)/(height*.79));
    const focus=smooth((height*.85-r.top)/(height*.6));
    const visual=ch.querySelector('.chapter__visual');
    const visualImg=ch.querySelector('.chapter__photo');
    put(ch,'--v4-title-y',((1-entry)*80-exit*34).toFixed(1)+'px');
    put(ch,'--v4-title-opacity',(.30+.7*entry).toFixed(3));
    put(ch,'--v4-desc-y',((1-desc)*48-exit*17).toFixed(1)+'px');
    put(ch,'--v4-desc-opacity',(.48+.52*desc).toFixed(3));
    put(ch,'--v4-kicker-y',((1-entry)*24).toFixed(1)+'px');
    put(ch,'--v4-kicker-opacity',(.64+.36*entry).toFixed(3));
    put(visual,'--v4-reveal-inset',((1-focus)*7.8).toFixed(2)+'%');
    put(visualImg,'--v4-image-drift',(center*-180).toFixed(1)+'px');
    put(visualImg,'--v4-image-scale',(1.12+.045*Math.abs(center)).toFixed(4));
    put(visualImg,'--v4-glint-x',(-145+Math.round(focus*300))+'%');
    put(visualImg,'--v4-glint-opacity',(focus*.50).toFixed(3));
  }
  // Gallery cards unfurl one by one while visitors scroll; use the actual card bounds.
  function animateCard(el,index,kind){
    const r=el.getBoundingClientRect();
    if(r.bottom<-height*.1||r.top>height*1.3)return;
    const stagger=Math.min(index%4,3)*.045*height;
    const p=smooth((height*.97-r.top-stagger)/(height*.64));
    const yMotion=(1-p)*(kind==='city'?60:kind==='exp'?90:110);
    const scale=1-(1-p)*(kind==='city'?.055:.075);
    put(el,'--v4-card-y',yMotion.toFixed(1)+'px');
    put(el,'--v4-card-scale',scale.toFixed(4));
    put(el,'--v4-card-opacity',(.63+.37*p).toFixed(3));
    put(el,'--v4-card-rx',((1-p)*(kind==='edit'?7:0)).toFixed(2)+'deg');
    const passed=clamp((height*.7-r.top)/(height+r.height));
    put(el,'--v4-inner-drift',((.5-passed)*24).toFixed(1)+'px');
    put(el,'--v4-inner-zoom',(1.065-passed*.03).toFixed(4));
  }
  galleries.forEach((el,i)=>animateCard(el,i,'edit'));
  cities.forEach((el,i)=>animateCard(el,i,'city'));
  experiences.forEach((el,i)=>animateCard(el,i,'exp'));
  for(const edit of edits){
    const r=edit.getBoundingClientRect();
    if(r.bottom<0||r.top>height*1.3)continue;
    put(edit,'--v4-rule-width',Math.round(smooth((height*.92-r.top)/(height*.78))*100)+'%');
  }
  if(markets){
    const r=markets.getBoundingClientRect();
    if(r.bottom>0&&r.top<height*1.35){
      const p=smooth((height*.95-r.top)/(height*.73));
      put(markets,'--v4-market-title-y',((1-p)*45).toFixed(1)+'px');
    }
  }
  if(final){
    const r=final.getBoundingClientRect();
    if(r.bottom>0&&r.top<height*1.3){
      const p=smooth((height-r.top)/(height+r.height*.65));
      put(final,'--v4-final-y',((p-.5)*-105).toFixed(1)+'px');
      put(final,'--v4-final-scale',(1.17-p*.055).toFixed(4));
      put(final,'--v4-final-copy-y',((1-p)*52).toFixed(1)+'px');
      put(final,'--v4-final-opacity',(.57+.43*p).toFixed(3));
    }
  }
  let nearest=1e5, id=null;
  for(const sc of scenes){
    const r=sc.getBoundingClientRect();
    if(r.bottom<0||r.top>height)continue;
    const d=Math.abs(r.top-height*.24);
    if(d<nearest){nearest=d;id=sc.id}
  }
  if(id&&hudLabel&&chapterNames[id]&&hudLabel.textContent!==chapterNames[id])hudLabel.textContent=chapterNames[id];
 }
 function request(){if(!scheduled){scheduled=true;requestAnimationFrame(tick)}}
 addEventListener('scroll',request,{passive:true});
 addEventListener('resize',()=>{previousY=-1;request()},{passive:true});
 addEventListener('pageshow',()=>{previousY=-1;request()});
 request();
 // Genuine restrained pointer tilt for gallery artwork; scroll transform remains intact.
 if(!coarse.matches){
   galleries.forEach(card=>{
     card.addEventListener('pointermove',e=>{
       const b=card.getBoundingClientRect();
       const x=clamp((e.clientX-b.left)/b.width);
       put(card,'--tilt-y',((x-.5)*4.5).toFixed(2)+'deg');
     },{passive:true});
     card.addEventListener('pointerleave',()=>put(card,'--tilt-y','0deg'));
   });
 }
})();
