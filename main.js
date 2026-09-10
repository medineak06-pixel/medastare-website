(() => {
  "use strict";

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
  const lerp = (a,b,t) => a+(b-a)*t;
  const smooth = t => t*t*(3-2*t);

  const progress = $("#scrollProgress");
  const heroTrack = $("#heroTrack");
  const heroCopy = $("#heroCopy");
  const heroVisual = $("#heroVisual");
  const heroImage = $("#heroImage");
  const heroDevice = $("#heroDevice");
  const heroOrbit = $("#heroOrbit");
  const microCard = $("#microCard");
  const closetTrack = $("#closetTrack");
  const garments = $$(".garment");
  const slots = $$(".combine-slot");

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.13, rootMargin:"0px 0px -5% 0px"});
  $$(".reveal").forEach(el => observer.observe(el));

  let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
  if(heroVisual && !reduced){
    heroVisual.addEventListener("pointermove", e => {
      const r = heroVisual.getBoundingClientRect();
      mouseX = ((e.clientX-r.left)/r.width-.5);
      mouseY = ((e.clientY-r.top)/r.height-.5);
    }, {passive:true});
    heroVisual.addEventListener("pointerleave", () => {mouseX=0;mouseY=0}, {passive:true});
  }

  function heroProgress(){
    if(!heroTrack) return 0;
    const r=heroTrack.getBoundingClientRect();
    const total=Math.max(1,r.height-innerHeight);
    return clamp(-r.top/total);
  }

  function closetProgress(){
    if(!closetTrack) return 0;
    const r=closetTrack.getBoundingClientRect();
    const total=Math.max(1,r.height-innerHeight);
    return clamp(-r.top/total);
  }

  function update(){
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight-innerHeight);
    if(progress) progress.style.transform=`scaleX(${scrollY/max})`;

    if(!reduced){
      currentX=lerp(currentX,mouseX,.055);
      currentY=lerp(currentY,mouseY,.055);

      const hp=heroProgress();
      const hs=smooth(hp);
      if(heroCopy){
        heroCopy.style.transform=`translate3d(0,${-28*hs}px,0)`;
        heroCopy.style.opacity=String(1-hs*.22);
      }
      if(heroVisual){
        heroVisual.style.transform=`translate3d(${currentX*6}px,${currentY*5}px,0) rotateX(${currentY*-1.7}deg) rotateY(${currentX*2.1}deg)`;
      }
      if(heroImage){
        heroImage.style.transform=`translate3d(${currentX*-7}px,${hs*18+currentY*-4}px,${-20+hs*35}px) scale(${.99+hs*.035})`;
        heroImage.style.filter=`saturate(.72) contrast(1.08) brightness(${.82-hs*.05})`;
      }
      if(heroDevice){
        heroDevice.style.transform=`rotateY(${-13+currentX*4}deg) rotateX(${4-currentY*3}deg) rotateZ(${2.5-hs*1.5}deg) translate3d(${hs*-24}px,${hs*-22}px,${125+hs*75}px) scale(${1+hs*.035})`;
      }
      if(heroOrbit){
        heroOrbit.style.transform=`rotateX(67deg) rotateZ(${-20+hs*18}deg) translateZ(${80+hs*40}px)`;
      }
      if(microCard){
        microCard.style.transform=`translate3d(${hs*-18}px,${hs*14}px,${175+hs*30}px) rotateY(${-7+currentX*3}deg)`;
        microCard.style.opacity=String(1-hs*.40);
      }

      const cp=closetProgress();
      garments.forEach((g,i)=>{
        const start=.07+i*.045;
        const duration=.62;
        const raw=clamp((cp-start)/duration);
        const t=smooth(raw);
        const lift=Math.sin(t*Math.PI);
        const lane=(i-3)*18;
        const settleX=(i-3)*15;
        const x=lane*lift + settleX*t;
        const y=-74*lift + (92+(i%3)*8)*t;
        const z=80 + 310*lift + 95*t;
        const rz=(i-3)*1.7*lift + (i%2?2.2:-2.2)*t;
        const ry=(i%2?5:-5)*lift;
        const scale=1+.20*lift-.08*t;
        g.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
        g.style.opacity=raw>.94?String(clamp(1-(raw-.94)*5,.66,1)):"1";
        g.style.filter=`blur(${Math.max(0,(raw-.97)*9)}px)`;
      });
      slots.forEach((slot,i)=>slot.classList.toggle("active",cp>(.30+i*.105)));
    }

    requestAnimationFrame(update);
  }

  const network=$("#network");
  if(network){
    const points=[
      [14,24],[33,17],[52,29],[75,17],[84,48],[68,71],[45,76],[22,62],[49,51]
    ];
    const pairs=[[0,1],[1,2],[2,3],[2,8],[8,4],[8,5],[8,6],[8,7],[7,0],[6,7],[5,6]];
    points.forEach((p,i)=>{
      const n=document.createElement("i");
      n.className="node"+(i===8||i===3?" gold":"");
      n.style.left=p[0]+"%";
      n.style.top=p[1]+"%";
      network.appendChild(n);
    });
    pairs.forEach(([a,b],idx)=>{
      const A=points[a], B=points[b];
      const dx=B[0]-A[0], dy=B[1]-A[1];
      const len=Math.hypot(dx,dy);
      const ang=Math.atan2(dy,dx)*180/Math.PI;
      const line=document.createElement("i");
      line.className="net-line";
      line.style.left=A[0]+"%";
      line.style.top=A[1]+"%";
      line.style.width=len+"%";
      line.style.transform=`rotate(${ang}deg)`;
      network.appendChild(line);

      if(idx<7 && !reduced){
        const pulse=document.createElement("i");
        pulse.className="data-pulse";
        network.appendChild(pulse);
        const duration=4500+idx*460;
        const offset=idx*620;
        const animate=now=>{
          const t=((now+offset)%duration)/duration;
          pulse.style.left=(A[0]+dx*t)+"%";
          pulse.style.top=(A[1]+dy*t)+"%";
          pulse.style.opacity=String(Math.sin(t*Math.PI));
          requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    });
  }

  requestAnimationFrame(update);
})();
