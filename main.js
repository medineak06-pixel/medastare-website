(() => {
  "use strict";

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=t=>t*t*(3-2*t);
  const out=t=>1-Math.pow(1-t,3);
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("in");
        observer.unobserve(e.target);
      }
    });
  },{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  $$(".reveal").forEach(el=>observer.observe(el));

  const heroTrack=$("#heroTrack");
  const heroMedia=$("#heroMedia");
  const heroImage=$("#heroImage");
  const heroCopy=$("#heroCopy");
  const heroStores=$("#heroStores");
  const heroScroll=$("#heroScroll");

  const medaiStage=$("#medaiStage");
  const medaiPhoto=$("#medaiPhoto");
  const medaiScan=$("#medaiScan");
  const medaiFacts=$$(".medai-fact");

  const closeteTrack=$("#closete");
  const closeteBg=$("#closeteBg");
  const closeteCopy=$("#closeteCopy");
  const garments=$$(".garment");
  const lookLines=$$(".look-line");
  const lookMeter=$$(".look-meter i");

  function sectionProgress(el){
    if(!el) return 0;
    const r=el.getBoundingClientRect();
    return clamp(-r.top/Math.max(1,r.height-innerHeight));
  }

  function viewportProgress(el,start=.92,end=.12){
    if(!el) return 0;
    const r=el.getBoundingClientRect();
    return clamp((start-r.top/innerHeight)/(start-end));
  }

  function updateHero(){
    const p=sectionProgress(heroTrack);
    const s=smooth(p);
    const exit=out(clamp((p-.45)/.55));

    if(heroMedia){
      const vw = innerWidth > 980 ? 56 + 44*s : 100;
      heroMedia.style.width=`${vw}vw`;
      heroMedia.style.filter=`brightness(${1-.06*exit})`;
    }
    if(heroImage){
      heroImage.style.transform=`scale(${1.04+.055*s}) translate3d(${18*s}px,${-6*s}px,0)`;
      heroImage.style.filter=`saturate(.72) contrast(1.04) brightness(${.82-.08*exit})`;
    }
    if(heroCopy){
      heroCopy.style.transform=`translate3d(0,${-44*s}px,0)`;
      heroCopy.style.opacity=String(1-.90*exit);
      heroCopy.style.filter=`blur(${5*exit}px)`;
    }
    if(heroStores){
      const t=clamp((p-.25)/.42);
      heroStores.style.transform=`translate3d(0,${-10*t}px,0) scale(${1+.025*t})`;
      heroStores.style.opacity=String(1-.96*t);
      heroStores.style.filter=`blur(${4*t}px)`;
    }
    if(heroScroll) heroScroll.style.opacity=String(1-clamp(p/.25));
  }

  function updateMedAI(){
    const p=viewportProgress(medaiStage,.98,.08);
    const s=smooth(p);

    if(medaiPhoto){
      medaiPhoto.style.transform=`scale(${1.03+.045*s}) translate3d(${10*s}px,${-8*s}px,0)`;
      medaiPhoto.style.filter=`saturate(${.72+.06*s}) contrast(1.03) brightness(${.78+.06*s})`;
    }
    if(medaiScan){
      medaiScan.style.transform=`translateY(${(s-.5)*260}px)`;
      medaiScan.style.opacity=String(.2+.45*Math.sin(Math.PI*s));
    }
    medaiFacts.forEach((f,i)=>{
      const t=clamp((p-(.16+i*.13))/.22);
      const leave=clamp((p-.84)/.16);
      f.style.opacity=String(t*(1-.82*leave));
      f.style.transform=`translate3d(0,${18*(1-t)-12*leave}px,0)`;
      f.style.filter=`blur(${4*(1-t)+2*leave}px)`;
    });
  }

  // 2 + 2 + 2 + 1 choreography.
  const groups=[[0,1],[2,3],[4,5],[6]];
  const groupStarts=[.13,.32,.51,.70];

  function garmentTarget(g,index){
    const [tx,ty]=(g.dataset.target||"0,0").split(",").map(Number);
    const mobile=innerWidth<=640;
    const tablet=innerWidth<=980 && !mobile;
    const scaleFactor=mobile?.46:tablet?.72:1;
    return {tx:tx*scaleFactor,ty:ty*(mobile?.7:1)};
  }

  function updateClosete(){
    const p=sectionProgress(closeteTrack);
    const s=smooth(p);

    if(closeteBg){
      closeteBg.style.transform=`scale(${1.015+.035*s}) translate3d(0,${-6*s}px,0)`;
      closeteBg.style.filter=`brightness(${.88+.07*clamp((p-.05)/.35)-.10*clamp((p-.86)/.14)}) saturate(.90)`;
    }

    if(closeteCopy){
      const leave=clamp((p-.31)/.20);
      closeteCopy.style.opacity=String(1-.96*leave);
      closeteCopy.style.transform=`translate3d(0,${-26*leave}px,0)`;
      closeteCopy.style.filter=`blur(${4*leave}px)`;
    }

    groups.forEach((group,gi)=>{
      const raw=clamp((p-groupStarts[gi])/.18);
      const t=out(raw);
      const bounce=Math.sin(Math.PI*raw)*Math.pow(1-raw,.65);

      group.forEach((idx,pos)=>{
        const g=garments[idx];
        if(!g) return;
        const {tx,ty}=garmentTarget(g,idx);
        const pairOffset=(pos-(group.length-1)/2)*26*(innerWidth<=640?.45:1);
        const x=(tx+pairOffset)*t;
        const y=(-118*bounce + ty*t);
        const z=360*bounce + 110*t;
        const rz=((idx%2?1:-1)*4.5*bounce)+((idx-3)*.65*t);
        const scale=.25 + .90*t + .16*bounce;
        g.style.opacity=String(clamp(raw*1.6));
        g.style.transform=`translate3d(calc(-50% + ${x}px),${y}px,${z}px) rotateZ(${rz}deg) scale(${scale})`;
        g.style.filter=`blur(${Math.max(0,3*(1-raw))}px)`;
      });
    });

    const state=p<.28?0:p<.48?1:p<.68?2:3;
    lookLines.forEach((l,i)=>l.classList.toggle("active",i===state));
    lookMeter.forEach((m,i)=>m.classList.toggle("active",i<=state));
  }

  function loop(){
    if(!reduced){
      updateHero();
      updateMedAI();
      updateClosete();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();