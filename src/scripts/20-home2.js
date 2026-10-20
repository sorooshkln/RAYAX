// Home v2: bento hero, category bubbles, deal spotlight, ranking, installment calculator, brand marquee
const h2Cats=[['لپ‌تاپ','category-laptop'],['موبایل','category-mobile'],['کامپیوتر آماده','category-pc'],['قطعات کامپیوتر','category-gpu'],['مانیتور','category-monitor'],['کنسول و بازی','category-game'],['لوازم جانبی','category-headphones']];
$('#h2-cats').innerHTML=h2Cats.map(([name,img])=>`<button class="h2-cat" data-h2-q="${name}"><span><img src="${asset('home/design/'+img+'.png')}" alt=""></span>${name}</button>`).join('');

const h2Old=p=>Math.round(p.price/0.92);
$('#h2-deal-side').innerHTML=[homeProducts[11],homeProducts[2],homeProducts[0],homeProducts[8]].map(p=>`<button class="h2-mini" data-h2-product><img src="${asset(p.image)}" alt="" loading="lazy"><span><b>${escapeHTML(p.name)}</b><small><del>${fa(h2Old(p))}</del><span class="h2-mini-off">۸٪</span></small><strong>${fa(p.price)} <i>تومان</i></strong></span></button>`).join('');

$('#h2-rank').innerHTML=[homeProducts[5],homeProducts[14],homeProducts[9],homeProducts[1],homeProducts[12],homeProducts[3]].map((p,i)=>`<li><button data-h2-product><span class="h2-rank-no">${fa(i+1)}</span><img src="${asset(p.image)}" alt="" loading="lazy"><span class="h2-rank-text"><small>${p.label}</small><b>${escapeHTML(p.name)}</b><strong>${fa(p.price)} <i>تومان</i></strong></span></button></li>`).join('');

$('#h2-rail').innerHTML=homeProducts.slice(0,10).map(p=>productCard(p,false,'data-h2-product')).join('');
$$('[data-h2-rail]').forEach(b=>b.addEventListener('click',()=>{const r=$('#h2-rail');r.scrollBy({left:+b.dataset.h2Rail*(r.firstElementChild.offsetWidth+16)*2,behavior:'smooth'})}));

const h2Brands=['samsung','apple','logitech','anker','lenovo','xiaomi','baseus','asus','greenlion'];
const h2BrandRow=h2Brands.map(b=>`<button data-h2-q="${b}"><img src="${asset('home/design/brand-'+b+'.png')}" alt="${b}"></button>`).join('');
// Second copy makes the loop seamless; it is hidden from assistive tech
$('#h2-brands').innerHTML=`<div>${h2BrandRow}</div><div aria-hidden="true">${h2BrandRow.replaceAll('<button','<button tabindex="-1"')}</div>`;

const h2Mag=[['desk-setup','چه وسایلی برای خانه دیجیتال نیاز داریم؟','سبک زندگی'],['laptop-guide','راهنمای خرید لپ‌تاپ برای کار و دانشگاه','راهنمای خرید'],['usb-hub','چطور لوازم جانبی مناسب انتخاب کنیم؟','لوازم جانبی']];
$('#h2-mag').innerHTML=h2Mag.map(([id,title,tag],i)=>`<a class="h2-post" href="${location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-article/index.html':'rayax-article.html'}?story=${id}"><img src="${asset('home/design/blog-cover.png')}" alt="" loading="lazy"><span class="h2-post-tag">${tag}</span><b>${title}</b><small>۱۴۰۵/۰۷/${fa(12+i)} · ${fa(5+i)} دقیقه مطالعه</small></a>`).join('');

// Installment calculator: 4 equal parts, first one today
function h2Calc(){const v=+$('#h2-amount').value,part=Math.ceil(v/4/1000)*1000;$('#h2-amount-out').textContent=money(v);$('#h2-amount').style.setProperty('--fill',((v-1e6)/(99e6)*100)+'%');$('#h2-steps').innerHTML=['امروز','ماه دوم','ماه سوم','ماه چهارم'].map((t,i)=>`<li class="${i?'':'now'}"><i></i><small>${t}</small><b>${fa(part)}</b></li>`).join('')}
$('#h2-amount').addEventListener('input',h2Calc);h2Calc();

const h2Deadline=Date.now()+(9*3600+41*60+30)*1000,h2Pad=n=>fa(String(n).padStart(2,'0')).replace(/٬/g,'');
function h2Tick(){const t=Math.max(0,Math.floor((h2Deadline-Date.now())/1000));$('#h2-h').textContent=h2Pad(Math.floor(t/3600));$('#h2-m').textContent=h2Pad(Math.floor(t%3600/60));$('#h2-s').textContent=h2Pad(t%60)}
h2Tick();setInterval(h2Tick,1000);

$$('[data-catalog-link]').forEach(a=>a.href=catalogPageURL());
$$('[data-blog-link]').forEach(a=>a.href=blogPageURL());
$('#home2').addEventListener('click',e=>{const q=e.target.closest('[data-h2-q]');if(q){e.preventDefault();navigateCatalog(q.dataset.h2Q);return}if(e.target.closest('[data-h2-product]'))location.href=productPageURL()});

if('IntersectionObserver' in window&&matchMedia('(prefers-reduced-motion: no-preference)').matches){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});$$('#home2>section:not(.h2-bento),#home2>nav').forEach(s=>{s.classList.add('h2-reveal');io.observe(s)})}
