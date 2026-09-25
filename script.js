const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const mobile=()=>window.innerWidth<=900;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let pointerX=0,pointerY=0;

const nav=document.getElementById('nav');
const pageProgress=document.getElementById('pageProgress');
const hero=document.getElementById('hero');
const heroWindow=document.getElementById('heroWindow');
const heroImage=document.getElementById('heroImage');
const heroCopy=document.getElementById('heroCopy');
const floatDishA=document.getElementById('floatDishA');
const floatDishB=document.getElementById('floatDishB');
const scrollCue=document.getElementById('scrollCue');
const favourites=document.getElementById('favourites');
const scenes=[...document.querySelectorAll('.fav-scene')];
const sceneCurrent=document.getElementById('sceneCurrent');
const gallery=document.getElementById('gallery');
const galleryTrack=document.getElementById('galleryTrack');
const galleryProgress=document.getElementById('galleryProgress');
const reviews=document.getElementById('reviews');
const ratingBig=document.getElementById('ratingBig');
const reviewImage=document.getElementById('reviewImage');
const order=document.getElementById('order');
const orderImage=document.getElementById('orderImage');
const orderCopy=document.getElementById('orderCopy');

function sectionProgress(section){
  if(!section) return 0;
  const rect=section.getBoundingClientRect();
  const travel=Math.max(1,section.offsetHeight-window.innerHeight);
  return clamp(-rect.top/travel);
}

function renderScroll(){
  const y=window.scrollY;
  const doc=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  if(pageProgress) pageProgress.style.width=`${(y/doc)*100}%`;
  nav?.classList.toggle('scrolled',y>24);

  if(mobile()||reduced){
    // Clear desktop-only inline transforms so resizing to mobile/reduced-motion never leaves content off-screen.
    if(heroWindow){heroWindow.style.width='';heroWindow.style.height='';heroWindow.style.right='';heroWindow.style.top='';heroWindow.style.borderRadius='';}
    if(heroImage) heroImage.style.transform='';
    if(heroCopy){heroCopy.style.transform='';heroCopy.style.opacity='';}
    if(floatDishA){floatDishA.style.transform='';floatDishA.style.opacity='';}
    if(floatDishB){floatDishB.style.transform='';floatDishB.style.opacity='';}
    scenes.forEach((scene,i)=>{scene.style.clipPath='';const img=scene.querySelector('img');if(img)img.style.transform='';});
    if(galleryTrack) galleryTrack.style.transform='';
    if(galleryProgress) galleryProgress.style.width='';
    if(ratingBig) ratingBig.style.transform='';
    if(reviewImage) reviewImage.style.transform='';
    if(orderImage) orderImage.style.transform='';
    if(orderCopy){orderCopy.style.transform='';orderCopy.style.opacity='';}
  } else {
    const hp=sectionProgress(hero);
    // 0..1: framed image grows into viewport; text clears away.
    const width=lerp(43,100,hp);
    const height=lerp(70,100,hp);
    const right=lerp(5,0,hp);
    const top=lerp(15,0,hp);
    const radius=lerp(30,0,hp);
    Object.assign(heroWindow.style,{width:`${width}vw`,height:`${height}vh`,right:`${right}vw`,top:`${top}vh`,borderRadius:`${radius}px`});
    heroImage.style.transform=`scale(${lerp(1.13,1.01,hp)}) translate3d(${lerp(0,-1.5,hp)+pointerX}%,${lerp(0,3,hp)+pointerY}%,0)`;
    heroCopy.style.transform=`translate3d(${lerp(0,-9,hp)}vw,calc(-50% + ${lerp(0,-90,hp)}px),0)`;
    heroCopy.style.opacity=String(clamp(1-hp*1.45));
    if(floatDishA){floatDishA.style.transform=`translate3d(${lerp(0,-22,hp)}vw,${lerp(0,-22,hp)}vh,0) rotate(${lerp(-2,-18,hp)}deg) scale(${lerp(1,.7,hp)})`;floatDishA.style.opacity=String(1-hp);}
    if(floatDishB){floatDishB.style.transform=`translate3d(${lerp(0,15,hp)}vw,${lerp(0,18,hp)}vh,0) rotate(${lerp(0,18,hp)}deg) scale(${lerp(1,.65,hp)})`;floatDishB.style.opacity=String(1-hp);}
    if(scrollCue) scrollCue.style.opacity=String(clamp(1-hp*3));

    const fp=sectionProgress(favourites);
    // Scene 1 base. Scene 2 wipes 20%-52%. Scene 3 wipes 52%-84%.
    const p2=clamp((fp-.18)/.32);
    const p3=clamp((fp-.52)/.32);
    scenes[1].style.clipPath=`inset(${(1-p2)*100}% 0 0 0)`;
    scenes[2].style.clipPath=`inset(${(1-p3)*100}% 0 0 0)`;
    scenes[0].querySelector('img').style.transform=`scale(${lerp(1.11,1.02,clamp(fp/.45))}) translateY(${lerp(0,2,clamp(fp/.45))}%)`;
    scenes[1].querySelector('img').style.transform=`scale(${lerp(1.13,1.02,p2)}) translateY(${lerp(-3,2,p2)}%)`;
    scenes[2].querySelector('img').style.transform=`scale(${lerp(1.13,1.02,p3)}) translateY(${lerp(-3,2,p3)}%)`;
    sceneCurrent.textContent=fp<.34?'01':fp<.68?'02':'03';

    const gp=sectionProgress(gallery);
    const overflow=Math.max(0,galleryTrack.scrollWidth-window.innerWidth+window.innerWidth*.06);
    galleryTrack.style.transform=`translate3d(${-overflow*gp}px,0,0)`;
    galleryProgress.style.width=`${gp*100}%`;
    [...galleryTrack.querySelectorAll('img')].forEach((img,i)=>{
      const wave=Math.sin((gp*5-i*.7))*2.5;
      img.style.transform=`scale(1.08) translate3d(${wave}%,0,0)`;
    });

    const rp=sectionProgress(reviews);
    ratingBig.style.transform=`translate3d(${lerp(-3,2,rp)}vw,${lerp(50,-40,rp)}px,0) rotate(${lerp(-4,1.5,rp)}deg) scale(${lerp(.9,1.08,rp)})`;
    reviewImage.style.transform=`scale(${lerp(1.08,1.18,rp)}) translateY(${lerp(-2,3,rp)}%)`;

    const op=sectionProgress(order);
    orderImage.style.transform=`scale(${lerp(1.08,1.2,op)}) translateY(${lerp(-2,3,op)}%)`;
    orderCopy.style.transform=`translateY(${lerp(70,-45,op)}px)`;
    orderCopy.style.opacity=String(clamp((op-.06)/.35));
  }
}

let ticking=false;
function onScroll(){if(!ticking){requestAnimationFrame(()=>{renderScroll();ticking=false});ticking=true}}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',renderScroll);
renderScroll();

// Pointer parallax makes the main image feel alive even before scrolling.
if(!reduced){
  window.addEventListener('pointermove',(e)=>{
    if(mobile()||!heroImage) return;
    pointerX=(e.clientX/window.innerWidth-.5)*2.4;
    pointerY=(e.clientY/window.innerHeight-.5)*1.8;
    renderScroll();
  });
}

// Section reveals
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.16});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Extra parallax on manifesto images
if(!reduced){
  window.addEventListener('scroll',()=>{
    document.querySelectorAll('.parallax-card').forEach((card,i)=>{
      const r=card.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight) return;
      const p=(innerHeight-r.top)/(innerHeight+r.height);
      card.style.transform=`translateY(${(p-.5)*(i?55:-42)}px)`;
    });
  },{passive:true});
}

// Open status in Sibu
function updateStatus(){
  const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kuching',hour:'2-digit',minute:'2-digit',hour12:false});
  const parts=fmt.formatToParts(new Date());
  const h=Number(parts.find(p=>p.type==='hour').value),m=Number(parts.find(p=>p.type==='minute').value);
  const now=h*60+m,open=16*60,close=23*60+30;
  const el=document.getElementById('openStatus');
  if(!el)return;
  el.textContent=now>=open&&now<close?'OPEN NOW':'CLOSED';
  el.style.color=now>=open&&now<close?'#ffc184':'#fff';
}
updateStatus();setInterval(updateStatus,60000);

// Editorial menu
const menuItems=[
  {name:'Sambal Cobek Ayam Goreng',category:'cobek',label:'Sambal Cobek',image:'https://images.deliveryhero.io/image/fd-my/products/1449388188.jpg?width=1600&height=1600'},
  {name:'Sambal Cobek Kambing Bakar',category:'cobek',label:'Sambal Cobek',image:'https://images.deliveryhero.io/image/fd-my/products/1580466833.jpg?width=1600&height=1600'},
  {name:'Sambal Cobek Udang Sambal Petai',category:'cobek seafood',label:'Sambal Cobek',image:'https://images.deliveryhero.io/image/fd-my/Products/1486174004.jpg?width=1600&height=1600'},
  {name:'Sambal Cobek Sotong Sambal Petai',category:'cobek seafood',label:'Sambal Cobek',image:'https://images.deliveryhero.io/image/fd-my/products/1498931583.jpg?width=1400&height=1400'},
  {name:'Nasi Goreng Kampung',category:'rice',label:'Rice',image:'https://images.deliveryhero.io/image/fd-my/Products/1498947699.jpg?width=1400&height=1400'},
  {name:'Nasi Goreng Sambal Petai',category:'rice',label:'Rice',image:'https://images.deliveryhero.io/image/fd-my/Products/1541593904.jpg?width=1400&height=1400'},
  {name:'Nasi Lemak Udang Sambal Petai',category:'rice seafood',label:'Nasi Lemak',image:'https://images.deliveryhero.io/image/fd-my/products/1447689772.jpg?width=1400&height=1400'},
  {name:'Sotong Goreng Telur Masin',category:'seafood',label:'Seafood',image:'https://images.deliveryhero.io/image/fd-my/products/1449388169.jpg?width=1400&height=1400'},
  {name:'Udang Goreng Telur Masin',category:'seafood',label:'Seafood',image:'https://images.deliveryhero.io/image/fd-my/products/1498931583.jpg?width=1400&height=1400'},
  {name:'Tahu Bergedil',category:'snacks',label:'Snacks',image:'https://images.deliveryhero.io/image/fd-my/Products/1498947699.jpg?width=1400&height=1400'},
  {name:'Korean Spicy Chicken Wing',category:'snacks',label:'Snacks',image:'https://images.deliveryhero.io/image/fd-my/Products/1541593904.jpg?width=1400&height=1400'},
  {name:'Ribena Soda Lemon',category:'drinks',label:'Drinks',image:'https://images.deliveryhero.io/image/fd-my/products/1447689772.jpg?width=1400&height=1400'},
  {name:'Caramel Latte',category:'drinks',label:'Drinks',image:'https://images.deliveryhero.io/image/fd-my/products/1449388169.jpg?width=1400&height=1400'},
  {name:'Kelapa Khatulistiwa',category:'drinks',label:'New Menu',image:'https://images.deliveryhero.io/image/fd-my/products/1449388188.jpg?width=1600&height=1600'}
];
const menuList=document.getElementById('menuList'),search=document.getElementById('menuSearch'),filters=[...document.querySelectorAll('.filter')];
const preview=document.getElementById('menuPreview'),previewImage=document.getElementById('previewImage');
let activeFilter='all';
function pulsePreview(){if(!preview)return;preview.classList.add('is-changing');setTimeout(()=>preview.classList.remove('is-changing'),180)}
function renderMenu(){
  const q=(search.value||'').trim().toLowerCase();
  const visible=menuItems.filter(x=>(activeFilter==='all'||x.category.split(' ').includes(activeFilter))&&(!q||x.name.toLowerCase().includes(q)||x.label.toLowerCase().includes(q)));
  menuList.innerHTML=visible.length?visible.map((x,i)=>`<div class="menu-row ${i===0?'active':''}" tabindex="0" data-index="${menuItems.indexOf(x)}"><span class="menu-index">${String(i+1).padStart(2,'0')}</span><span class="menu-name">${x.name}</span><span class="menu-category">${x.label}</span></div>`).join(''):'<p style="color:rgba(255,255,255,.55);padding:28px 0">No matching menu items.</p>';
  const rows=[...menuList.querySelectorAll('.menu-row')];
  rows.forEach(row=>{
    const item=menuItems[Number(row.dataset.index)];
    const activate=()=>{rows.forEach(r=>r.classList.remove('active'));row.classList.add('active');pulsePreview()};
    row.addEventListener('mouseenter',activate);row.addEventListener('focus',activate);row.addEventListener('click',activate);
  });
}
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));btn.classList.add('active');activeFilter=btn.dataset.filter;renderMenu()}));
search.addEventListener('input',renderMenu);renderMenu();
