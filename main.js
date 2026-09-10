(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
  const mix = (a,b,t) => a+(b-a)*t;
  const smooth = t => t*t*(3-2*t);
  const outCubic = t => 1-Math.pow(1-t,3);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveals = $$(".reveal");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  }, {threshold:.13, rootMargin:"0px 0px -6% 0px"});
  reveals.forEach(el => revealObserver.observe(el));

  const heroTrack = $("#heroTrack");
  const hero = $("#hero");
  const heroCopy = $("#heroCopy");
  const heroStage = $("#heroStage");
  const heroWoman = $("#heroWoman");
  const heroPhone = $("#heroPhone");
  const heroGlass = $("#heroGlass");
  const heroRing = $("#heroRing");
  const heroStores = $("#heroStores");
  const scrollHint = $("#scrollHint");

  const medaiStage = $("#medaiStage");
  const medaiRing = $("#medaiRing");
  const intelTags = $$(".intel-tag");

  const closetTrack = $("#closetTrack");
  const garments = $$(".garment");
  const combineStates = $$(".combine-state");
  const combineRows = $$(".combine-row");

  const technology = $("#technology");
  const techBg = $("#techBg");
  const techContent = $("#techContent");
  const techGlass = $("#techGlass");
  const final = $("#download");
  const finalBg = $("#finalBg");

  let targetX=0,targetY=0,currentX=0,currentY=0;
  if(heroStage && !reduced){
    heroStage.addEventListener("pointermove", e => {
      const r=heroStage.getBoundingClientRect();
      targetX=(e.clientX-r.left)/r.width-.5;
      targetY=(e.clientY-r.top)/r.height-.5;
    }, {passive:true});
    heroStage.addEventListener("pointerleave",()=>{targetX=0;targetY=0},{passive:true});
  }

  function sectionProgress(el){
    if(!el) return 0;
    const r=el.getBoundingClientRect();
    const total=Math.max(1,r.height-innerHeight);
    return clamp(-r.top/total);
  }

  function viewportProgress(el, start=.84, end=.16){
    if(!el) return 0;
    const r=el.getBoundingClientRect();
    const y=(r.top/innerHeight);
    return clamp((start-y)/(start-end));
  }

  function updateHero(){
    if(!heroTrack) return;
    const p=sectionProgress(heroTrack);
    const s=smooth(p);
    const exit=clamp((p-.54)/.46);
    const e=outCubic(exit);

    if(hero) hero.style.setProperty("--heroP",p.toFixed(4));

    currentX=mix(currentX,targetX,.055);
    currentY=mix(currentY,targetY,.055);

    if(heroCopy){
      heroCopy.style.transform=`translate3d(0,${-34*s}px,0) scale(${1-.015*e})`;
      heroCopy.style.opacity=String(1-.78*e);
      heroCopy.style.filter=`blur(${4.5*e}px)`;
    }
    if(heroStage){
      heroStage.style.transform=`translate3d(${currentX*7}px,${currentY*5}px,0) rotateX(${currentY*-1.5}deg) rotateY(${currentX*1.8}deg)`;
    }
    if(heroWoman){
      heroWoman.style.transform=`translate3d(${currentX*-5 + 9*s}px,${currentY*-3 + 19*s}px,${35+65*s}px) scale(${.97+.035*s})`;
      heroWoman.style.opacity=String(1-.40*e);
      heroWoman.style.filter=`drop-shadow(0 35px 80px rgba(0,0,0,.48)) blur(${2.8*e}px)`;
    }
    if(heroPhone){
      heroPhone.style.transform=`rotateY(${15+currentX*3.5}deg) rotateX(${3-currentY*2.8}deg) rotateZ(${-2.5+1.7*s}deg) translate3d(${25*s}px,${-34*s}px,${145+145*s}px) scale(${1+.10*s})`;
      heroPhone.style.opacity=String(1-.63*e);
    }
    if(heroGlass){
      heroGlass.style.transform=`translate3d(${18*s}px,${16*s}px,${175+60*s}px) rotateY(${8+currentX*3}deg)`;
      heroGlass.style.opacity=String(1-.92*e);
    }
    if(heroRing){
      heroRing.style.transform=`rotateX(71deg) rotateZ(${-12+22*s}deg) translateZ(${40+75*s}px) scale(${1+.07*s})`;
      heroRing.style.opacity=String(.9-.68*e);
    }
    if(heroStores){
      heroStores.style.transform=`translate3d(0,${-12*s}px,0) scale(${1+.055*s})`;
      heroStores.style.transformOrigin="left center";
      heroStores.style.opacity=String(1-.96*clamp((p-.38)/.36));
      heroStores.style.filter=`blur(${5*clamp((p-.53)/.30)}px)`;
    }
    if(scrollHint) scrollHint.style.opacity=String(1-clamp(p/.32));
  }

  function updateMedAI(){
    if(!medaiStage) return;
    const p=viewportProgress(medaiStage,1.0,-.10);
    const s=smooth(p);
    if(medaiRing){
      medaiRing.style.transform=`translate(-50%,-50%) rotateX(67deg) rotateZ(${18*s}deg) scale(${.94+.08*s})`;
    }
    intelTags.forEach((tag,i)=>{
      const drift=Number(tag.dataset.drift || 0);
      const appear=clamp((p-(.09+i*.045))/.28);
      const leave=clamp((p-.76)/.22);
      const x=drift*(18-10*s);
      const y=(1-appear)*24 - leave*18;
      tag.style.opacity=String(appear*(1-.65*leave));
      const center = tag.classList.contains("it5") ? "translateX(-50%) " : "";
      tag.style.transform=`${center}translate3d(${x}px,${y}px,${35+24*s}px)`;
      tag.style.filter=`blur(${(1-appear)*5 + leave*2.5}px)`;
    });
  }

  function garmentMotion(t,i){
    // Premium "jump" with a soft overshoot: lift from rail, float forward, then settle.
    const lift=Math.sin(Math.min(1,t)*Math.PI);
    const overshoot=Math.sin(Math.min(1,t)*Math.PI*2)*Math.pow(1-t,1.6);
    const lane=(i-3)*18;
    const x=lane*lift + (i-3)*13*t + overshoot*8*(i%2?1:-1);
    const y=-105*lift + 94*t - overshoot*12;
    const z=55 + 390*lift + 120*t;
    const rz=(i-3)*1.55*lift + (i%2?2.2:-2.2)*t + overshoot*2.4;
    const ry=(i%2?5.5:-5.5)*lift;
    const scale=1+.27*lift-.07*t;
    return {x,y,z,rz,ry,scale};
  }

  function updateCloset(){
    if(!closetTrack) return;
    const p=sectionProgress(closetTrack);
    garments.forEach((g,i)=>{
      const start=.055+i*.045;
      const duration=.68;
      const raw=clamp((p-start)/duration);
      const t=smooth(raw);
      const m=garmentMotion(t,i);
      g.style.transform=`translate3d(${m.x}px,${m.y}px,${m.z}px) rotateY(${m.ry}deg) rotateZ(${m.rz}deg) scale(${m.scale})`;
      const fade=clamp((raw-.93)/.07);
      g.style.opacity=String(1-.31*fade);
      g.style.filter=`blur(${2.2*fade}px)`;
    });

    const state = p < .24 ? 0 : p < .46 ? 1 : p < .70 ? 2 : 3;
    combineStates.forEach((s,i)=>s.classList.toggle("active",i===state));
    combineRows.forEach((r,i)=>r.classList.toggle("active",p>(.22+i*.145)));
  }

  function updateTechnology(){
    if(!technology) return;
    const p=sectionProgress(technology);
    const s=smooth(p);
    const exit=clamp((p-.70)/.30);
    if(techBg){
      techBg.style.transform=`scale(${1.05+.08*s}) translate3d(${18*s}px,${-10*s}px,0)`;
      techBg.style.filter=`saturate(${.72+.10*s}) brightness(${.82-.08*exit})`;
    }
    if(techContent){
      techContent.style.transform=`translate3d(0,${-30*s}px,0) scale(${1-.018*exit})`;
      techContent.style.opacity=String(1-.54*exit);
      techContent.style.filter=`blur(${3.8*exit}px)`;
    }
    if(techGlass){
      techGlass.style.transform=`translateY(-50%) rotateZ(${8*s}deg) translate3d(${-28*s}px,${8*s}px,${80*s}px) scale(${.96+.10*s})`;
      techGlass.style.opacity=String(.78-.28*exit);
    }
  }

  function updateFinal(){
    if(!final || !finalBg) return;
    const p=viewportProgress(final,.96,.08);
    finalBg.style.transform=`scale(${1.08-.045*smooth(p)}) translate3d(0,${12*(1-p)}px,0)`;
  }

  function loop(){
    if(!reduced){
      updateHero();
      updateMedAI();
      updateCloset();
      updateTechnology();
      updateFinal();
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();