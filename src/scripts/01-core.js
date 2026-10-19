'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const asset=name=>'assets/'+name;
const fa=n=>Number(n).toLocaleString('fa-IR'), money=n=>fa(n)+' تومان';
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const configs=[{label:'8GB / 256GB',ram:'۸ گیگابایت',storage:'۲۵۶ گیگابایت SSD',price:64980000,old:68400000},{label:'16GB / 512GB',ram:'۱۶ گیگابایت',storage:'۵۱۲ گیگابایت SSD',price:84980000,old:89450000}];
const related=[{id:'air15plus',name:'مک‌بوک ایر ۱۵ اینچی M3',spec:'16GB RAM · 1TB SSD',price:109980000,image:'home/design/product-laptop.png'},{id:'air13',name:'مک‌بوک ایر ۱۳.۶ اینچی M3',spec:'8GB RAM · 256GB SSD',price:64980000,image:'home/design/product-laptop.png'},{id:'air16',name:'مک‌بوک ایر M3 با حافظه ۱۶ گیگابایت',spec:'16GB RAM · 512GB SSD',price:84980000,image:'home/design/product-laptop.png'},{id:'air15',name:'مک‌بوک ایر ۱۵ اینچی M3',spec:'8GB RAM · 256GB SSD',price:78980000,image:'home/design/product-laptop.png'},{id:'air15pro',name:'مک‌بوک ایر ۱۵ اینچی، نسخه ۵۱۲',spec:'16GB RAM · 512GB SSD',price:96980000,image:'home/design/product-laptop.png'}];
let selectedColor='میدنایت',selectedConfig=0,imageIndex=0,toastTimer;
const images=['hero.jpg','detail.jpg','display.jpg','lifestyle.jpg','hero.jpg','detail.jpg','display.jpg','lifestyle.jpg'];
const imageAlts=['نمای اصلی مک‌بوک ایر','نمای نزدیک صفحه‌کلید مک‌بوک ایر','نمایشگر مک‌بوک ایر','مک‌بوک ایر در محیط کار','نمای دوم بدنه مک‌بوک ایر','نمای دوم صفحه‌کلید مک‌بوک ایر','نمای دوم نمایشگر مک‌بوک ایر','نمای دوم محیط کار با مک‌بوک ایر'];
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{toast('ذخیره‌سازی مرورگر در دسترس نیست؛ تغییرات فعلاً در همین صفحه می‌مانند.')}}
let cart=read('rayax-cart-v1',[]);if(!Array.isArray(cart))cart=[];
cart=cart.filter(x=>x&&typeof x.key==='string'&&typeof x.name==='string'&&typeof x.color==='string'&&typeof x.config==='string'&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=5&&Number.isFinite(x.price)&&x.price>0&&(images.includes(x.image)||/^home\/(?:design\/)?[a-z-]+\.(?:webp|png)$/.test(x.image)));
let reviews=read('rayax-reviews-v1',[]);if(!Array.isArray(reviews))reviews=[];
reviews=reviews.filter(x=>x&&typeof x.name==='string'&&typeof x.text==='string'&&Number.isInteger(x.rating)&&x.rating>=1&&x.rating<=5);
function toast(text,type='info'){const el=$('#toast');el.textContent=text;el.className='toast visible '+type;if(type==='info'&&/ثبت|اضافه|کپی|ورود|خارج|حذف/.test(text))el.classList.replace('info','success');if(/حداقل|حداکثر|وارد کنید|در دسترس نیست/.test(text))el.classList.replace('info','warning');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500)}
const mobileModalMedia=matchMedia('(max-width:767px), (hover:none) and (pointer:coarse)');
let mobileModalScroll=null,mobileModalTheme=null;
function lockMobileModal(){
 if(!mobileModalMedia.matches||mobileModalScroll!==null)return;
 mobileModalScroll=window.scrollY;
 document.documentElement.style.setProperty('--modal-scroll-top',-mobileModalScroll+'px');
 document.documentElement.classList.add('mobile-modal-open');
 const theme=$('meta[name="theme-color"]');
 mobileModalTheme=theme?.getAttribute('content')??null;
 theme?.setAttribute('content','#ffffff');
}
function syncMobileModalState(){
 if(mobileModalMedia.matches&&$('dialog[open]')){lockMobileModal();return}
 if(mobileModalScroll===null)return;
 const scroll=mobileModalScroll;mobileModalScroll=null;
 document.documentElement.classList.remove('mobile-modal-open');
 document.documentElement.style.removeProperty('--modal-scroll-top');
 const theme=$('meta[name="theme-color"]');
 if(mobileModalTheme!==null)theme?.setAttribute('content',mobileModalTheme);
 mobileModalTheme=null;
 window.scrollTo({top:scroll,behavior:'instant'});
}
function openDialog(id){const dialog=$(id);if(dialog._closeTimer){clearTimeout(dialog._closeTimer);dialog._closeTimer=null;dialog.classList.remove('closing');return}if(!dialog.open){lockMobileModal();try{dialog.showModal()}catch(error){syncMobileModalState();throw error}}}
document.addEventListener('close',syncMobileModalState,true);
new MutationObserver(syncMobileModalState).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
mobileModalMedia.addEventListener('change',syncMobileModalState);
$$('[data-close]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
function info(title,html){$('#info-title').textContent=title;$('#info-content').innerHTML=html;openDialog('#info-dialog')}
const infoPages={account:['حساب کاربری','<p>ورود با شماره موبایل و مشاهده سفارش‌ها به اتصال سامانه فروشگاه نیاز دارد.</p>'],categories:['دسته‌بندی محصولات','<div class="info-links"><a href="#related" data-category-link>لپ‌تاپ و مک‌بوک ←</a><a href="#product" data-category-link>محصول منتخب رایاکس ←</a></div>'],about:['درباره رایاکس','<p>رایاکس، همراه انتخاب‌های هوشمندانه شما در دنیای دیجیتال.</p>'],contact:['مشاوره و ارتباط با رایاکس','<p>ساعت پاسخ‌گویی پیشنهادی: شنبه تا پنجشنبه، ۹ تا ۱۸.</p>'],shipping:['ارسال سفارش‌ها','<p>روش ارسال، هزینه و زمان تحویل در نسخه نهایی بر اساس نشانی و سیاست‌های واقعی فروشگاه محاسبه می‌شود.</p>'],returns:['بازگشت کالا',''],warranty:['گارانتی و اصالت کالا','<p>محل نمایش اطلاعات گارانتی و تضمین اصالت محصول است. شرکت ارائه‌دهنده و مدت واقعی گارانتی پس از اتصال اطلاعات فروشگاه مشخص خواهد شد.</p>']};
Object.assign(infoPages,{articles:['مقالات و راهنمای خرید','<p>راهنمای انتخاب مک‌بوک و مشخصات محصول در بخش معرفی همین صفحه در دسترس است.</p><div class="info-links"><a href="#overview" data-category-link>معرفی و راهنمای محصول</a></div>'],terms:['قوانین و مقررات',''],privacy:['حریم خصوصی',''],trust:['نمادها و پرداخت','']});
$$('[data-info]').forEach(btn=>btn.addEventListener('click',event=>{if(btn.dataset.info==='contact')location.href=contactPageURL();else if(btn.dataset.info==='articles'){event?.preventDefault();location.href=blogPageURL()}else info(...infoPages[btn.dataset.info])}));
$('#info-content').addEventListener('click',e=>{if(e.target.closest('[data-category-link]'))$('#info-dialog').close()});

// Animated dialog close: play the exit animation, then really close (Escape goes through the same path)
{const nativeClose=HTMLDialogElement.prototype.close;
HTMLDialogElement.prototype.close=function(value){if(!this.open||this._closeTimer||matchMedia('(prefers-reduced-motion: reduce)').matches)return nativeClose.call(this,value);this.classList.add('closing');this._closeTimer=setTimeout(()=>{this._closeTimer=null;this.classList.remove('closing');nativeClose.call(this,value)},190)};
document.addEventListener('cancel',e=>{if(e.target instanceof HTMLDialogElement&&!e.defaultPrevented){e.preventDefault();e.target.close()}},true);}
