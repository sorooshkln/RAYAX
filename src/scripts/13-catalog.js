/* Product listing: every category has its own facets; counts, URL state and mobile sheets stay in sync.
   Catalog data is local prototype data. */
const plpCats=[
 {id:'all',label:'همه محصولات',img:null,alias:['همه','همه محصولات','فروشگاه']},
 {id:'laptop',label:'لپ‌تاپ',img:'category-laptop',alias:['لپ تاپ','laptop','notebook']},
 {id:'mobile',label:'موبایل',img:'category-mobile',alias:['گوشی','گوشی موبایل','mobile','تبلت','موبایل و تبلت']},
 {id:'pc',label:'کامپیوتر آماده',img:'category-pc',alias:['کیس','pc']},
 {id:'parts',label:'قطعات کامپیوتر',img:'category-gpu',alias:['قطعات','لوازم کامپیوتر','computer']},
 {id:'monitor',label:'مانیتور',img:'category-monitor',alias:['monitor','نمایشگر']},
 {id:'game',label:'کنسول و بازی',img:'category-game',alias:['کنسول','بازی','game']},
 {id:'accessories',label:'لوازم جانبی',img:'category-headphones',alias:['accessories','جانبی']}];
const plpFacetDefs={type:{label:'نوع محصول'},ram:{label:'حافظهٔ رم',fmt:v=>fa(v)+' گیگابایت'},storage:{label:'حافظهٔ داخلی',fmt:v=>+v>=1000?fa(v/1000)+' ترابایت':fa(v)+' گیگابایت'},use:{label:'کاربرد'},size:{label:'اندازهٔ صفحه‌نمایش',fmt:v=>fa(v)+' اینچ'},refresh:{label:'نرخ نوسازی تصویر',fmt:v=>fa(v)+' هرتز'},color:{label:'رنگ',swatch:true}};
const plpCatFacets={all:[],laptop:['ram','storage','color'],mobile:['storage','color'],pc:['use','ram'],parts:['type'],monitor:['size','refresh'],game:['type'],accessories:['type','color']};
const plpSwatches={'مشکی':'#1f2329','سفید':'#ffffff','نقره‌ای':'#d6d8db','طوسی':'#8a8f98','آبی':'#3b6fd8'};
const plpLogos={Apple:'apple',Lenovo:'lenovo',SAMSUNG:'samsung',ASUS:'asus',xiaomi:'xiaomi',ANKER:'anker',baseus:'baseus',logitech:'logitech','GREEN LION':'greenlion'};
const plpSorts=[['recommended','پیشنهادی'],['popular','پرفروش‌ترین'],['newest','جدیدترین'],['cheapest','ارزان‌ترین'],['expensive','گران‌ترین']];
const plpGuides={
 all:['راهنمای خرید از رایاکس','<p>از لپ‌تاپ و موبایل تا قطعات کامپیوتر و لوازم جانبی، همه محصولات رایاکس را این‌جا ببینید. دسته‌بندی را از بالای صفحه انتخاب کنید تا فیلترهای مخصوص همان دسته نمایش داده شوند.</p><p>با فیلتر قیمت، برند و وضعیت موجودی، گزینه‌ها را به چند انتخاب مناسب محدود کنید و از مرتب‌سازی برای دیدن ارزان‌ترین یا پرفروش‌ترین‌ها کمک بگیرید.</p>'],
 laptop:['خرید لپ‌تاپ؛ متناسب با نیاز و بودجه','<p>برای کارهای روزمره، یک لپ‌تاپ سبک با شارژدهی خوب کافی است. برای طراحی، برنامه‌نویسی و پردازش‌های سنگین، پردازنده، رم و حافظهٔ SSD را با دقت بیشتری انتخاب کنید.</p><p>رم ۸ گیگابایت برای کارهای سبک، ۱۶ گیگابایت برای چندکارگی و ۳۲ گیگابایت برای رندر و ماشین مجازی مناسب است. وزن، اندازهٔ نمایشگر و درگاه‌ها را هم با نیازتان مقایسه کنید.</p>'],
 mobile:['خرید موبایل؛ انتخاب گوشی مناسب','<p>ظرفیت حافظه را بر اساس حجم عکس‌ها و برنامه‌هایتان انتخاب کنید؛ ۱۲۸ گیگابایت برای استفادهٔ عادی و ۲۵۶ گیگابایت یا بیشتر برای عکاسی و ویدیو مناسب‌تر است.</p><p>کیفیت دوربین، شارژدهی و مدت پشتیبانی نرم‌افزاری را هم پیش از خرید بررسی کنید.</p>'],
 pc:['خرید کامپیوتر آماده','<p>سیستم‌های آماده با قطعات هماهنگ و تست‌شده ارسال می‌شوند. کاربرد را مشخص کنید تا سیستم مناسب کار اداری، بازی یا رندر را پیدا کنید.</p><p>برای بازی و رندر، کارت گرافیک و رم بیشتر اهمیت دارد و برای کار اداری، سیستم کم‌مصرف و بی‌صدا انتخاب بهتری است.</p>'],
 parts:['خرید قطعات کامپیوتر','<p>کارت گرافیک، حافظهٔ SSD، روتر و لوازم کامپیوتر را بر اساس نوع محصول و برند فیلتر کنید.</p><p>پیش از خرید کارت گرافیک، توان منبع تغذیه و فضای کیس را بررسی کنید. برای SSD اکسترنال، سرعت انتقال و نوع درگاه را در نظر بگیرید.</p>'],
 monitor:['خرید مانیتور','<p>اندازهٔ ۲۴ اینچ برای میزهای کوچک و ۲۷ تا ۳۴ اینچ برای کار حرفه‌ای و بازی مناسب است.</p><p>برای بازی، نرخ نوسازی ۱۴۴ هرتز یا بالاتر تصویر روان‌تری می‌دهد و برای طراحی، دقت رنگ اهمیت بیشتری دارد.</p>'],
 game:['خرید کنسول و لوازم بازی','<p>کنسول‌های بازی و هدست‌های گیمینگ را با گارانتی و قیمت به‌روز ببینید.</p><p>نسخهٔ دیجیتال کنسول ارزان‌تر است ولی دیسک بازی را نمی‌خواند؛ پیش از انتخاب، روش خرید بازی‌هایتان را در نظر بگیرید.</p>'],
 accessories:['خرید لوازم جانبی','<p>ساعت هوشمند، هدفون، اسپیکر، پاوربانک، شارژر و کیف را بر اساس نوع محصول، برند و رنگ فیلتر کنید.</p><p>برای شارژر و کابل، توان خروجی و سازگاری با دستگاه‌تان را بررسی کنید.</p>']};

/* ---------- Data ---------- */
let plpSeq=0;
const plpImg=n=>n.includes('.')?n:'home/design/'+n+'.png';
function plpItem(cat,brand,name,image,price,specs={},label){const i=plpSeq++;return {id:'plp-'+i,cat,brand,name,image:plpImg(image),price:Math.round(price/10000)*10000,label:label||plpCats.find(c=>c.id===cat).label,specs,available:i%9!==7,offer:i%4===1,popularity:(i*37)%97,newness:(i*53)%89}}
const plpProducts=[
 ...[['Apple','MacBook Air M3','hero.jpg',64980000],['Lenovo','IdeaPad Slim 5','product-laptop',29800000],['ASUS','VivoBook 15','product-laptop',27500000],['SAMSUNG','Galaxy Book4','product-laptop',38500000],['xiaomi','RedmiBook Pro','product-laptop',31200000],['DELL','Inspiron 15','product-laptop',33400000],['acer','Aspire 7','product-laptop',30900000],['msi','Modern 14','product-laptop',28700000]]
  .flatMap(([b,m,img,p])=>[[8,256,'نقره‌ای',0],[16,512,'طوسی',14000000],[32,1000,'مشکی',30000000]].map(([ram,st,color,add])=>plpItem('laptop',b,`لپ‌تاپ ${b} مدل ${m} با ${fa(ram)} گیگابایت رم و ${plpFacetDefs.storage.fmt(st)} SSD`,img,p+add,{ram,storage:st,color}))),
 ...[['Apple','iPhone 16 Pro Max',72980000,[256,512]],['Apple','iPhone 15',48900000,[128,256]],['SAMSUNG','Galaxy S24 Ultra',68500000,[256,512]],['SAMSUNG','Galaxy A55',21900000,[128,256]],['xiaomi','Redmi Note 14 Pro',16800000,[128,256]],['xiaomi','Xiaomi 14T',32400000,[256,512]]]
  .flatMap(([b,m,p,sts],k)=>sts.map((st,j)=>plpItem('mobile',b,`گوشی موبایل ${b} مدل ${m} ظرفیت ${fa(st)} گیگابایت`,'product-phone',p+j*7000000,{storage:st,color:['مشکی','سفید','طوسی','آبی'][(k+j)%4]}))),
 ...[['RAYAX','گیمینگ RX-G5','گیمینگ',16,62000000],['RAYAX','گیمینگ RX-G7','گیمینگ',32,98000000],['RAYAX','اداری RX-O3','اداری',16,24500000],['ASUS','ROG Strix G16','گیمینگ',32,112000000],['Lenovo','ThinkCentre Neo 50','اداری',16,31800000],['RAYAX','رندر RX-R9','طراحی و رندر',64,146000000]]
  .map(([b,m,use,ram,p])=>plpItem('pc',b,`کامپیوتر آماده ${b} مدل ${m} با ${fa(ram)} گیگابایت رم`,'category-pc',p,{use,ram})),
 ...[['MSI','کارت گرافیک','RTX 4060 Ventus 2X','product-gpu',24980000],['ASUS','کارت گرافیک','Dual RTX 4070 Super','product-gpu',41500000],['MSI','کارت گرافیک','RTX 4070 Gaming X','product-gpu',44800000],['Lexar','حافظه SSD','SL500 اکسترنال ۱ ترابایت','product-ssd',3490000],['SAMSUNG','حافظه SSD','T7 Shield ۱ ترابایت','product-ssd',4980000],['Lexar','حافظه SSD','SL660 ۲ ترابایت','product-ssd',7890000],['TP-Link','روتر و مودم','Archer AX55','product-router',2490000],['ASUS','روتر و مودم','RT-AX58U','product-router',4290000],['Canon','پرینتر','PIXMA G3410','product-printer',8490000],['logitech','کیبورد و ماوس','MK270 بی‌سیم','utility-keyboard',1890000],['RAYAX','هاب و تبدیل','هاب ۷ پورت USB-C','utility-hub',1290000]]
  .map(([b,type,m,img,p])=>plpItem('parts',b,`${type} ${b} مدل ${m}`,img,p,{type},type)),
 ...[['SAMSUNG','Odyssey G5','product-odyssey',27,165,18980000],['SAMSUNG','Odyssey G5','product-odyssey',32,165,24900000],['LG','UltraGear','product-monitor',27,144,16500000],['LG','UltraWide','product-monitor',34,100,22400000],['ASUS','TUF Gaming VG249','product-monitor',24,165,11800000],['ASUS','ProArt PA278','product-monitor',27,75,26800000],['xiaomi','Mi Desktop Monitor','product-monitor',24,75,6900000],['SAMSUNG','Essential S3','product-monitor',24,75,7400000]]
  .map(([b,m,img,size,refresh,p])=>plpItem('monitor',b,`مانیتور ${b} مدل ${m} سایز ${fa(size)} اینچ`,img,p,{size,refresh})),
 ...[['Sony','کنسول بازی','PlayStation 5 Slim استاندارد','product-console',34980000],['Sony','کنسول بازی','PlayStation 5 Slim دیجیتال','product-console',29900000],['Sony','کنسول بازی','PlayStation 5 Pro','product-console',52800000],['RAYAX','هدست گیمینگ','بی‌سیم با کیس شارژ','product-gaming-buds',3980000],['logitech','هدست گیمینگ','G435 Lightspeed','utility-headphones',5490000]]
  .map(([b,type,m,img,p])=>plpItem('game',b,`${type} ${b} مدل ${m}`,img,p,{type},type)),
 ...[['xiaomi','ساعت هوشمند','Redmi Watch 5','product-watch',4980000,'مشکی'],['SAMSUNG','ساعت هوشمند','Galaxy Watch 7','product-watch',14980000,'طوسی'],['xiaomi','مچ‌بند هوشمند','Smart Band 9','product-band',1790000,'مشکی'],['ANKER','هدفون و هندزفری','Soundcore Liberty 4','product-buds',4290000,'سفید'],['baseus','هدفون و هندزفری','Bowie M2','utility-earbuds',1490000,'مشکی'],['SAMSUNG','هدفون و هندزفری','Galaxy Buds3','product-buds',7980000,'سفید'],['ANKER','اسپیکر','Soundcore Motion 300','product-speaker',5980000,'مشکی'],['GREEN LION','اسپیکر','Rhythm Speaker','product-speaker',2390000,'آبی'],['ANKER','پاوربانک','PowerCore ۲۰۰۰۰','utility-powerbank',2190000,'مشکی'],['baseus','شارژر و کابل','شارژر ۶۵ وات GaN','utility-adapter',1290000,'سفید'],['baseus','شارژر و کابل','کابل USB-C یک متری','utility-cable',390000,'مشکی'],['GREEN LION','کیف و استند','استند لپ‌تاپ آلومینیومی','utility-stand',990000,'طوسی'],['RAYAX','کیف و استند','کیف لپ‌تاپ ضدآب','utility-bag',1590000,'مشکی'],['RAYAX','دوربین','دوربین ورزشی ۳۶۰ درجه','product-camera',12980000,'مشکی']]
  .map(([b,type,m,img,p,color])=>plpItem('accessories',b,`${type} ${b} مدل ${m}`,img,p,{type,color},type))];

/* ---------- State ---------- */
const plpPage=12;
const plp={cat:'all',q:'',brands:new Set(),facets:{},min:null,max:null,stock:false,sale:false,sort:'recommended',visible:plpPage};
const plpNorm=s=>String(s).toLowerCase().replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌\s]+/g,' ').trim();
const plpNum=s=>{const d=String(s).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/\D/g,'');return d?Number(d):null};
const plpAllBrands=[...new Set(plpProducts.map(p=>p.brand))];
const plpCat=()=>plpCats.find(c=>c.id===plp.cat);
const plpInCat=()=>plpProducts.filter(p=>plp.cat==='all'||p.cat===plp.cat);
const plpFacetKeys=()=>plpCatFacets[plp.cat];
const plpFmt=(k,v)=>plpFacetDefs[k].fmt?plpFacetDefs[k].fmt(v):v;
// A search that names a category or a brand becomes that filter, so links from menus land on a real listing.
function plpApplyQuery(raw){
 const t=plpNorm(raw||'');plp.q='';if(!t)return;
 const cat=plpCats.find(c=>[c.label,...c.alias].some(a=>plpNorm(a)===t));if(cat){plp.cat=cat.id;return}
 const brand=plpAllBrands.find(b=>plpNorm(b)===t);if(brand){plp.brands.add(brand);return}
 plp.q=String(raw).trim().slice(0,60);
}
console.assert((()=>{const s={...plp,brands:new Set(plp.brands)};plpApplyQuery('موبایل');const a=plp.cat==='mobile';plp.cat='all';plpApplyQuery('lenovo');const b=plp.brands.has('Lenovo');Object.assign(plp,s);return a&&b})(),'catalog query mapping');

/* ---------- Matching ---------- */
function plpMatch(p,skip){
 if(plp.cat!=='all'&&p.cat!==plp.cat)return false;
 if(skip!=='brand'&&plp.brands.size&&!plp.brands.has(p.brand))return false;
 for(const k of plpFacetKeys()){const s=plp.facets[k];if(skip!==k&&s&&s.size&&!s.has(String(p.specs[k])))return false}
 if(plp.stock&&!p.available)return false;
 if(plp.sale&&!(p.offer&&p.available))return false;
 if(skip!=='price'){if(plp.min!=null&&p.price<plp.min)return false;if(plp.max!=null&&p.price>plp.max)return false}
 if(plp.q){const hay=plpNorm(p.name+' '+p.brand+' '+p.label);if(!plpNorm(plp.q).split(' ').every(w=>hay.includes(w)))return false}
 return true;
}
function plpBounds(){const prices=plpInCat().map(p=>p.price);const lo=Math.floor(Math.min(...prices)/1e6)*1e6,hi=Math.ceil(Math.max(...prices)/1e6)*1e6;return {lo,hi,step:hi-lo>40e6?1e6:100000}}
const plpPriceInvalid=()=>plp.min!=null&&plp.max!=null&&plp.min>plp.max;
function plpResults(){
 if(plpPriceInvalid())return [];
 const list=plpProducts.filter(p=>plpMatch(p));
 const by={popular:(a,b)=>b.popularity-a.popularity,newest:(a,b)=>b.newness-a.newness,cheapest:(a,b)=>a.price-b.price,expensive:(a,b)=>b.price-a.price,recommended:(a,b)=>(b.popularity+(b.offer?30:0))-(a.popularity+(a.offer?30:0))}[plp.sort];
 return list.sort((a,b)=>(b.available-a.available)||by(a,b));
}

/* ---------- URL ---------- */
function plpReadURL(){
 const u=new URLSearchParams(location.search);
 if(plpCats.some(c=>c.id===u.get('cat')))plp.cat=u.get('cat');
 (u.get('brand')||'').split(',').filter(b=>plpAllBrands.includes(b)).forEach(b=>plp.brands.add(b));
 for(const k of plpFacetKeys()){const v=(u.get(k)||'').split(',').filter(Boolean);if(v.length)plp.facets[k]=new Set(v)}
 plp.min=plpNum(u.get('min')||'');plp.max=plpNum(u.get('max')||'');plp.stock=u.get('stock')==='1';plp.sale=u.get('sale')==='1';
 if(plpSorts.some(s=>s[0]===u.get('sort')))plp.sort=u.get('sort');
 plpApplyQuery(u.get('q')||u.get('search')||'');
}
function plpWriteURL(){
 const u=new URLSearchParams();if(plp.cat!=='all')u.set('cat',plp.cat);if(plp.q)u.set('q',plp.q);if(plp.brands.size)u.set('brand',[...plp.brands].join(','));
 for(const k of plpFacetKeys())if(plp.facets[k]?.size)u.set(k,[...plp.facets[k]].join(','));
 if(plp.min!=null)u.set('min',plp.min);if(plp.max!=null)u.set('max',plp.max);if(plp.stock)u.set('stock','1');if(plp.sale)u.set('sale','1');if(plp.sort!=='recommended')u.set('sort',plp.sort);
 const s=u.toString();history.replaceState(null,'',location.pathname+(s?'?'+s:''));
}

/* ---------- Build (on category change) ---------- */
function plpBuildCats(){
 $('#plp-cats').innerHTML=plpCats.map(c=>{const n=c.id==='all'?plpProducts.length:plpProducts.filter(p=>p.cat===c.id).length;return `<button type="button" class="plp-cat" data-plp-cat="${c.id}" aria-pressed="false"><span class="plp-cat-img">${c.img?`<img src="${asset('home/design/'+c.img+'.png')}" alt="">`:icon('box')}</span><span class="plp-cat-text"><b>${c.label}</b><small>${fa(n)} کالا</small></span></button>`}).join('');
}
function plpBuildBrands(){
 const counts={};plpInCat().forEach(p=>counts[p.brand]=(counts[p.brand]||0)+1);
 const brands=Object.keys(counts).sort((a,b)=>(!!plpLogos[b]-!!plpLogos[a])||(counts[b]-counts[a]));
 $('#plp-brands').innerHTML=brands.map(b=>`<button type="button" class="plp-brand" data-plp-brand="${escapeHTML(b)}" aria-pressed="false" title="${escapeHTML(b)}">${plpLogos[b]?`<img src="${asset('home/design/brand-'+plpLogos[b]+'.png')}" alt="${escapeHTML(b)}">`:`<span>${escapeHTML(b)}</span>`}<i aria-hidden="true">${icon('check')}</i></button>`).join('');
 $('#plp-brands-wrap').hidden=brands.length<2;
}
function plpGroup(key,label,options,open=true){
 const many=options.length>6,swatch=plpFacetDefs[key]?.swatch;
 return `<details class="plp-group" data-group="${key}" ${open?'open':''}><summary>${label}<span class="plp-group-count" data-group-count="${key}" hidden></span>${icon('down')}</summary><div class="plp-group-body">${key==='brand'&&many?`<label class="plp-search"><span class="sr-only">جست‌وجوی برند</span>${icon('search')}<input type="search" data-brand-search placeholder="جست‌وجوی برند" autocomplete="off"></label>`:''}<div class="plp-options ${swatch?'swatches':''}">${options.map(v=>`<label class="plp-option" data-option-label="${escapeHTML(plpNorm(v))}"><input type="checkbox" data-f="${key}" value="${escapeHTML(String(v))}">${swatch?`<span class="plp-swatch" style="--sw:${plpSwatches[v]||'#ccc'}"></span>`:'<span class="plp-check">'+icon('check')+'</span>'}<span class="plp-option-text">${key==='brand'?escapeHTML(v):escapeHTML(String(plpFmt(key,v)))}</span><span class="plp-option-count" data-count></span></label>`).join('')}</div></div></details>`;
}
function plpBuildFacets(){
 const inCat=plpInCat(),brands=[...new Set(inCat.map(p=>p.brand))].sort((a,b)=>a.localeCompare(b));
 const groups=[plpGroup('brand','برند',brands)];
 for(const k of plpFacetKeys()){const vals=[...new Set(inCat.map(p=>p.specs[k]))];if(vals.every(v=>typeof v==='number'))vals.sort((a,b)=>a-b);groups.push(plpGroup(k,plpFacetDefs[k].label,vals))}
 $('#plp-facets').innerHTML=groups.join('');
 const b=plpBounds();for(const id of ['#plp-min-range','#plp-max-range']){const r=$(id);r.min=b.lo;r.max=b.hi;r.step=b.step}
}
function plpSetCat(id){
 if(id===plp.cat)return;plp.cat=id;
 const inCat=new Set(plpInCat().map(p=>p.brand));plp.brands.forEach(b=>{if(!inCat.has(b))plp.brands.delete(b)});
 plp.facets={};plp.min=plp.max=null;plp.visible=plpPage;
 plpBuildBrands();plpBuildFacets();plpRender();
}

/* ---------- Render ---------- */
function plpRender(){
 const cat=plpCat(),list=plpResults(),inCat=plpInCat();
 // head
 const title=plp.q?`نتایج «${plp.q}»`:cat.id!=='all'?'خرید '+cat.label:plp.brands.size===1?'محصولات '+[...plp.brands][0]:'همه محصولات';
 $('#plp-title').textContent=title;document.title=title+' | فروشگاه رایاکس';
 $('#plp-subtitle').textContent=plp.q?(cat.id==='all'?'در همه دسته‌ها':'در دستهٔ '+cat.label):(cat.id==='all'?'لپ‌تاپ، موبایل، قطعات و لوازم جانبی با بهترین قیمت':'به‌روزترین '+cat.label+'‌ها با گارانتی معتبر و ارسال سریع');
 $('#plp-total').textContent=fa(inCat.length)+' کالا';
 $('#plp-breadcrumb').innerHTML=`<a href="${homePageURL()}">صفحه اصلی</a>${icon('arrow')}${cat.id==='all'?'<span aria-current="page">فروشگاه</span>':`<a href="${location.pathname}" data-plp-cat-link="all">فروشگاه</a>${icon('arrow')}<span aria-current="page">${cat.label}</span>`}`;
 $$('[data-plp-cat]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.plpCat===plp.cat));
 $$('[data-plp-brand]').forEach(b=>b.setAttribute('aria-pressed',plp.brands.has(b.dataset.plpBrand)));
 // facet counts: each option counts results with every other filter applied
 $$('#plp-facets input[data-f]').forEach(i=>{const k=i.dataset.f,sel=k==='brand'?plp.brands:(plp.facets[k]||new Set());i.checked=sel.has(i.value);const n=plpProducts.filter(p=>plpMatch(p,k)&&String(k==='brand'?p.brand:p.specs[k])===i.value).length;i.disabled=!n&&!i.checked;const lab=i.closest('.plp-option');lab.querySelector('[data-count]').textContent=fa(n);lab.classList.toggle('is-empty',!n&&!i.checked)});
 $$('[data-group-count]').forEach(s=>{const k=s.dataset.groupCount,n=(k==='brand'?plp.brands:(plp.facets[k]||new Set())).size;s.hidden=!n;s.textContent=fa(n)});
 // price
 const b=plpBounds(),lo=plp.min??b.lo,hi=plp.max??b.hi;
 $('#plp-min-range').value=Math.max(b.lo,Math.min(lo,b.hi));$('#plp-max-range').value=Math.max(b.lo,Math.min(hi,b.hi));
 const pct=v=>(Math.max(b.lo,Math.min(v,b.hi))-b.lo)/((b.hi-b.lo)||1)*100;$('#plp-range-fill').style.cssText=`right:${pct(lo)}%;left:${100-pct(hi)}%`;
 for(const [id,val,def] of [['#plp-min',plp.min,b.lo],['#plp-max',plp.max,b.hi]]){const el=$(id);if(document.activeElement!==el)el.value=fa(val??def)}
 const bad=plpPriceInvalid();$('#plp-price-error').hidden=!bad;$$('#plp-min,#plp-max').forEach(i=>i.toggleAttribute('aria-invalid',bad));
 $('#plp-stock').checked=plp.stock;$('#plp-sale').checked=plp.sale;
 // active chips
 const tags=[];if(plp.q)tags.push(['q','','جست‌وجو: '+plp.q]);plp.brands.forEach(v=>tags.push(['brand',v,v]));
 for(const k of plpFacetKeys())(plp.facets[k]||[]).forEach(v=>tags.push([k,v,plpFmt(k,v)]));
 if(plp.min!=null||plp.max!=null)tags.push(['price','',`${fa(plp.min??b.lo)} تا ${fa(plp.max??b.hi)} تومان`]);
 if(plp.stock)tags.push(['stock','','فقط موجود']);if(plp.sale)tags.push(['sale','','تخفیف‌دار']);
 $('#plp-active').innerHTML=tags.length?tags.map(([k,v,l])=>`<button type="button" class="plp-chip" data-plp-remove="${k}" data-value="${escapeHTML(String(v))}" aria-label="حذف فیلتر ${escapeHTML(String(l))}">${escapeHTML(String(l))}${icon('close')}</button>`).join('')+'<button type="button" class="plp-link" data-plp-clear>حذف همه</button>':'';
 $('#plp-active').hidden=!tags.length;$('#plp-reset').hidden=!tags.length;
 const fcount=tags.filter(t=>t[0]!=='q').length;$('#plp-filter-count').hidden=!fcount;$('#plp-filter-count').textContent=fa(fcount);
 // sort
 $$('[data-plp-sort]').forEach(s=>{const on=s.dataset.plpSort===plp.sort;s.setAttribute('aria-checked',on);s.tabIndex=on?0:-1});$('#plp-sort-current').textContent=plpSorts.find(s=>s[0]===plp.sort)[1];
 // results
 const shown=list.slice(0,plp.visible);
 $('#plp-grid').innerHTML=list.length?shown.map(p=>{const card=productCard(p,p.offer&&p.available);return p.available?card:card.replace(/<span class="card-price">[\s\S]*?<\/small><\/span>/,'<span class="plp-unavailable">ناموجود</span>').replace('<article class="related-card">','<article class="related-card is-unavailable">')}).join('')
  :`<div class="plp-empty"><span class="plp-empty-art">${icon('search')}</span><h2>${bad?'محدودهٔ قیمت درست نیست':'کالایی با این مشخصات پیدا نشد'}</h2><p>${bad?'قیمت شروع را کمتر از قیمت پایان وارد کنید.':plp.q?'عبارت دیگری جست‌وجو کنید یا بعضی از فیلترها را بردارید.':'بعضی از فیلترها را بردارید یا محدودهٔ قیمت را بیشتر کنید.'}</p>${tags.length?'<button type="button" class="plp-btn primary" data-plp-clear>حذف همهٔ فیلترها</button>':''}</div>`;
 $('#plp-count').innerHTML=`<b>${fa(list.length)}</b> کالا`;
 const more=list.length>plp.visible;$('#plp-more-wrap').hidden=!list.length;$('#plp-more').hidden=!more;
 $('#plp-progress-text').textContent=`${fa(shown.length)} کالا از ${fa(list.length)} کالا را دیده‌اید`;$('#plp-progress-bar').style.width=(list.length?shown.length/list.length*100:0)+'%';
 $('#plp-apply').textContent=list.length?`نمایش ${fa(list.length)} کالا`:'کالایی پیدا نشد';
 // guide
 const [gt,gx]=plpGuides[plp.cat];$('#plp-guide-title').textContent=gt;$('#plp-guide-text').innerHTML=gx;
 plpWriteURL();
}

/* ---------- Events ---------- */
function plpClear(){plp.q='';plp.brands.clear();plp.facets={};plp.min=plp.max=null;plp.stock=plp.sale=false;plp.visible=plpPage;$('#search').value='';plpRender()}
const plpChanged=()=>{plp.visible=plpPage;plpRender()};
$('#plp-cats').addEventListener('click',e=>{const b=e.target.closest('[data-plp-cat]');if(b){plpSetCat(b.dataset.plpCat);b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})}});
$('#plp-breadcrumb').addEventListener('click',e=>{if(e.target.closest('[data-plp-cat-link]')){e.preventDefault();plpSetCat('all')}});
$('#plp-brands').addEventListener('click',e=>{const b=e.target.closest('[data-plp-brand]');if(!b)return;const v=b.dataset.plpBrand;plp.brands.has(v)?plp.brands.delete(v):plp.brands.add(v);plpChanged()});
$('#plp-facets').addEventListener('change',e=>{const i=e.target.closest('input[data-f]');if(!i)return;const k=i.dataset.f,set=k==='brand'?plp.brands:(plp.facets[k]||=new Set());i.checked?set.add(i.value):set.delete(i.value);plpChanged()});
$('#plp-facets').addEventListener('input',e=>{if(!e.target.matches('[data-brand-search]'))return;const q=plpNorm(e.target.value);e.target.closest('.plp-group-body').querySelectorAll('.plp-option').forEach(l=>l.hidden=!l.dataset.optionLabel.includes(q))});
$('#plp-stock').addEventListener('change',e=>{plp.stock=e.target.checked;plpChanged()});
$('#plp-sale').addEventListener('change',e=>{plp.sale=e.target.checked;plpChanged()});
function plpRangeInput(which){const b=plpBounds(),lo=+$('#plp-min-range').value,hi=+$('#plp-max-range').value;if(which==='min'){const v=Math.min(lo,hi);plp.min=v<=b.lo?null:v}else{const v=Math.max(hi,lo);plp.max=v>=b.hi?null:v}plpChanged()}
$('#plp-min-range').addEventListener('input',()=>plpRangeInput('min'));$('#plp-max-range').addEventListener('input',()=>plpRangeInput('max'));
for(const [id,key] of [['#plp-min','min'],['#plp-max','max']]){const el=$(id);el.addEventListener('input',()=>{const n=plpNum(el.value);plp[key]=n;plpChanged()});el.addEventListener('blur',()=>plpRender());el.addEventListener('focus',()=>el.select())}
$('#plp-active').addEventListener('click',e=>{if(e.target.closest('[data-plp-clear]')){plpClear();return}const b=e.target.closest('[data-plp-remove]');if(!b)return;const k=b.dataset.plpRemove,v=b.dataset.value;
 if(k==='q'){plp.q='';$('#search').value=''}else if(k==='brand')plp.brands.delete(v);else if(k==='price')plp.min=plp.max=null;else if(k==='stock')plp.stock=false;else if(k==='sale')plp.sale=false;else plp.facets[k]?.delete(v);
 plpChanged();($('#plp-active .plp-chip')||$('#plp-grid')).focus()});
$('#plp-reset').addEventListener('click',plpClear);
$('#plp-grid').addEventListener('click',e=>{if(e.target.closest('[data-plp-clear]'))plpClear();else if(e.target.closest('[data-plp-product],[data-home-product]'))location.href=productPageURL()});
$('#plp-more').addEventListener('click',()=>{const first=plp.visible;plp.visible+=plpPage;plpRender();$$('#plp-grid .product-card-button')[first]?.focus({preventScroll:true})});
// Sort: desktop text tabs (radio group with arrow keys) and a mobile bottom sheet
$('#plp-sort-tabs').insertAdjacentHTML('beforeend',plpSorts.map(([v,l])=>`<button type="button" role="radio" class="plp-sort-tab" data-plp-sort="${v}">${l}</button>`).join(''));
$('#plp-sort-list').innerHTML=plpSorts.map(([v,l])=>`<button type="button" role="radio" class="plp-sort-option" data-plp-sort="${v}"><span>${l}</span>${icon('check')}</button>`).join('');
document.addEventListener('click',e=>{const b=e.target.closest('[data-plp-sort]');if(!b)return;plp.sort=b.dataset.plpSort;plpChanged();if(b.closest('#plp-sort-dialog'))$('#plp-sort-dialog').close()});
$('#plp-sort-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const i=plpSorts.findIndex(s=>s[0]===plp.sort),n=(i+(e.key==='ArrowLeft'?1:-1)+plpSorts.length)%plpSorts.length;plp.sort=plpSorts[n][0];plpChanged();$(`#plp-sort-tabs [data-plp-sort="${plp.sort}"]`).focus()});
$('#plp-open-sort').addEventListener('click',()=>openDialog('#plp-sort-dialog'));
// Mobile filter sheet
let plpLastFocus=null;
function plpCloseFilters(){const panel=$('#plp-filters');if(!panel.classList.contains('is-open'))return;panel.classList.remove('is-open');panel.removeAttribute('role');panel.removeAttribute('aria-modal');$('#plp-backdrop').hidden=true;document.body.classList.remove('plp-filter-open');$('#plp-open-filters').setAttribute('aria-expanded','false');plpLastFocus?.focus()}
$('#plp-open-filters').addEventListener('click',()=>{plpLastFocus=document.activeElement;const panel=$('#plp-filters');panel.classList.add('is-open');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');$('#plp-backdrop').hidden=false;document.body.classList.add('plp-filter-open');$('#plp-open-filters').setAttribute('aria-expanded','true');$('#plp-close-filters').focus()});
$('#plp-close-filters').addEventListener('click',plpCloseFilters);$('#plp-backdrop').addEventListener('click',plpCloseFilters);
$('#plp-apply').addEventListener('click',()=>{if(plpPriceInvalid()){$('#plp-min').focus();return}plpCloseFilters();$('#plp-results').scrollIntoView({behavior:'smooth',block:'start'})});
$('#plp-filters').addEventListener('keydown',e=>{if(!e.currentTarget.classList.contains('is-open'))return;if(e.key==='Escape'){e.preventDefault();plpCloseFilters()}if(e.key==='Tab'){const f=[...e.currentTarget.querySelectorAll('button,input,summary')].filter(n=>n.getClientRects().length&&!n.disabled);const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
matchMedia('(min-width:1024px)').addEventListener('change',e=>{if(e.matches)plpCloseFilters()});
$('#plp-guide-toggle').addEventListener('click',()=>{const b=$('#plp-guide-toggle'),open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));$('#plp-guide').classList.toggle('open',!open);b.firstChild.textContent=open?'بیشتر بخوانید':'نمایش کمتر'});
// Header search and mega menu stay on this page
navigateCatalog=function(query=''){plp.brands.clear();plp.facets={};plp.min=plp.max=null;plp.stock=plp.sale=false;if(!query)plp.cat='all';plpApplyQuery(query);$('#search').value=plp.q;plp.visible=plpPage;plpBuildBrands();plpBuildFacets();plpRender();$('#plp-results').scrollIntoView({behavior:'smooth',block:'start'})};

/* ---------- Boot ---------- */
plpReadURL();$('#search').value=plp.q;plpBuildCats();plpBuildBrands();plpBuildFacets();plpRender();setOverlayPosition();
$('.skip').href='#plp-grid';
