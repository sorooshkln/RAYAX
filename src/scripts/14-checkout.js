/* Checkout: cart → sign-in (modal) → buyer info, address and delivery → payment → result.
   Prototype data only: no real identity, payment or inventory backend. */
const ckSteps=[['cart','سبد خرید'],['details','اطلاعات و ارسال'],['payment','پرداخت']];
const ckShipping=[{id:'post',name:'پست پیشتاز',sub:'سرویس عادی',eta:'۲ تا ۴ روز کاری',price:90000,icon:'truck'},{id:'courier',name:'پیک رایاکس',sub:'تهران و کرج',eta:'تحویل از فردا',price:150000,icon:'box'}];
const ckPayments=[{id:'online',name:'پرداخت اینترنتی',note:'پرداخت آنلاین با همه کارت‌های عضو شتاب',icon:'card'},{id:'snapp',name:'خرید اقساطی اسنپ‌پی',note:'پرداخت در ۴ قسط',image:'snapp-pay.png',chip:'۴ قسط'}];
const ckCodes={RAYAX10:{percent:10,max:5000000,label:'۱۰٪ تخفیف تا سقف ۵ میلیون تومان'}};
const ckMonths=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const ckSwatches={'میدنایت':'#2c3442','نقره‌ای':'#d9dadb','طلایی':'#efd9c0','خاکستری فضایی':'#7d7e80','تیتانیوم':'#b9b2a6','مشکی':'#1e1e1e','سفید':'#ffffff'};
const ckSuggested=[{id:'watch',name:'ساعت هوشمند مدل Ultra با بند مشکی',brand:'RAYAX',label:'ساعت هوشمند',image:'home/design/product-watch.png',price:17980000},{id:'buds',name:'هدفون بی‌سیم با کیس شارژ جمع‌وجور',brand:'RAYAX',label:'هدفون و هندزفری',image:'home/design/product-buds.png',price:2490000},{id:'ssd',name:'حافظه SSD اکسترنال لکسار با طراحی سبک',brand:'RAYAX',label:'حافظه و ذخیره‌سازی',image:'home/design/product-ssd.png',price:3490000},{id:'speaker',name:'اسپیکر قابل حمل با نورپردازی رنگی',brand:'RAYAX',label:'اسپیکر',image:'home/design/product-speaker.png',price:3980000},{id:'band',name:'مچ‌بند هوشمند با نمایشگر رنگی',brand:'RAYAX',label:'ساعت و مچ‌بند',image:'home/design/product-band.png',price:1790000},{id:'router',name:'روتر بی‌سیم دو آنتن مناسب خانه و محل کار',brand:'RAYAX',label:'شبکه و ارتباطات',image:'home/design/product-router.png',price:2490000}];

const ckPlain=s=>String(s??'').replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const ckDigits=s=>String(s??'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const ckSaved=(()=>{try{return JSON.parse(sessionStorage.getItem('rayax-checkout-v1'))||{}}catch{return {}}})();
const ck={step:'cart',address:ckSaved.address||null,ship:ckSaved.ship||null,day:ckSaved.day??null,pay:ckSaved.pay||'online',code:ckSaved.code||null,wallet:!!ckSaved.wallet,order:null,errors:{}};
function ckPersist(){try{sessionStorage.setItem('rayax-checkout-v1',JSON.stringify({address:ck.address,ship:ck.ship,day:ck.day,pay:ck.pay,code:ck.code,wallet:ck.wallet}))}catch{}}
let ckAddresses=accountAddresses();ckAddresses=Array.isArray(ckAddresses)?ckAddresses.filter(a=>a&&typeof a.id==='string'&&typeof a.address==='string'&&typeof a.postal==='string'):[];
if(!ckAddresses.some(a=>a.id===ck.address))ck.address=accountProfile().defaultAddress||ckAddresses[0]?.id||null;

/* Session & buyer profile (keyed by verified mobile) */
const ckPhone=()=>{try{return JSON.parse(sessionStorage.getItem('rayax-session-v1'))?.phone||''}catch{return ''}};
const ckProfiles=()=>{const p=read('rayax-profiles-v1',{});return p&&typeof p==='object'&&!Array.isArray(p)?p:{}};
const ckProfile=()=>ckProfiles()[ckPhone()]||{};
function ckSaveProfile(patch){const all=ckProfiles(),phone=ckPhone();if(!phone)return;all[phone]={...all[phone],...patch};save('rayax-profiles-v1',all)}
function ckNidValid(v){if(!/^\d{10}$/.test(v)||/^(\d)\1{9}$/.test(v))return false;const c=+v[9],s=[...v.slice(0,9)].reduce((t,d,i)=>t+ +d*(10-i),0)%11;return s<2?c===s:c===11-s}
console.assert(ckNidValid('0499370899')&&!ckNidValid('0499370898')&&!ckNidValid('1111111111'),'national-id checksum');
function ckProfileErrors(p=ckProfile()){const e={};if((p.first||'').trim().length<2)e.first='نام را وارد کنید.';if((p.last||'').trim().length<2)e.last='نام خانوادگی را وارد کنید.';if(!ckNidValid(ckDigits(p.nid||'')))e.nid='کد ملی ۱۰ رقمی معتبر وارد کنید.';if(!p.bd||!p.bm||!p.by)e.birth='روز، ماه و سال تولد را انتخاب کنید.';if(p.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email))e.email='نشانی ایمیل درست نیست.';return e}
const ckFullName=(p=ckProfile())=>[p.first,p.last].filter(Boolean).join(' ').trim();

/* Money */
const ckOld=p=>p.old||(p.key?.startsWith('air13-')?configs.find(c=>c.label===p.config)?.old:0)||0;
const ckSub=()=>cart.reduce((s,p)=>s+p.price*p.qty,0);
const ckList=()=>cart.reduce((s,p)=>s+Math.max(ckOld(p),p.price)*p.qty,0);
const ckCount=()=>cart.reduce((s,p)=>s+p.qty,0);
const ckDiscount=()=>{const c=ckCodes[ck.code];return c?Math.min(Math.floor(ckSub()*c.percent/100),c.max):0};
const ckShip=()=>ckShipping.find(s=>s.id===ck.ship)||null;
const ckGross=()=>ckSub()-ckDiscount()+(ck.step!=='cart'&&ckShip()?ckShip().price:0);
// Wallet credit lives in the account panel's browser-local ledger (rayax-account-state-v1), keyed by verified mobile
function ckWalletBalance(){const all=read('rayax-account-state-v1',{}),st=all&&typeof all==='object'?all[ckPhone()]:null;return Array.isArray(st?.transactions)?Math.max(0,st.transactions.reduce((t,x)=>t+(x.status==='success'&&Number.isFinite(x.amount)?x.amount:0),0)):0}
const ckWalletUse=()=>ck.wallet&&ck.step==='payment'?Math.min(ckWalletBalance(),ckGross()):0;
const ckTotal=()=>ckGross()-ckWalletUse();
const ckDays=(()=>{const f=o=>new Intl.DateTimeFormat('fa-IR-u-ca-persian',o),wd=f({weekday:'long'}),dt=f({day:'numeric',month:'long'}),dn=f({day:'numeric'}),mn=f({month:'long'});return Array.from({length:8},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i+1);return {label:i===0?'فردا':wd.format(d),date:dt.format(d),num:dn.format(d),month:mn.format(d)}})})();
const ckAddress=()=>ckAddresses.find(a=>a.id===ck.address)||null;
const ckToman=n=>`<b>${fa(n)}</b> <small>تومان</small>`;

/* ---------- Routing ---------- */
function ckHash(){const h=location.hash.slice(1);return ['cart','details','payment','success','failed'].includes(h)?h:'cart'}
function ckReady(){return !Object.keys(ckProfileErrors()).length&&ckAddress()&&ckShip()&&ck.day!==null}
function ckGuard(step){if(['details','payment'].includes(step)&&(!cart.length||!sessionUser||!ckPhone()))return 'cart';if(step==='payment'&&!ckReady())return 'details';if(['success','failed'].includes(step)&&!ck.order)return 'cart';return step}
function ckGo(step,replace=false){step=ckGuard(step);if(location.hash!=='#'+step)history[replace?'replaceState':'pushState'](null,'','#'+step);ck.errors={};ckRender(step,true)}
window.addEventListener('popstate',()=>{ck.errors={};ckRender(ckGuard(ckHash()),true)});

/* ---------- Shell ---------- */
function ckRender(step=ck.step,focus=false){
  ck.step=step;const result=['success','failed'].includes(step);
  document.body.classList.toggle('ck-focus',step!=='cart');
  const titles={cart:'سبد خرید',details:'اطلاعات و ارسال',payment:'پرداخت'},back={details:'cart',payment:'details'}[step];
  const cur=ckSteps.findIndex(s=>s[0]===step);
  $('#ck-top').hidden=result;
  if(!result)$('#ck-top').innerHTML=`<div class="ck-top-title">${back?`<button class="ck-back" data-ck="go" data-to="${back}" aria-label="بازگشت به ${ckSteps.find(s=>s[0]===back)[1]}">${icon('arrow-right')}</button>`:''}<h1 tabindex="-1">${titles[step]}</h1></div><ol class="ck-steps" aria-label="مراحل خرید">${ckSteps.map(([id,label],i)=>`<li class="${i<cur?'done':i===cur?'current':'todo'}" ${i===cur?'aria-current="step"':''}>${i<cur?`<button data-ck="go" data-to="${id}"><span class="ck-dot">${icon('check')}</span>${label}</button>`:`<span class="ck-dot"></span><span>${label}</span>`}</li>`).join('')}</ol>`;
  $('#ck-view').innerHTML={cart:ckCartView,details:ckDetailsView,payment:ckPaymentView,success:ckSuccessView,failed:ckFailedView}[step]();
  if(focus){window.scrollTo({top:0,behavior:'instant'});(result?$('#ck-view h1'):$('#ck-top h1'))?.focus({preventScroll:true})}
}
const ckSecHead=(title,ic,extra='',desc='')=>`<header class="ck-sec-head ${desc?'rich':''}">${desc?`<span class="ck-sec-tile">${icon(ic)}</span><span class="ck-sec-titles"><h2>${title}</h2><span>${desc}</span></span>`:`<h2>${ic?`<span class="ck-sec-icon">${icon(ic)}</span>`:''}${title}</h2>`}${extra}</header>`;
function ckCTA(label){return `<div class="ck-cta"><div class="ck-cta-total"><span>قابل پرداخت</span><p>${ckToman(ckTotal())}</p></div><button class="ck-btn primary lg" data-ck="next">${label}${icon('arrow')}</button></div>`}

/* ---------- Step 1: cart ---------- */
function ckQty(p,i){return `<div class="ck-qty qty-control" role="group" aria-label="تعداد ${escapeHTML(p.name)}"><button data-ck="qty" data-i="${i}" data-d="1" aria-label="افزودن یک عدد" ${p.qty>=5?'disabled':''}>${icon('plus')}</button><output>${fa(p.qty)}</output>${p.qty>1?`<button data-ck="qty" data-i="${i}" data-d="-1" aria-label="کم کردن یک عدد">${icon('minus')}</button>`:`<button class="danger" data-ck="remove" data-i="${i}" aria-label="حذف ${escapeHTML(p.name)} از سبد">${icon('trash')}</button>`}</div>`}
function ckCartView(){
  if(!cart.length)return `<div class="ck-empty"><span class="ck-empty-art">${icon('cart')}</span><h2>سبد خرید شما خالی است</h2><p>برای دیدن محصولات بیشتر به صفحه اصلی بروید.</p><a class="ck-btn primary" href="${homePageURL()}">مشاهده محصولات</a></div>${ckSuggestHTML()}`;
  const save=ckList()-ckSub();
  return `<div class="ck-grid"><section class="ck-main ck-panel">${ckSecHead(`کالاهای سبد خرید <span class="ck-count">${fa(ckCount())}</span>`,'')}
  <ul class="ck-items">${cart.map((p,i)=>{const old=ckOld(p),off=old>p.price?Math.round((1-p.price/old)*100):0,sw=ckSwatches[p.color];return `<li class="ck-item"><div class="ck-item-media"><img src="${asset(p.image)}" alt=""></div><div class="ck-item-body"><h3>${escapeHTML(p.name)}</h3><ul class="ck-attrs"><li>رنگ: ${sw?`<i class="ck-swatch" style="background:${sw}"></i>`:''}<b>${escapeHTML(p.color)}</b></li><li>مشخصات: <b><bdi>${escapeHTML(p.config)}</bdi></b></li></ul><ul class="ck-item-meta"><li>${icon('clock')}ارسال از ۲ روز کاری آینده</li></ul></div><div class="ck-item-end"><div class="ck-item-price">${off?`<p class="ck-was"><del>${fa(old*p.qty)}</del><span class="ck-off">${fa(off)}٪</span></p>`:''}<p class="ck-now">${ckToman(p.price*p.qty)}</p></div>${ckQty(p,i)}</div></li>`}).join('')}</ul></section>
  <aside class="ck-aside"><div class="ck-sum ck-panel">${ckSecHead('مجموع قابل پرداخت','')}<dl class="ck-rows"><div><dt>${icon('box')}قیمت کالاها (${fa(ckCount())} کالا)</dt><dd>${ckToman(ckList())}</dd></div>${save?`<div class="save"><dt>${icon('percent')}سود شما از خرید (${fa(Math.round(save/ckList()*100))}٪)</dt><dd>${ckToman(save)}</dd></div>`:''}</dl><div class="ck-total"><span>قابل پرداخت</span><p>${ckToman(ckSub())}</p></div>${sessionUser?.phone?`<p class="ck-perk"><span class="ck-tile sm">${icon('wallet')}</span><span>${ckWalletBalance()>0?`موجودی کیف پول: <b>${money(ckWalletBalance())}</b> — در مرحله پرداخت قابل استفاده است`:'پرداخت با کیف پول رایاکس در مرحله پرداخت'}</span></p>`:''}<p class="ck-perk"><span class="ck-snapp"><img src="${asset('snapp-pay.png')}" alt="Snapp! Pay" width="36" height="22"></span><span>امکان خرید <b>۴ قسطه</b> با اسنپ‌پی در مرحله پرداخت</span></p>${ckCTA('ادامه فرایند خرید')}<p class="ck-sum-note">${icon('info')}هزینه ارسال در مرحله بعد محاسبه می‌شود.</p></div></aside></div>${ckSuggestHTML()}`;
}
function ckSuggestHTML(){return `<section class="ck-suggest">${ckSecHead('کالاهای پیشنهادی','',`<div class="ck-rail-nav"><button class="ck-rail-btn" data-ck="rail" data-d="1" aria-label="قبلی">${icon('right')}</button><button class="ck-rail-btn" data-ck="rail" data-d="-1" aria-label="بعدی">${icon('arrow')}</button></div>`)}<div class="ck-rail catalog-cards" id="ck-rail">${ckSuggested.map(p=>productCard(p,false,'data-ck-product')).join('')}</div></section>`}

/* ---------- Step 2: buyer info, address, delivery ---------- */
function ckErr(key){return ck.errors[key]?`<p class="ck-error" id="err-${key}">${icon('warning')}${ck.errors[key]}</p>`:''}
function ckInput(key,label,val,attrs='',ic='user'){return `<div class="ck-field ${ck.errors[key]?'invalid':''}"><label for="pf-${key}">${label}</label><span class="ck-ctl">${icon(ic)}<input id="pf-${key}" data-pf="${key}" value="${escapeHTML(val||'')}" ${attrs} ${ck.errors[key]?`aria-invalid="true" aria-describedby="err-${key}"`:''}></span>${ckErr(key)}</div>`}
function ckDetailsView(){
  const live=ckValidateDetails();for(const k in ck.errors)if(!live[k])delete ck.errors[k];
  const p=ckProfile(),years=Array.from({length:86},(_,i)=>1392-i);
  const sel=(key,label,opts,val)=>`<select id="pf-${key}" data-pf="${key}" aria-label="${label} تولد" ${ck.errors.birth?'aria-invalid="true" aria-describedby="err-birth"':''}><option value="">${label}</option>${opts.map(([v,t])=>`<option value="${v}" ${String(val)===String(v)?'selected':''}>${t}</option>`).join('')}</select>`;
  const person=`<section class="ck-panel" id="sec-person">${ckSecHead('مشخصات خریدار','idcard','','برای صدور فاکتور و تحویل سفارش به نام شما')}
   <div class="ck-form-grid">${ckInput('first','نام',p.first,'autocomplete="given-name" maxlength="30"','user')}${ckInput('last','نام خانوادگی',p.last,'autocomplete="family-name" maxlength="40"','user')}${ckInput('nid','کد ملی',ckDigits(p.nid),'inputmode="numeric" dir="ltr" maxlength="10" placeholder="۱۰ رقم"','idcard')}
   <div class="ck-field ${ck.errors.birth?'invalid':''}" role="group" aria-labelledby="lbl-birth"><span class="ck-label" id="lbl-birth">تاریخ تولد</span><span class="ck-ctl ck-birth-row">${icon('calendar')}${sel('bd','روز',Array.from({length:31},(_,i)=>[i+1,fa(i+1)]),p.bd)}${sel('bm','ماه',ckMonths.map((m,i)=>[i+1,m]),p.bm)}${sel('by','سال',years.map(y=>[y,ckPlain(y)]),p.by)}</span>${ckErr('birth')}</div>
   <div class="ck-field"><label for="pf-mobile">شماره موبایل</label><span class="ck-ctl ck-verified">${icon('phone')}<input id="pf-mobile" value="${ckPlain(ckPhone())}" dir="ltr" readonly aria-describedby="pf-mobile-note"><span id="pf-mobile-note">${icon('seal-check')}</span></span></div>
   ${ckInput('email','ایمیل <small>(اختیاری)</small>',p.email,'type="email" autocomplete="email" dir="ltr" maxlength="80" placeholder="name@example.com"','envelope')}</div></section>`;
  const list=ckAddresses.length?`<div class="ck-addresses" role="radiogroup" aria-label="آدرس تحویل">${ckAddresses.map(a=>`<div class="ck-address"><label class="ck-address-main"><input type="radio" name="address" value="${a.id}" ${a.id===ck.address?'checked':''}><span class="ck-address-pin">${icon('pin')}</span><span class="ck-address-text"><b>${escapeHTML(a.address)}${a.plate?`، پلاک ${ckPlain(a.plate)}`:''}${a.unit?`، واحد ${ckPlain(a.unit)}`:''}</b><span>${escapeHTML(a.province)}، ${escapeHTML(a.city)}</span><span class="ck-tags"><i>${icon('user')}${escapeHTML(a.self?ckFullName()||'خودم':a.name)}</i><i>${icon('phone')}<bdi>${ckPlain(a.self?ckPhone():a.mobile)}</bdi></i><i>${icon('envelope')}کد پستی <bdi>${ckPlain(a.postal)}</bdi></i></span></span><span class="ck-radio"></span></label><div class="ck-address-actions"><button class="ck-link" data-ck="edit-address" data-id="${a.id}">${icon('pencil')}ویرایش</button><button class="ck-link danger" data-ck="delete-address" data-id="${a.id}">${icon('trash')}حذف</button></div></div>`).join('')}</div>`
    :`<div class="ck-empty-state"><span class="ck-empty-art">${icon('pin')}</span><b>تا به حال آدرسی ثبت نشده است!</b><p>برای ادامه فرایند خرید و دریافت سفارش، لطفاً آدرس خود را ثبت کنید.</p><button class="ck-btn soft" data-ck="add-address">${icon('plus')}ثبت آدرس جدید</button></div>`;
  const address=`<section class="ck-panel" id="sec-address">${ckSecHead('آدرس تحویل','pin',ckAddresses.length?`<button class="ck-btn soft sm" data-ck="add-address">${icon('plus')}افزودن آدرس جدید</button>`:'','سفارش به این نشانی ارسال می‌شود')}${list}${ckErr('address')}</section>`;
  const ship=`<section class="ck-panel" id="sec-ship">${ckSecHead('نحوه ارسال','truck','','روش مناسب برای تحویل سفارش را انتخاب کنید')}<div class="ck-ship" role="radiogroup" aria-label="نحوه ارسال">${ckShipping.map(s=>`<label class="ck-ship-card"><input type="radio" name="ship" value="${s.id}" ${s.id===ck.ship?'checked':''}><span class="ck-ship-top"><span class="ck-tile">${icon(s.icon)}</span><span class="ck-ship-name"><b>${s.name} ${s.id==='courier'?'':`<small>(${s.sub})</small>`}</b>${s.id==='courier'?`<i class="ck-chip">${icon('pin')}تهران و کرج</i>`:`<i class="ck-chip">${icon('clock')}${s.eta}</i>`}</span><span class="ck-radio"></span></span><span class="ck-ship-foot"><span>بسته‌بندی و ارسال:</span><span>${ckToman(s.price)}</span></span></label>`).join('')}</div>${ckErr('ship')}</section>`;
  const time=`<section class="ck-panel" id="sec-time">${ckSecHead('روز ارسال','calendar',``,'سفارش در طول روز انتخابی تحویل داده می‌شود')}<div class="ck-days" id="ck-days" role="radiogroup" aria-label="روز ارسال">${ckDays.map((d,i)=>`<label class="ck-day"><input type="radio" name="day" value="${i}" ${ck.day===i?'checked':''}><span><i>${d.month}</i><strong>${d.num}</strong><b>${d.label}</b></span></label>`).join('')}</div>${ckErr('time')}</section>`;
  return `<div class="ck-grid"><div class="ck-main">${person}${address}${ship}${time}</div><aside class="ck-aside">${ckSummary('ادامه و انتخاب روش پرداخت')}</aside></div>`;
}

/* ---------- Step 3: payment ---------- */
function ckPaymentView(){
  const a=ckAddress(),s=ckShip(),d=ckDays[ck.day];
  const code=ck.code?`<div class="ck-applied">${icon('seal-check')}<span><b dir="ltr">${ck.code}</b><small>${ckCodes[ck.code].label}</small></span><button class="ck-link danger" data-ck="remove-code">حذف کد</button></div>`
    :`<div class="ck-code-head"><h2><span class="ck-sec-icon">${icon('percent')}</span>کد تخفیف</h2><button class="ck-pill" data-ck="toggle-code" aria-expanded="false" aria-controls="ck-code-row">افزودن کد تخفیف ${icon('down')}</button></div><p class="ck-code-hint">اگر کد تخفیف دارید، آن را وارد کنید تا از مبلغ سفارش کم شود.</p><div class="ck-code-row" id="ck-code-row" hidden><div class="ck-inline"><input id="ck-code" dir="ltr" autocomplete="off" maxlength="20" placeholder="مثلاً RAYAX10" aria-label="کد تخفیف" aria-describedby="ck-code-err"><button class="ck-btn secondary" data-ck="apply-code">ثبت کد</button></div><p class="ck-error" id="ck-code-err" hidden></p></div>`;
  const bal=ckWalletBalance(),use=ckWalletUse(),full=use>0&&ckTotal()===0;
  const wallet=`<section class="ck-panel ck-wallet">${bal>0?`<button type="button" class="ck-wallet-row" data-ck="wallet" role="switch" aria-checked="${ck.wallet}"><span class="ck-tile">${icon('wallet')}</span><span class="ck-wallet-text"><b>پرداخت با کیف پول رایاکس</b><small>موجودی: ${money(bal)}${use?` · <em>${money(use)} کسر می‌شود</em>`:''}</small></span><span class="ck-toggle" aria-hidden="true"></span></button>`:`<div class="ck-wallet-row is-empty"><span class="ck-tile">${icon('wallet')}</span><span class="ck-wallet-text"><b>پرداخت با کیف پول رایاکس</b><small>موجودی کیف پول شما صفر است.</small></span><a class="ck-link" href="${accountPageURL('wallet')}">شارژ کیف پول</a></div>`}</section>`;
  return `<div class="ck-grid"><div class="ck-main">${wallet}
  <section class="ck-panel ${full?'ck-disabled':''}">${ckSecHead(full?'روش پرداخت (نیازی نیست)':'انتخاب روش پرداخت','card')}${full?'<p class="ck-code-hint">کل مبلغ سفارش با اعتبار کیف پول پرداخت می‌شود.</p>':''}<div class="ck-pays" role="radiogroup" aria-label="روش پرداخت">${ckPayments.map(p=>`<label class="ck-pay"><input type="radio" name="pay" value="${p.id}" ${p.id===ck.pay?'checked':''}><span class="ck-radio"></span><span class="ck-tile ${p.image?'snapp':''}">${p.image?`<img src="${asset(p.image)}" alt="" width="36" height="22">`:icon(p.icon)}</span><span class="ck-pay-text"><b>${p.name}${p.chip?` <i class="ck-chip blue">${p.chip}</i>`:''}</b><span>${p.note}</span></span></label>`).join('')}</div></section>
  <section class="ck-panel ck-code">${code}</section>
  <section class="ck-panel">${ckSecHead('خلاصه تحویل','receipt')}<dl class="ck-review"><div><dt>${icon('user')}خریدار</dt><dd><b>${escapeHTML(ckFullName())}</b><span><bdi>${ckPlain(ckPhone())}</bdi></span></dd><button class="ck-link" data-ck="go" data-to="details">ویرایش</button></div><div><dt>${icon('pin')}آدرس</dt><dd><b>${escapeHTML(a.address)}</b><span>${escapeHTML(a.province)}، ${escapeHTML(a.city)} · کد پستی <bdi>${ckPlain(a.postal)}</bdi></span></dd><button class="ck-link" data-ck="go" data-to="details">ویرایش</button></div><div><dt>${icon('truck')}ارسال</dt><dd><b>${s.name}</b><span>${d.label} ${d.date}</span></dd><button class="ck-link" data-ck="go" data-to="details">ویرایش</button></div></dl></section>
  <p class="ck-notice"><span>${icon('info')}</span>پس از پرداخت، فاکتور و وضعیت ارسال در «سفارش‌های من» در دسترس است.</p>
  </div><aside class="ck-aside">${ckSummary('تأیید و پرداخت')}</aside></div>`;
}
function ckSummary(label){
  const s=ckShip(),disc=ckDiscount();
  return `<div class="ck-sum ck-panel">${ckSecHead('مجموع سبد خرید','')}<div class="ck-sum-items ${cart.length>5&&!ck.sumOpen?'clamped':''}" id="ck-sum-items"><p class="ck-sum-label">${icon('cart')}کالاهای انتخابی شما <span>${fa(ckCount())} کالا</span></p><ul>${cart.map(p=>`<li><span class="ck-sum-thumb"><img src="${asset(p.image)}" alt=""><i>${fa(p.qty)}</i></span><span class="ck-sum-info"><span class="ck-sum-name">${escapeHTML(p.name)}</span><small><bdi>${escapeHTML(p.config)}</bdi></small><span class="ck-sum-price">${ckToman(p.price*p.qty)}</span></span></li>`).join('')}</ul>${cart.length>5?`<button class="ck-more" data-ck="sum-toggle" aria-expanded="${!!ck.sumOpen}" aria-controls="ck-sum-items">${ck.sumOpen?`نمایش کمتر${icon('up')}`:`نمایش ${fa(cart.length-5)} کالای دیگر${icon('down')}`}</button>`:''}</div>
  <dl class="ck-rows"><div><dt>${icon('box')}قیمت کالاها (${fa(ckCount())})</dt><dd>${ckToman(ckSub())}</dd></div>${disc?`<div class="save"><dt>${icon('tag')}کد تخفیف <bdi>${ck.code}</bdi></dt><dd>−${ckToman(disc)}</dd></div>`:''}<div><dt>${icon('truck')}نحوه ارسال</dt><dd>${s?`<span class="ck-ship-mini">${s.name} ·</span> ${ckToman(s.price)}`:'<span class="ck-muted">تعیین نشده</span>'}</dd></div>${ckWalletUse()?`<div class="save"><dt>${icon('wallet')}اعتبار کیف پول</dt><dd>−${ckToman(ckWalletUse())}</dd></div>`:''}</dl>
  <div class="ck-total"><span>مبلغ قابل پرداخت</span><p>${ckToman(ckTotal())}</p></div>${ckCTA(label)}<p class="ck-sum-note">${icon('lock')}پرداخت امن از طریق درگاه بانکی معتبر</p></div>`;
}

/* ---------- Results ---------- */
function ckReceipt(kind,o){
  const ok=kind==='ok',rows=ok?[['receipt','شماره سفارش',`<bdi>${o.id}</bdi>`],['calendar','تاریخ ثبت',o.date],['card','روش پرداخت',o.pay],['truck','زمان ارسال',o.when],['box','تعداد کالا',`${fa(o.count)} کالا`]]:[['card','روش پرداخت',o.pay],['calendar','تاریخ تلاش',o.date],['box','تعداد کالا',`${fa(o.count)} کالا`]];
  return `<div class="ck-receipt ${kind}"><div class="ck-receipt-top"><img src="${asset('logo-dark.svg')}" alt="RAYAX" width="96" height="26"><span class="ck-receipt-tag">${icon(ok?'seal-check':'warning')}${ok?'رسید پرداخت':'پرداخت انجام نشد'}</span></div>
  <div class="ck-receipt-amount"><span>${ok?'مبلغ پرداخت‌شده':'مبلغ سفارش'}</span><p>${ckToman(o.total)}</p></div>
  <dl class="ck-receipt-rows">${rows.map(([ic,k,v])=>`<div><dt>${icon(ic)}${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
  ${ok?`<div class="ck-receipt-cut" aria-hidden="true"></div><ul class="ck-receipt-items">${o.items.map(p=>`<li><span class="ck-sum-thumb"><img src="${asset(p.image)}" alt=""><i>${fa(p.qty)}</i></span><span class="ck-sum-info"><span class="ck-sum-name">${escapeHTML(p.name)}</span><small><bdi>${escapeHTML(p.config)}</bdi></small></span><span class="ck-sum-price">${ckToman(p.price*p.qty)}</span></li>`).join('')}</ul>`:''}</div>`;
}
function ckSuccessView(){
  return `<section class="ck-result ok"><span class="ck-result-icon">${icon('check')}</span><h1 tabindex="-1">پرداخت با موفقیت انجام شد</h1><p class="ck-result-sub">سفارش شما ثبت شد و به‌زودی آماده ارسال می‌شود. وضعیت سفارش را از «سفارش‌های من» دنبال کنید.</p>${ckReceipt('ok',ck.order)}<div class="ck-result-actions"><button class="ck-btn ghost" data-ck="orders">${icon('box')}پیگیری سفارش</button><a class="ck-btn primary" href="${homePageURL()}">بازگشت به فروشگاه${icon('arrow')}</a></div></section>`;
}
function ckFailedView(){
  const o={total:ckTotal(),pay:ckPayments.find(p=>p.id===ck.pay).name,date:new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'long'}).format(new Date()),count:ckCount()};
  return `<section class="ck-result bad"><span class="ck-result-icon">${icon('close')}</span><h1 tabindex="-1">پرداخت ناموفق بود</h1><p class="ck-result-sub">پرداخت لغو شد یا بانک آن را تأیید نکرد. سفارش ثبت نشده است.</p>${ckReceipt('bad',o)}<ul class="ck-result-notes"><li>${icon('cart')}کالاهای شما در سبد خرید باقی مانده‌اند.</li><li>${icon('clock')}اگر مبلغی کسر شده، حداکثر تا ۷۲ ساعت به حساب شما بازمی‌گردد.</li><li>${icon('phone')}در صورت تکرار مشکل با پشتیبانی تماس بگیرید: <bdi>۰۲۱-۱۲۴۴۲۵۲۴</bdi></li></ul><div class="ck-result-actions"><button class="ck-btn ghost" data-ck="go" data-to="cart">${icon('cart')}بازگشت به سبد خرید</button><button class="ck-btn primary" data-ck="retry">تلاش دوباره برای پرداخت${icon('arrow')}</button></div></section>`;
}

/* ---------- Actions ---------- */
function ckValidateDetails(){
  const e=ckProfileErrors();
  if(!ckAddress())e.address='برای ادامه، آدرس تحویل را ثبت یا انتخاب کنید.';
  if(!ckShip())e.ship='یکی از روش‌های ارسال را انتخاب کنید.';
  if(ck.day===null)e.time='روز ارسال را انتخاب کنید.';
  return e;
}
function ckNext(){
  if(ck.step==='cart'){if(!cart.length)return;if(!sessionUser||!ckPhone()){ckOpenAuth();return}ckGo('details');return}
  if(ck.step==='details'){
    ck.errors=ckValidateDetails();
    if(Object.keys(ck.errors).length){ckRender();const el=$({first:'#pf-first',last:'#pf-last',nid:'#pf-nid',birth:'#pf-bd',email:'#pf-email',address:'#sec-address',ship:'#sec-ship',time:'#sec-time'}[Object.keys(ck.errors)[0]]);el.scrollIntoView({behavior:'smooth',block:'center'});if(el.matches('input,select'))el.focus({preventScroll:true});toast('لطفاً موارد مشخص‌شده را کامل کنید.');return}
    const name=ckFullName();sessionUser={...sessionUser,name,phone:ckPhone()};try{sessionStorage.setItem('rayax-session-v1',JSON.stringify(sessionUser))}catch{}paintAccount();ckGo('payment');return}
  if(ck.step==='payment'){if(ckTotal()===0)ckFinish();else ckOpenGateway()}
}
function ckClearErr(key){if(!ck.errors[key])return;delete ck.errors[key];const e=$('#err-'+key);e?.closest('.ck-field')?.classList.remove('invalid');e?.remove();$$(`[aria-describedby="err-${key}"]`).forEach(x=>{x.removeAttribute('aria-invalid');x.removeAttribute('aria-describedby')})}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-ck-product]')){location.href=location.pathname.endsWith('index.html')?'../rayax-product/index.html':'rayax-product.html';return}
  const b=e.target.closest('[data-ck]');if(!b)return;const act=b.dataset.ck;
  if(act==='wallet'){ck.wallet=!ck.wallet;ckPersist();ckRender();$('[data-ck=wallet]')?.focus();return}
  if(act==='go')ckGo(b.dataset.to);
  if(act==='next')ckNext();
  if(act==='qty'){const i=+b.dataset.i,p=cart[i],d=+b.dataset.d;if(p&&p.qty+d>=1&&p.qty+d<=5){p.qty+=d;persistCart();ckRender();($(`[data-ck="qty"][data-i="${i}"][data-d="${d}"]`)||$(`[data-i="${i}"]`))?.focus()}}
  if(act==='remove'){const p=cart.splice(+b.dataset.i,1)[0];persistCart();ckRender();toast(`«${p.name}» از سبد حذف شد.`)}
  if(act==='rail')$('#ck-rail').scrollBy({left:+b.dataset.d*480,behavior:'smooth'});
  if(act==='days')$('#ck-days').scrollBy({left:+b.dataset.d*300,behavior:'smooth'});
  if(act==='add-address')ckOpenAddress();
  if(act==='edit-address')ckOpenAddress(b.dataset.id);
  if(act==='delete-address'){ckAddresses=ckAddresses.filter(a=>a.id!==b.dataset.id);saveAccountAddresses(ckAddresses);if(ck.address===b.dataset.id)ck.address=accountProfile().defaultAddress||ckAddresses[0]?.id||null;ckPersist();ckRender();toast('آدرس حذف شد.')}
  if(act==='toggle-code'){const row=$('#ck-code-row');row.hidden=!row.hidden;b.setAttribute('aria-expanded',String(!row.hidden));b.classList.toggle('open',!row.hidden);if(!row.hidden)$('#ck-code').focus()}
  if(act==='apply-code'){const v=ckDigits($('#ck-code').value).trim().toUpperCase(),err=$('#ck-code-err');if(!ckCodes[v]){err.hidden=false;err.innerHTML=icon('warning')+(v?'این کد تخفیف معتبر نیست یا منقضی شده است.':'کد تخفیف را وارد کنید.');$('#ck-code').setAttribute('aria-invalid','true');$('#ck-code').focus();return}ck.code=v;ckPersist();ckRender();toast('کد تخفیف اعمال شد.')}
  if(act==='remove-code'){ck.code=null;ckPersist();ckRender()}
  if(act==='retry')ckGo('payment');
  if(act==='sum-toggle'){ck.sumOpen=!ck.sumOpen;const a=$('#ck-view .ck-aside');a.innerHTML=ckSummary(ck.step==='payment'?'تأیید و پرداخت':'ادامه و انتخاب روش پرداخت');a.querySelector('[data-ck=sum-toggle]').focus();if(!ck.sumOpen)a.scrollIntoView({block:'nearest'})}
  if(act==='orders')accountAction();
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='ck-code'){e.preventDefault();$('[data-ck=apply-code]').click()}});
document.addEventListener('change',e=>{
  const i=e.target;
  if(i.matches('[data-pf]')){ckSaveProfile({[i.dataset.pf]:i.value.trim()});const k=['bd','bm','by'].includes(i.dataset.pf)?'birth':i.dataset.pf;if(!ckProfileErrors()[k])ckClearErr(k);return}
  if(!i.matches('#ck-view input[type=radio]'))return;
  if(i.name==='address'){ck.address=i.value;ckClearErr('address')}
  if(i.name==='day'){ck.day=+i.value;ckClearErr('time')}
  if(i.name==='ship'){ck.ship=i.value;ckClearErr('ship');$('#ck-view .ck-aside').innerHTML=ckSummary('ادامه و انتخاب روش پرداخت')}
  if(i.name==='pay')ck.pay=i.value;
  ckPersist();
});
document.addEventListener('input',e=>{const i=e.target;if(!i.matches('input[data-pf]'))return;if(i.dataset.pf==='nid'){const v=ckDigits(i.value).replace(/\D/g,'');if(v!==i.value)i.value=v}ckSaveProfile({[i.dataset.pf]:i.value.trim()});if(ck.errors[i.dataset.pf]&&!ckProfileErrors()[i.dataset.pf])ckClearErr(i.dataset.pf)});

/* Shared phone-only OTP authentication. */
function ckOpenAuth(){beginAccountLogin(()=>{ckAddresses=accountAddresses();if(!ckAddresses.some(a=>a.id===ck.address))ck.address=accountProfile().defaultAddress||ckAddresses[0]?.id||null;ckGo('details')})}

/* ---------- Address dialog ---------- */
let ckEditing=null;
const ckAdFields=['province','city','address','plate','unit','postal','name','mobile'];
function ckOpenAddress(id=null){
  ckEditing=id;const a=ckAddresses.find(x=>x.id===id)||{self:true};
  $('#ck-address-title').textContent=id?'ویرایش آدرس':'افزودن آدرس جدید';
  ckAdFields.forEach(k=>{const el=$('#ad-'+k);el.value=a[k]||'';el.removeAttribute('aria-invalid');const er=$('#ad-'+k+'-err');if(er)er.hidden=true});
  $('#ad-self').checked=a.self!==false;$('#ad-recipient').hidden=$('#ad-self').checked;
  openDialog('#ck-address-dialog');$('#ad-province').focus();
}
$('#ad-self').addEventListener('change',e=>{$('#ad-recipient').hidden=e.target.checked;if(!e.target.checked)$('#ad-name').focus()});
$('#ck-address-form').addEventListener('submit',e=>{
  e.preventDefault();const v=Object.fromEntries(ckAdFields.map(k=>[k,$('#ad-'+k).value.trim()]));['mobile','postal','plate','unit'].forEach(k=>v[k]=ckDigits(v[k]));v.self=$('#ad-self').checked;
  const rules={province:[!!v.province,'استان را انتخاب کنید.'],city:[v.city.length>=2,'نام شهر را وارد کنید.'],address:[v.address.length>=10,'نشانی را دقیق‌تر وارد کنید (حداقل ۱۰ حرف).'],plate:[/^\d{1,6}$/.test(v.plate),'پلاک را وارد کنید.'],postal:[/^\d{10}$/.test(v.postal),'کد پستی باید ۱۰ رقم باشد.'],name:[v.self||v.name.length>=3,'نام گیرنده را وارد کنید.'],mobile:[v.self||/^09\d{9}$/.test(v.mobile),'موبایل گیرنده را ۱۱ رقمی وارد کنید.']};
  let first=null;for(const [k,[ok,msg]] of Object.entries(rules)){const el=$('#ad-'+k),err=$('#ad-'+k+'-err');err.hidden=ok;err.innerHTML=ok?'':icon('warning')+msg;el.toggleAttribute('aria-invalid',!ok);if(!ok&&!first)first=el}
  if(first){first.focus();return}
  if(ckEditing)ckAddresses=ckAddresses.map(a=>a.id===ckEditing?{...a,...v}:a);else{const n={id:'a'+Date.now(),...v};ckAddresses.unshift(n);ck.address=n.id}
  saveAccountAddresses(ckAddresses);ckPersist();delete ck.errors.address;$('#ck-address-dialog').close();ckRender();toast(ckEditing?'آدرس ویرایش شد.':'آدرس ثبت شد.');
});

/* ---------- Payment gateway (simulation) ---------- */
function ckOpenGateway(){
  const pay=ckPayments.find(p=>p.id===ck.pay);
  $('#ck-gateway-body').innerHTML=`<dl class="ck-facts compact"><div><dt>مبلغ قابل پرداخت</dt><dd>${ckToman(ckTotal())}</dd></div><div><dt>روش پرداخت</dt><dd>${pay.name}</dd></div></dl><div class="ck-dialog-foot"><button class="ck-btn ghost" data-gw="fail">انصراف از پرداخت</button><button class="ck-btn primary" data-gw="ok">پرداخت موفق</button></div>`;
  openDialog('#ck-gateway');$('[data-gw=ok]').focus();
}
$('#ck-gateway-body').addEventListener('click',e=>{
  const b=e.target.closest('[data-gw]');if(!b||b.disabled)return;const ok=b.dataset.gw==='ok';
  b.classList.add('loading');b.textContent='در حال انتقال...';$$('#ck-gateway-body button').forEach(x=>x.disabled=true);
  setTimeout(()=>{
    $('#ck-gateway').close();
    if(!ok){ck.order={failed:true};ckGo('failed');return}
    ckFinish();
  },900);
});

function ckFinish(){
  const d=ckDays[ck.day],use=ckWalletUse(),payName=use&&ckTotal()===0?'کیف پول رایاکس':use?ckPayments.find(p=>p.id===ck.pay).name+' + کیف پول':ckPayments.find(p=>p.id===ck.pay).name;
  ck.order={id:'RX-'+ckPlain(Math.floor(1000000+Math.random()*8999999)),date:new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'long'}).format(new Date()),count:ckCount(),total:ckGross(),pay:payName,wallet:use,when:`${d.label} ${d.date}`,items:cart.map(p=>({...p}))};
  const orders=read('rayax-orders-v1',[]);save('rayax-orders-v1',[{...ck.order,placed:Date.now(),owner:ckPhone(),status:'processing',address:{...ckAddress()},shipping:ckShip()?.price||0},...(Array.isArray(orders)?orders:[])].slice(0,20));
  if(use){const all=read('rayax-account-state-v1',{}),st=all&&typeof all==='object'?all[ckPhone()]:null;if(st&&Array.isArray(st.transactions)){st.transactions.unshift({id:'W-'+Date.now().toString(36).toUpperCase(),amount:-use,title:'پرداخت سفارش '+ck.order.id,date:ck.order.date,status:'success'});save('rayax-account-state-v1',all)}}
  cart.length=0;ck.wallet=false;persistCart();ck.code=null;ck.day=null;ckPersist();ckGo('success');
}

/* ---------- Boot ---------- */
$$('[data-home-link]').forEach(a=>a.href=homePageURL());
(function(){const old=$('#open-cart'),fresh=old.cloneNode(true);old.replaceWith(fresh);fresh.addEventListener('click',()=>ck.step==='cart'?window.scrollTo({top:0,behavior:'smooth'}):ckGo('cart'))})();
{const s=ckGuard(ckHash());if(location.hash!=='#'+s)history.replaceState(null,'','#'+s);ckRender(s)}
