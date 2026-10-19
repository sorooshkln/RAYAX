(function(){
const steps=[['ثبت سفارش','سفارش شما ثبت و پرداخت آن تأیید شد.','receipt'],['آماده‌سازی','کالاها در انبار بررسی و بسته‌بندی می‌شوند.','box'],['تحویل به پیک','بسته آماده و به شرکت حمل‌ونقل تحویل شد.','storefront'],['در مسیر','سفارش در مسیر رسیدن به آدرس شماست.','truck'],['تحویل شده','سفارش به دست شما رسید.','check-circle']];
const demoItems=[{name:'مک‌بوک ایر ۱۳.۶ اینچی M3',config:'۸ گیگابایت / ۲۵۶ گیگابایت',qty:1,price:62900000,image:'home/design/product-laptop.png'},{name:'هدفون بی‌سیم بیسوس',config:'مشکی',qty:2,price:1450000,image:'home/design/product-buds.png'},{name:'شارژر ۶۵ وات',config:'',qty:1,price:890000,image:'home/design/product-ssd.png'}];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const latin=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const norm=v=>{const m=latin(v).toUpperCase().replace(/[\s_–—-]/g,'').match(/^(?:RX)?(\d{7})$/);return m?'RX-'+m[1]:null};
const day=(t)=>new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'long'}).format(t);
const time=t=>new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit'}).format(t);
const form=$('#track-form'),input=$('#track-code'),err=$('#track-error'),box=$('#track-result');
function find(code){
  const mine=(read('rayax-orders-v1',[])||[]).find(o=>o&&o.id===code);
  if(mine){const placed=mine.placed||Date.now();return{code,placed:new Date(placed),stage:1,pay:mine.pay||'پرداخت آنلاین',when:mine.when,total:mine.total,items:Array.isArray(mine.items)?mine.items:[]}}
  /* shortcut: prototype has no order backend, so any well-formed code returns deterministic sample data; replace with an API lookup */
  const n=+code.slice(3),stage=n%5,placed=new Date(Date.now()-(stage*1.2+1)*864e5);
  const items=demoItems.slice(0,1+n%3);
  return{code,placed,stage,pay:'پرداخت اینترنتی',when:null,total:items.reduce((s,i)=>s+i.price*i.qty,0)+(n%2?0:150000),items,sample:true};
}
const headline=['سفارش شما ثبت شد','در حال آماده‌سازی سفارش','سفارش تحویل پیک شد','سفارش در مسیر ارسال است','سفارش تحویل داده شد'];
function render(o){
  const done=o.stage===4,eta=new Date(o.placed.getTime()+3*864e5);
  const list=steps.map((s,i)=>{const st=i<o.stage||done?'done':i===o.stage?'now':'';return`<li class="${st}"${st==='now'?' aria-current="step"':''}><span class="track-step">${st==='done'?icon('check-circle'):''}مرحله ${fa(i+1)}</span><span class="rule"></span><b>${s[0]}</b>${st==='now'?'<span class="track-now">در حال انجام</span>':''}</li>`}).join('');
  const items=o.items.length?o.items.map(i=>`<li><span class="ti-img">${i.image?`<img src="${esc(asset(i.image))}" alt="" loading="lazy">`:icon('box')}</span><div><b>${esc(i.name)}</b>${i.config?`<small>${esc(i.config)}</small>`:''}</div><em>${fa(i.qty)} عدد</em></li>`).join(''):'<li class="empty">جزئیات کالاها برای این سفارش در دسترس نیست.</li>';
  box.innerHTML=`<div class="track-ticket${done?' done':''}"><div class="track-top"><span class="track-tag">${icon(steps[o.stage][2])}<i></i></span><div class="track-top-text"><small>${done?'تحویل شده':'تحویل تقریبی: '+esc(o.when||day(eta))}</small><b>${headline[o.stage]}</b></div><span class="track-code" dir="ltr">${esc(o.code)}</span></div>
  <div class="track-cut"></div><div class="track-sec"><h2><i></i>مراحل سفارش</h2><ol class="track-steps">${list}</ol></div>
  <div class="track-cut"></div><div class="track-sec"><h2><i></i>سبد خرید</h2><ul class="track-items">${items}</ul><div class="track-total"><span>مبلغ کل</span><span><b>${fa(o.total)}</b> <small>تومان</small></span></div></div></div>${o.sample?'<p class="track-note">این سفارش نمونه است.</p>':''}`;
  box.hidden=false;
}
function show(v,focus){
  const code=norm(v);
  if(!code){input.removeAttribute('aria-invalid');void input.offsetWidth;err.hidden=false;err.querySelector('span').textContent=v.trim()?'کد سفارش معتبر نیست. کد شامل RX و ۷ رقم است، مثل RX-1234567.':'لطفاً کد سفارش را وارد کنید.';input.setAttribute('aria-invalid','true');box.hidden=true;return}
  err.hidden=true;input.removeAttribute('aria-invalid');input.value=code;history.replaceState(null,'','?code='+code);
  const btn=$('#track-submit');btn.classList.add('loading');btn.setAttribute('aria-busy','true');
  setTimeout(()=>{btn.classList.remove('loading');btn.removeAttribute('aria-busy');render(find(code));if(focus){box.focus({preventScroll:true});box.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}},focus?550:0);
}
form.addEventListener('submit',e=>{e.preventDefault();show(input.value,true)});
input.addEventListener('input',()=>{err.hidden=true;input.removeAttribute('aria-invalid')});
form.addEventListener('click',e=>{const b=e.target.closest('[data-track-code]');if(b){input.value=b.dataset.trackCode;show(b.dataset.trackCode,true)}if(e.target.closest('[data-track-sample]')){input.value='RX-1234567';show('RX-1234567',true)}});
const mine=(read('rayax-orders-v1',[])||[]).filter(o=>o&&norm(o.id)).slice(0,4);
if(mine.length){$('#track-recent-list').innerHTML=mine.map(o=>`<button type="button" class="track-chip" dir="ltr" data-track-code="${esc(o.id)}">${esc(o.id)}</button>`).join('')}
const q=new URLSearchParams(location.search).get('code');if(q){input.value=q;show(q,false)}
})();
