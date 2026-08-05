const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.header-nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.dataset.open==='true';nav.dataset.open=open?'false':'true';nav.style.display=open?'none':'flex';nav.style.position='absolute';nav.style.top='64px';nav.style.left='14px';nav.style.right='14px';nav.style.padding='18px';nav.style.borderRadius='20px';nav.style.background='rgba(5,6,8,.97)';nav.style.flexWrap='wrap';});}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

(function(){
  const STORAGE_KEY='medastare_cookie_consent_v1';
  const hasChoice=localStorage.getItem(STORAGE_KEY);
  if(hasChoice){return;}

  const banner=document.createElement('div');
  banner.className='cookie-banner';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-live','polite');
  banner.setAttribute('aria-label','Cookie preferences');
  banner.innerHTML=`
    <div class="cookie-banner__inner">
      <div class="cookie-banner__brand">
        <span class="logo" aria-hidden="true">M</span>
        <div class="cookie-banner__copy">
          <strong>MedaStaré</strong>
          <p>We use essential cookies and similar technologies to keep the site secure, remember preferences and support delivery. You can accept all cookies or keep essentials only.</p>
          <a href="/cookies">View Cookie Policy</a>
        </div>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-btn cookie-btn--secondary" data-cookie-choice="essential">Essential Only</button>
        <button type="button" class="cookie-btn cookie-btn--primary" data-cookie-choice="accept">Accept Cookies</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  const closeBanner=(choice)=>{
    try{localStorage.setItem(STORAGE_KEY,choice);}catch(err){}
    banner.classList.add('is-hidden');
    setTimeout(()=>banner.remove(),260);
  };

  banner.querySelectorAll('[data-cookie-choice]').forEach(btn=>{
    btn.addEventListener('click',()=>closeBanner(btn.getAttribute('data-cookie-choice')||'essential'));
  });
})();
