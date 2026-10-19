// Header-anchored overlays match the shared store shell.
function setOverlayPosition(id='#cart-dialog'){const header=$('#site-header'),main=$('.header-main'),anchor=id==='#profile-dialog'?$('#account-button'):$('#open-cart');const top=(id==='#mega-dialog'?header:main).getBoundingClientRect().bottom;document.documentElement.style.setProperty('--header-bottom',Math.max(0,top)+'px');const width=id==='#profile-dialog'?320:400;const left=Math.max(16,Math.min(anchor.getBoundingClientRect().left,window.innerWidth-width-16));document.documentElement.style.setProperty('--overlay-left',left+'px');document.documentElement.style.setProperty('--cart-top',($('#open-cart').getBoundingClientRect().bottom+8)+'px');document.documentElement.style.setProperty('--sticky-height',header.getBoundingClientRect().height+'px')}
function openAnchored(id){setOverlayPosition(id);openDialog(id);if(id==='#mega-dialog')$('#open-mega').setAttribute('aria-expanded','true')}
window.addEventListener('resize',()=>{const open=$('.cart-dialog[open],.mega-dialog[open],.profile-dialog[open]');setOverlayPosition(open?'#'+open.id:'#cart-dialog')},{passive:true});window.addEventListener('scroll',()=>{const y=window.scrollY,b=document.body;if(y>120)b.classList.add('header-scrolled');else if(y<24)b.classList.remove('header-scrolled');const open=$('.cart-dialog[open],.mega-dialog[open],.profile-dialog[open]');if(open)setOverlayPosition('#'+open.id)},{passive:true});
$('#mega-dialog').addEventListener('close',()=>$('#open-mega').setAttribute('aria-expanded','false'));
const categoryData=[['لپ‌تاپ','laptop'],['موبایل','mobile'],['قطعات کامپیوتر','cpu'],['کامپیوتر آماده','tower'],['مانیتور','monitor'],['کنسول و بازی','game'],['لوازم جانبی','headphones'],['همه محصولات','all']];
function renderMega(category='لپ‌تاپ'){$('#mega-categories').innerHTML=categoryData.map(([name,ic])=>`<button class="${name===category?'active':''}" data-mega-category="${name}" aria-pressed="${name===category}">${icon(ic)}${name}</button>`).join('');$('#mega-title').textContent='انواع '+category;const laptop=category==='لپ‌تاپ';$('#mega-brands').innerHTML=['ASUS','Lenovo.','xiaomi','SAMSUNG','Apple'].map((brand,i)=>`<button class="brand-tile brand-${i}" data-mega-filter="${brand}">${brand}</button>`).join('')+`<button class="brand-tile more-brands" data-mega-filter="">${icon('plus')}مشاهده بیشتر</button>`;const lists=laptop?[['بر اساس کاربرد',['مناسب برای گیمینگ','مناسب برای رندر','مناسب برای روزمره','مناسب برای حسابداری','مناسب برای طراحی']],['بر اساس قیمت',['لپ‌تاپ تا ۱۵ میلیون','لپ‌تاپ تا ۳۰ میلیون','لپ‌تاپ تا ۴۰ میلیون','لپ‌تاپ تا ۵۰ میلیون','لپ‌تاپ تا ۶۰ میلیون','لپ‌تاپ تا ۱۰۰ میلیون','لپ‌تاپ تا ۲۰۰ میلیون']],['بر اساس نوع',['لپ‌تاپ با سیستم عامل ویندوز','لپ‌تاپ با سیستم عامل مک او اس']]]:[['انتخاب محصول',[category+' جدید',category+' پرفروش',category+' پیشنهادی']],['بر اساس قیمت',['اقتصادی','میان‌رده','حرفه‌ای']],['راهنمای انتخاب',['مشاهده مشخصات','مشاوره خرید']]];$('#mega-columns').innerHTML=lists.map(([title,items])=>`<div><h3>${title}</h3>${items.map(label=>`<button data-mega-filter="${label.includes('مک او اس')?'Apple':''}">${label}</button>`).join('')}</div>`).join('')}
renderMega();$('#open-mega').addEventListener('click',()=>openAnchored('#mega-dialog'));$$('[data-open-mega]').forEach(b=>b.addEventListener('click',()=>openAnchored('#mega-dialog')));
$('#mega-categories').addEventListener('click',e=>{const b=e.target.closest('[data-mega-category]');if(b)renderMega(b.dataset.megaCategory)});
$('#mega-dialog').addEventListener('click',e=>{const b=e.target.closest('[data-mega-filter]');if(!b)return;$('#mega-dialog').close();const q=b.dataset.megaFilter;navigateCatalog(q);if(!q)toast('محصولات نمایش داده شدند.')});
$$('[data-footer-category]').forEach(b=>b.addEventListener('click',()=>navigateCatalog(b.dataset.footerCategory)));
$$('[data-social]').forEach(b=>b.addEventListener('click',()=>info('شبکه‌های اجتماعی رایاکس','<p>نشانی رسمی شبکه‌های اجتماعی در فایل مرجع مشخص نشده است. این بخش برای اتصال به حساب رسمی فروشگاه آماده است.</p>')));

function navigateCatalog(query=''){location.href=catalogPageURL()+(query?'?search='+encodeURIComponent(query):'')}
if(typeof renderRelated!=='function'){
 $('#search-form').addEventListener('submit',e=>{e.preventDefault();navigateCatalog($('#search').value.trim())});
 $$('[data-tab-link]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();location.href=productPageURL()+'#'+a.dataset.tabLink}));
}

function productPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-product/index.html':'rayax-product.html'}

function catalogPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-catalog/index.html':'rayax-catalog.html'}
$$('[data-catalog-link]').forEach(a=>a.href=catalogPageURL()+(a.dataset.q?'?search='+encodeURIComponent(a.dataset.q):''));

/* Compact header: a categories button appears in the main row when the nav row collapses on scroll */
{const compact=document.createElement('button');compact.type='button';compact.className='compact-cats';compact.setAttribute('aria-label','دسته‌بندی محصولات');compact.innerHTML=icon('menu')+'<span>دسته‌بندی‌ها</span>';
 $('.header-main .brand')?.after(compact);compact.addEventListener('click',()=>openAnchored('#mega-dialog'));
 new ResizeObserver(()=>document.documentElement.style.setProperty('--sticky-height',$('#site-header').getBoundingClientRect().height+'px')).observe($('#site-header'));}

/* Active search: popular + recent searches panel under the field */
{const form=$('#search-form'),input=$('#search');if(form&&input){
 const popular=['لپ‌تاپ گیمینگ','آیفون ۱۶','هدفون بی‌سیم','مانیتور گیمینگ','کارت گرافیک','ساعت هوشمند'];
 const recent=()=>{const r=read('rayax-recent-search-v1',[]);return Array.isArray(r)?r.filter(x=>typeof x==='string').slice(0,5):[]};
 const panel=document.createElement('div');panel.className='search-panel';panel.id='search-panel';
 const paint=()=>{const r=recent();panel.innerHTML=(r.length?`<div class="sp-head"><b>جست‌وجوهای اخیر</b><button type="button" data-sp-clear>پاک کردن</button></div><div class="sp-recent">${r.map(q=>`<button type="button" data-sp="${escapeHTML(q)}">${icon('clock')}<span>${escapeHTML(q)}</span>${icon('arrow')}</button>`).join('')}</div>`:'')+`<div class="sp-head"><b>جست‌وجوهای پرطرفدار</b></div><div class="sp-chips">${popular.map(q=>`<button type="button" data-sp="${escapeHTML(q)}">${icon('search')}${q}</button>`).join('')}</div>`};
 form.append(panel);input.setAttribute('aria-controls','search-panel');input.setAttribute('aria-expanded','false');
 const remember=q=>{if(!q)return;save('rayax-recent-search-v1',[q,...recent().filter(x=>x!==q)].slice(0,5))};
 const open=()=>{paint();form.classList.add('is-active');document.body.classList.add('search-open');input.setAttribute('aria-expanded','true')};
 const close=()=>{form.classList.remove('is-active');document.body.classList.remove('search-open');input.setAttribute('aria-expanded','false')};
 input.addEventListener('focus',open);
 form.addEventListener('focusout',e=>{if(!form.contains(e.relatedTarget))close()});
 form.addEventListener('keydown',e=>{if(e.key==='Escape'){close();input.blur()}});
 form.addEventListener('submit',()=>{remember(input.value.trim());close()},true);
 panel.addEventListener('mousedown',e=>e.preventDefault());
 panel.addEventListener('click',e=>{if(e.target.closest('[data-sp-clear]')){save('rayax-recent-search-v1',[]);paint();return}const b=e.target.closest('[data-sp]');if(!b)return;input.value=b.dataset.sp;remember(b.dataset.sp);close();input.blur();navigateCatalog(b.dataset.sp)});
 document.addEventListener('click',e=>{if(form.classList.contains('is-active')&&!form.contains(e.target))close()});
}}
