const homeProducts=[
 {
  "id": "watch",
  "name": "ساعت هوشمند مدل Ultra با بند مشکی",
  "brand": "RAYAX",
  "category": "accessories",
  "label": "ساعت هوشمند",
  "image": "home/design/product-watch.png",
  "price": 17980000
 },
 {
  "id": "gamingbuds",
  "name": "هدفون بی‌سیم گیمینگ با کیس شارژ",
  "brand": "RAYAX",
  "category": "accessories",
  "label": "هدفون و هندزفری",
  "image": "home/design/product-gaming-buds.png",
  "price": 3980000
 },
 {
  "id": "gpu",
  "name": "کارت گرافیک MSI دو فن مناسب گیمینگ",
  "brand": "RAYAX",
  "category": "computer",
  "label": "قطعات کامپیوتر",
  "image": "home/design/product-gpu.png",
  "price": 24980000
 },
 {
  "id": "buds",
  "name": "هدفون بی‌سیم با کیس شارژ جمع‌وجور",
  "brand": "RAYAX",
  "category": "accessories",
  "label": "هدفون و هندزفری",
  "image": "home/design/product-buds.png",
  "price": 2490000
 },
 {
  "id": "band",
  "name": "مچ‌بند هوشمند با نمایشگر رنگی",
  "brand": "RAYAX",
  "category": "accessories",
  "label": "ساعت و مچ‌بند",
  "image": "home/design/product-band.png",
  "price": 1790000
 },
 {
  "id": "air13",
  "name": "لپ‌تاپ ۱۵.۶ اینچی با طراحی باریک و سبک",
  "brand": "RAYAX",
  "category": "laptop",
  "label": "لپ‌تاپ",
  "image": "home/design/product-laptop.png",
  "price": 64980000
 },
 {
  "id": "camera",
  "name": "دوربین ورزشی ۳۶۰ درجه مناسب سفر",
  "brand": "RAYAX",
  "category": "accessories",
  "label": "دوربین و لوازم جانبی",
  "image": "home/design/product-camera.png",
  "price": 12980000
 },
 {
  "id": "printer",
  "name": "پرینتر رومیزی کانن مناسب خانه و دفتر",
  "brand": "RAYAX",
  "category": "computer",
  "label": "لوازم کامپیوتر",
  "image": "home/design/product-printer.png",
  "price": 8490000
 },
 {
  "id": "speaker",
  "name": "اسپیکر قابل حمل با نورپردازی رنگی",
  "brand": "RAYAX",
  "category": "accessories",
  "label": "اسپیکر",
  "image": "home/design/product-speaker.png",
  "price": 3980000
 },
 {
  "id": "console",
  "name": "کنسول بازی سونی PlayStation 5 همراه دسته",
  "brand": "RAYAX",
  "category": "game",
  "label": "کنسول و بازی",
  "image": "home/design/product-console.png",
  "price": 34980000
 },
 {
  "id": "ssd",
  "name": "حافظه SSD اکسترنال لکسار با طراحی سبک",
  "brand": "RAYAX",
  "category": "computer",
  "label": "حافظه و ذخیره‌سازی",
  "image": "home/design/product-ssd.png",
  "price": 3490000
 },
 {
  "id": "odyssey",
  "name": "مانیتور سامسونگ مدل Odyssey G5 مناسب گیمینگ",
  "brand": "RAYAX",
  "category": "computer",
  "label": "مانیتور",
  "image": "home/design/product-odyssey.png",
  "price": 18980000
 },
 {
  "id": "monitor",
  "name": "مانیتور ال‌جی با نمایشگر عریض و رنگ‌های زنده",
  "brand": "RAYAX",
  "category": "computer",
  "label": "مانیتور",
  "image": "home/design/product-monitor.png",
  "price": 12490000
 },
 {
  "id": "router",
  "name": "روتر بی‌سیم دو آنتن مناسب خانه و محل کار",
  "brand": "RAYAX",
  "category": "computer",
  "label": "شبکه و ارتباطات",
  "image": "home/design/product-router.png",
  "price": 2490000
 },
 {
  "id": "iphone13",
  "name": "گوشی موبایل اپل مدل iPhone 16 Pro Max ظرفیت ۲۵۶ گیگابایت",
  "brand": "Apple",
  "category": "mobile",
  "label": "گوشی موبایل",
  "image": "home/design/product-phone.png",
  "price": 72980000
 }
];

const homeOffers=[homeProducts[14],homeProducts[13],homeProducts[12],homeProducts[11],homeProducts[10]];
$('#home-offer-grid').innerHTML=[...homeOffers,...homeOffers].map(p=>productCard(p,true)).join('')+`<a class="home-offer-more" href="${catalogPageURL()}"><svg aria-hidden="true"><use href="#i-arrow"/></svg><span>مشاهده بیشتر</span></a>`;
let homeFilter='all',homeQuery='';
function renderHomeProducts(){const q=homeQuery.toLowerCase();const list=homeProducts.filter(p=>(homeFilter==='all'||p.category===homeFilter)&&(!q||(p.name+' '+p.brand+' '+p.label).toLowerCase().includes(q)));$('#home-latest-grid').innerHTML=list.length?list.slice(0,homeFilter==='all'&&!homeQuery?10:list.length).map(p=>productCard(p)).join(''):'<p class="home-empty">محصولی پیدا نشد. <button class="text-link" id="home-clear-search">نمایش همه محصولات</button></p>';$('#home-search-status').textContent=q?fa(list.length)+' محصول برای «'+homeQuery+'» پیدا شد.':'';$$('[data-home-filter]').forEach(b=>b.setAttribute('aria-selected',b.dataset.homeFilter===homeFilter));if(matchMedia('(max-width:767px)').matches){const active=$('[data-home-filter][aria-selected="true"]');if(active){const rail=active.parentElement,tabRect=active.getBoundingClientRect(),railRect=rail.getBoundingClientRect();if(tabRect.left<railRect.left||tabRect.right>railRect.right)rail.scrollBy({left:tabRect.left+tabRect.width/2-railRect.left-railRect.width/2,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}}$('#home-clear-search')?.addEventListener('click',()=>{homeFilter='all';homeQuery='';$('#search').value='';renderHomeProducts()})}
function selectHomeCategory(category){homeFilter=category;homeQuery='';$('#search').value='';renderHomeProducts();$('#home-products').scrollIntoView({behavior:'smooth'})}
renderHomeProducts();
const homeCategories=[["لپ‌تاپ", "laptop", "laptop", "home/design/category-laptop.png"], ["کامپیوتر آماده", "computer", "tower", "home/design/category-pc.png"], ["قطعات کامپیوتر", "computer", "cpu", "home/design/category-gpu.png"], ["موبایل", "mobile", "mobile", "home/design/category-mobile.png"], ["مانیتور", "computer", "monitor", "home/design/category-monitor.png"], ["کنسول و بازی", "game", "game", "home/design/category-game.png"], ["لوازم جانبی", "accessories", "headphones", "home/design/category-headphones.png"]];
$('#home-categories').innerHTML=homeCategories.map(([name,cat,ic,img])=>`<a class="home-category" href="#home-products" data-home-category="${cat}" data-q="${name}">${img?'<img src="'+asset(img)+'" alt="'+name+'">':icon(ic)}<span>${name}</span></a>`).join('')+`<button class="home-category more" id="home-more-categories"><span class="more-decoration">${icon('plus')}</span><span class="more-label"><span class="more-desktop">محصولات<br>بیشتر</span><span class="more-mobile">محصولات بیشتر</span></span><span class="more-arrow">${icon('arrow')}</span></button>`;
$('#home-more-categories').addEventListener('click',()=>{if(matchMedia('(max-width:767px)').matches){renderMobileNavigation('categories');openDialog('#mobile-navigation')}else openAnchored('#mega-dialog')});
const homeCatQuery={laptop:'لپ‌تاپ',mobile:'موبایل',computer:'قطعات کامپیوتر',accessories:'لوازم جانبی',game:'کنسول'};
$$('[data-home-category]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();navigateCatalog(b.dataset.q||homeCatQuery[b.dataset.homeCategory])}));
$$('[data-home-filter]').forEach((b,i)=>{b.addEventListener('click',()=>selectHomeCategory(b.dataset.homeFilter));b.addEventListener('keydown',e=>{const tabs=$$('[data-home-filter]');if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=tabs[(i+(e.key==='ArrowLeft'?1:-1)+tabs.length)%tabs.length];next.focus();selectHomeCategory(next.dataset.homeFilter)}})});
$('#home-show-all').href=catalogPageURL();
// Reuse the shared search and mega-menu interactions, directing them to this page's product grid.
let homeSlide=0;
const homeSlides=[['hero-0','دیگه نگران گجت‌هات نباش، رایاکس اینجاست!'],['hero-1','هر چیزی برای یک میز کار دوست‌داشتنی'],['hero-2','برای ایده‌های بزرگ، آماده باش!']];
function showHomeSlide(i){homeSlide=(i+homeSlides.length)%homeSlides.length;const [name,title]=homeSlides[homeSlide];$('#home-hero-mobile').srcset=asset('home/banners/'+name+'-mobile.png');$('#home-hero-image').src=asset('home/banners/'+name+'-desktop.png');$('#home-hero-image').alt=title+'؛ مشاهده محصولات';$$('.home-slide-dots button').forEach((b,index)=>{b.classList.toggle('active',index===homeSlide);b.setAttribute('aria-pressed',index===homeSlide)})}
$('.home-slide-prev').addEventListener('click',()=>showHomeSlide(homeSlide-1));$('.home-slide-next').addEventListener('click',()=>showHomeSlide(homeSlide+1));$$('.home-slide-dots button').forEach((b,i)=>b.addEventListener('click',()=>showHomeSlide(i)));
const offerDeadline=Date.now()+(14*3600+12*60+10)*1000;
setInterval(()=>{const t=Math.max(0,Math.floor((offerDeadline-Date.now())/1000));$('#offer-hours').textContent=fa(Math.floor(t/3600));$('#offer-minutes').textContent=fa(Math.floor(t%3600/60));$('#offer-seconds').textContent=fa(t%60)},1000);
const homeBrandAssets={"SAMSUNG": "samsung", "Apple": "apple", "logitech": "logitech", "ANKER": "anker", "Lenovo": "lenovo", "xiaomi": "xiaomi", "baseus": "baseus", "ASUS": "asus", "GREEN LION": "greenlion"};
$('#home-brands').innerHTML=Object.entries(homeBrandAssets).map(([brand,file])=>`<button data-brand="${brand}"><img src="${asset('home/design/brand-'+file+'.png')}" alt="${brand}"></button>`).join('');
$('#home-brands').addEventListener('click',e=>{const b=e.target.closest('[data-brand]');if(b)navigateCatalog(b.dataset.brand)});
$('#home-utilities').innerHTML=[["انواع آداپتور", "adapter"], ["کابل شارژ", "cable"], ["هندزفری", "earbuds"], ["پاوربانک", "powerbank"], ["کیف لپ‌تاپ", "bag"], ["هدفون", "headphones"], ["موس و کیبورد", "keyboard"], ["هاب و تبدیل", "hub"], ["استند لپ‌تاپ", "stand"]].map(([name,file])=>`<button data-utility><img src="${asset('home/design/utility-'+file+'.png')}" alt="">${name}</button>`).join('');$('#home-utilities').addEventListener('click',e=>{if(e.target.closest('[data-utility]'))selectHomeCategory('accessories')});
const homeArticleTitles=['چه وسایلی برای خانه دیجیتال نیاز داریم؟','راهنمای خرید لپ‌تاپ برای کار و دانشگاه','چطور لوازم جانبی مناسب انتخاب کنیم؟','پیش از خرید مک‌بوک این نکات را بخوانید'];
function homeArticleCard(title,i){return `<a class="home-blog-card" href="${(location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-article/index.html':'rayax-article.html')}?story=${['desk-setup','laptop-guide','usb-hub','laptop-guide'][i]||'laptop-guide'}"><img src="${asset('home/design/blog-cover.png')}" alt="راهنمای کار با ابزارهای دیجیتال" loading="lazy"><h3>${title}</h3><div><span>۱۴۰۵/۰۷/${fa(12+i)}</span><span>مطالعه بیشتر ‹</span></div></a>`}
$('#home-blog-grid').innerHTML=homeArticleTitles.map(homeArticleCard).join('');
$('#home-more-articles').addEventListener('click',()=>{location.href=blogPageURL()});
$('#home-about-toggle').addEventListener('click',()=>{const expanded=$('#home-about-toggle').getAttribute('aria-expanded')==='true';$('#home-about-more').hidden=expanded;$('#home-about-toggle').setAttribute('aria-expanded',!expanded);$('#home-about-toggle').innerHTML=(expanded?'بیشتر بخوانید ':'نمایش کمتر ')+icon(expanded?'down':'up')});
$$('[data-home-social]').forEach(b=>b.addEventListener('click',()=>info('ارتباط با رایاکس',infoPages.contact[1])));
$('.home-page').addEventListener('click',e=>{if(e.target.closest('[data-home-product]'))location.href=productPageURL()});
setOverlayPosition();

$$('.home-offer-arrow').forEach(b=>b.addEventListener('click',()=>$('#home-offer-grid').scrollBy({left:(b.dataset.dir==='next'?-1:1)*($('#home-offer-grid .related-card').offsetWidth+12)*2,behavior:'smooth'})));
