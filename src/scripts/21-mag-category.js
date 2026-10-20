// Blog category page: ?category=<name>; falls back to the first category
const mcInfo={'راهنمای خرید':['monitor-guide','پیش از خرید، با شناخت بیشتر انتخاب کنید؛ از لپ‌تاپ و مانیتور تا لوازم جانبی.'],'سخت‌افزار':['ram-ssd','از مشخصات فنی تا تجربهٔ واقعی؛ قطعات و سخت‌افزار را ساده بشناسید.'],'آموزش':['storage-cleanup','آموزش‌های کوتاه و کاربردی برای استفادهٔ بهتر از دستگاه‌ها و فایل‌هایتان.'],'سبک زندگی دیجیتال':['headphones','تکنولوژی در زندگی روزمره؛ میز کار، صدا، سفر و عادت‌های دیجیتال.']};
const mcNames=Object.keys(mcInfo);
let mcCat=new URLSearchParams(location.search).get('category');if(!mcInfo[mcCat])mcCat=mcNames[0];
function renderMagCategory(){const [cover,desc]=mcInfo[mcCat],list=magStories.filter(s=>s.category===mcCat),sort=$('#mc-sort').value;
 if(sort==='popular')list.sort((a,b)=>b.popularity-a.popularity);else if(sort==='short')list.sort((a,b)=>a.minutes-b.minutes);
 document.title=mcCat+' | رایاکس مگ';$('#mc-title').textContent=mcCat;$('#mc-crumb').textContent=mcCat;$('#mc-desc').textContent=desc;$('#mc-count').textContent=fa(list.length)+' مقاله';
 $('#mc-hero-bg').dataset.cover=cover;magApplyCovers();
 $('#mc-tabs').innerHTML=mcNames.map(n=>`<a href="${magCategoryURL(n)}" data-mc="${n}" ${n===mcCat?'aria-current="page"':''}>${n}<span>${fa(magStories.filter(s=>s.category===n).length)}</span></a>`).join('');
 $('#mc-grid').innerHTML=list.map(magCard).join('');$('#mc-status').textContent=fa(list.length)+' مقاله در این دسته';
 $('#mc-other').innerHTML=mcNames.filter(n=>n!==mcCat).map(n=>`<a class="mx-topic" href="${magCategoryURL(n)}" data-mc="${n}"><span class="mx-topic-bg" style="${magCoverStyle(mcInfo[n][0])}"></span><span class="mx-topic-text"><b>${n}</b><small>${fa(magStories.filter(s=>s.category===n).length)} مقاله</small></span><i>${icon('arrow')}</i></a>`).join('')}
// Switch category in place (keeps the URL shareable)
$('#mag-category').addEventListener('click',e=>{const a=e.target.closest('[data-mc]');if(!a||e.metaKey||e.ctrlKey)return;e.preventDefault();mcCat=a.dataset.mc;history.replaceState(null,'',magCategoryURL(mcCat));renderMagCategory();scrollTo({top:0,behavior:'smooth'})});
$('#mc-sort').addEventListener('change',renderMagCategory);
renderMagCategory();
