const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.header-nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.dataset.open==='true';nav.dataset.open=open?'false':'true';nav.style.display=open?'none':'flex';nav.style.position='absolute';nav.style.top='64px';nav.style.left='14px';nav.style.right='14px';nav.style.padding='18px';nav.style.borderRadius='20px';nav.style.background='rgba(5,6,8,.97)';nav.style.flexWrap='wrap';});}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
