(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
  const mix = (a,b,t) => a + (b-a)*t;
  const smooth = t => t*t*(3-2*t);
  const outCubic = t => 1 - Math.pow(1-t,3);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
  $$(".reveal").forEach(el => observer.observe(el));

  const heroTrack = $("#heroTrack");
  const heroBg = $("#heroBg");
  const heroCopy = $("#heroCopy");
  const heroStores = $("#heroStores");
  const heroScroll = $("#heroScroll");

  const medai = $("#medai");
  const medaiImage = $("#medaiImage");
  const medaiRules = $$(".medai-rule");
  const medaiLabels = $$(".medai-label");

  const closeteTrack = $("#closete");
  const closeteScene = $("#closeteScene");
  const closeteCopy = $("#closeteCopy");
  const garments = $$(".garment");
  const lookLines = $$(".look-line");
  const lookMeter = $$(".look-meter i");

  const techTrack = $("#technology");
  const fabric = $("#fabric");
  const download = $("#download");
  const downloadBg = $("#downloadBg");

  function sectionProgress(el){
    if(!el) return 0;
    const r = el.getBoundingClientRect();
    const total = Math.max(1, r.height - innerHeight);
    return clamp(-r.top / total);
  }

  function viewportProgress(el, start=.9, end=.1){
    if(!el) return 0;
    const r = el.getBoundingClientRect();
    return clamp((start - r.top/innerHeight)/(start-end));
  }

  function updateHero(){
    const p = sectionProgress(heroTrack);
    const s = smooth(p);
    const exit = outCubic(clamp((p-.46)/.54));

    if(heroBg){
      heroBg.style.transform = `scale(${1.035 + .085*s}) translate3d(${18*s}px,${-8*s}px,0)`;
      heroBg.style.filter = `saturate(${.90 - .10*exit}) brightness(${1 - .12*exit})`;
      heroBg.style.opacity = String(1 - .22*exit);
    }
    if(heroCopy){
      heroCopy.style.transform = `translate3d(0,${-46*s}px,0) scale(${1-.018*exit})`;
      heroCopy.style.opacity = String(1 - .88*exit);
      heroCopy.style.filter = `blur(${5*exit}px)`;
    }
    if(heroStores){
      const t = clamp((p-.28)/.40);
      heroStores.style.transform = `translate3d(0,${-10*t}px,0)`;
      heroStores.style.opacity = String(1 - .96*t);
      heroStores.style.filter = `blur(${4*t}px)`;
    }
    if(heroScroll) heroScroll.style.opacity = String(1-clamp(p/.28));
  }

  function updateMedAI(){
    const p = sectionProgress(medai);
    const s = smooth(p);
    if(medaiImage){
      medaiImage.style.transform = `scale(${1.045 + .055*s}) translate3d(${10*s}px,${-12*s}px,0)`;
      medaiImage.style.filter = `saturate(${.72 + .07*s}) contrast(1.04) brightness(${1-.08*clamp((p-.74)/.26)})`;
    }
    medaiRules.forEach((rule,i)=>{
      const t = clamp((p-(.10+i*.08))/.32);
      rule.style.transform = `scaleX(${smooth(t)})`;
      rule.style.opacity = String(.8 - .45*clamp((p-.78)/.22));
    });
    medaiLabels.forEach((label,i)=>{
      const t = clamp((p-(.17+i*.09))/.26);
      const leave = clamp((p-.78)/.22);
      label.style.opacity = String(t*(1-.82*leave));
      label.style.transform = `translate3d(0,${18*(1-t)-15*leave}px,0)`;
      label.style.filter = `blur(${4*(1-t)+2.5*leave}px)`;
    });
  }

  function garmentTransform(raw, i){
    const t = smooth(raw);
    const jump = Math.sin(Math.PI * Math.min(t,1));
    const overshoot = Math.sin(Math.PI*2*Math.min(t,1)) * Math.pow(1-t,1.65);
    const spread = (i-3)*15;
    return {
      x: spread*jump + (i-3)*11*t + overshoot*(i%2 ? 8 : -8),
      y: -130*jump + 102*t - overshoot*11,
      z: 55 + 430*jump + 135*t,
      ry: (i%2 ? 5.5 : -5.5)*jump,
      rz: (i-3)*1.4*jump + (i%2 ? 2.4 : -2.4)*t + overshoot*2.2,
      scale: 1 + .30*jump - .06*t
    };
  }

  function updateClosete(){
    const p = sectionProgress(closeteTrack);
    const s = smooth(p);

    if(closeteScene){
      closeteScene.style.transform = `scale(${1.02 + .045*s}) translate3d(0,${-8*s}px,0)`;
      closeteScene.style.filter = `brightness(${.92 + .07*clamp((p-.05)/.35) - .11*clamp((p-.80)/.20)}) saturate(.88)`;
    }

    if(closeteCopy){
      const leave = clamp((p-.40)/.23);
      closeteCopy.style.opacity = String(1-.96*leave);
      closeteCopy.style.transform = `translate3d(0,${-30*leave}px,0)`;
      closeteCopy.style.filter = `blur(${4*leave}px)`;
    }

    garments.forEach((g,i)=>{
      const start = .085 + i*.046;
      const raw = clamp((p-start)/.66);
      const m = garmentTransform(raw,i);
      g.style.transform = `translate3d(${m.x}px,${m.y}px,${m.z}px) rotateY(${m.ry}deg) rotateZ(${m.rz}deg) scale(${m.scale})`;
      const fade = clamp((raw-.94)/.06);
      g.style.opacity = String(1-.30*fade);
      g.style.filter = `blur(${2.1*fade}px)`;
    });

    const state = p < .24 ? 0 : p < .45 ? 1 : p < .69 ? 2 : 3;
    lookLines.forEach((line,i)=>line.classList.toggle("active",i===state));
    lookMeter.forEach((m,i)=>m.classList.toggle("active",i<=state));
  }

  function updateTechnology(){
    const p = sectionProgress(techTrack);
    if(fabric){
      const s = smooth(p);
      fabric.style.transform = `translate3d(0,${-18*s}px,0) scale(${1+.025*s})`;
      fabric.style.filter = `brightness(${.88+.12*s})`;
    }
  }

  function updateDownload(){
    const p = viewportProgress(download,.98,.12);
    if(downloadBg){
      downloadBg.style.transform = `scale(${1.08-.04*smooth(p)}) translate3d(${12*(1-p)}px,0,0)`;
      downloadBg.style.filter = `saturate(.65) contrast(1.04) brightness(${.78+.14*p})`;
    }
  }

  function loop(){
    if(!reduced){
      updateHero();
      updateMedAI();
      updateClosete();
      updateTechnology();
      updateDownload();
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();