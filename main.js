(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const heroTrack=$("#heroTrack");
  const heroCopy=$("#heroCopy");
  const heroStage=$("#heroStage");
  const heroPhone=$("#heroPhone");
  const heroWoman=$("#heroWoman");
  const storeRow=$("#storeRow");
  const scrollHint=$("#scrollHint");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;

  let tx=0,ty=0,cx=0,cy=0;

  if(heroStage && !reduced){
    heroStage.addEventListener("pointermove",e=>{
      const r=heroStage.getBoundingClientRect();
      tx=(e.clientX-r.left)/r.width-.5;
      ty=(e.clientY-r.top)/r.height-.5;
    },{passive:true});
    heroStage.addEventListener("pointerleave",()=>{tx=0;ty=0},{passive:true});
  }

  function progress(){
    if(!heroTrack)return 0;
    const r=heroTrack.getBoundingClientRect();
    return clamp(-r.top/Math.max(1,r.height-innerHeight));
  }

  function loop(){
    if(!reduced){
      const p=progress();
      const s=smooth(p);
      const exit=clamp((p-.50)/.50);

      cx=mix(cx,tx,.055);
      cy=mix(cy,ty,.055);

      if(heroCopy){
        heroCopy.style.transform=`translate3d(0,${-34*s}px,0)`;
        heroCopy.style.opacity=String(1-.78*exit);
        heroCopy.style.filter=`blur(${4.5*exit}px)`;
      }

      if(heroStage){
        heroStage.style.transform=`translate3d(${cx*6}px,${cy*4}px,0) rotateX(${cy*-1.2}deg) rotateY(${cx*1.5}deg)`;
      }

      if(heroWoman){
        heroWoman.style.transform=`translate3d(${cx*-4+8*s}px,${cy*-2+16*s}px,${42*s}px) scale(${.98+.018*s})`;
        heroWoman.style.opacity=String(1-.33*exit);
        heroWoman.style.filter=`drop-shadow(0 32px 72px rgba(0,0,0,.48)) blur(${2.2*exit}px)`;
      }

      if(heroPhone){
        heroPhone.style.transform=`rotateY(${14+cx*3}deg) rotateX(${2-cy*2.2}deg) rotateZ(${-2+1.1*s}deg) translate3d(${28*s}px,${-28*s}px,${130+145*s}px) scale(${1+.085*s})`;
        heroPhone.style.opacity=String(1-.60*exit);
        heroPhone.style.filter=`blur(${2.5*clamp((p-.72)/.28)}px)`;
      }

      if(storeRow){
        storeRow.style.transform=`translate3d(0,${-9*s}px,0) scale(${1+.045*s})`;
        storeRow.style.transformOrigin="left center";
        storeRow.style.opacity=String(1-.96*clamp((p-.34)/.36));
        storeRow.style.filter=`blur(${4*clamp((p-.52)/.28)}px)`;
      }

      if(scrollHint) scrollHint.style.opacity=String(1-clamp(p/.28));
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();