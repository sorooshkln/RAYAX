// Shared mobile shell and configuration-aware purchase controls.
const mobileMenu=document.createElement('button');
mobileMenu.type='button';mobileMenu.className='icon-btn mobile-menu';
mobileMenu.setAttribute('aria-label','باز کردن منوی محصولات');
mobileMenu.innerHTML=icon('menu');$('.header-main').prepend(mobileMenu);
mobileMenu.addEventListener('click',()=>{renderMobileNavigation();openDialog('#mobile-navigation')});
const announcement=$('.announcement'),announcementHome=document.createComment('announcement');
announcement.before(announcementHome);
function arrangeMobileHeader(){if(matchMedia('(max-width:767px)').matches)$('#site-header').prepend(announcement);else announcementHome.after(announcement)}
matchMedia('(max-width:767px)').addEventListener('change',arrangeMobileHeader);arrangeMobileHeader();
if($('.mobile-buy')){
const mobilePurchaseButton=$('.mobile-buy .add-to-cart');
const mobileQuantity=document.createElement('div');mobileQuantity.className='mobile-quantity';
mobileQuantity.setAttribute('role','group');mobileQuantity.setAttribute('aria-label','تعداد این محصول در سبد خرید');
mobilePurchaseButton.after(mobileQuantity);
function syncMobilePurchase(){
 const product=cart.find(p=>p.key===currentProduct().key);
 mobilePurchaseButton.hidden=!!product;mobileQuantity.hidden=!product;
 mobileQuantity.innerHTML=product?`<button type="button" data-mobile-quantity="plus" aria-label="افزایش تعداد" ${product.qty>=5?'disabled':''}>${icon('plus')}</button><span aria-live="polite">${fa(product.qty)}</span><button type="button" data-mobile-quantity="minus" aria-label="${product.qty===1?'حذف از سبد خرید':'کاهش تعداد'}">${icon(product.qty===1?'trash':'minus')}</button>`:'';
}
mobileQuantity.addEventListener('click',e=>{const button=e.target.closest('[data-mobile-quantity]');if(!button)return;const index=cart.findIndex(p=>p.key===currentProduct().key);if(index<0)return;if(button.dataset.mobileQuantity==='plus'){if(cart[index].qty<5)cart[index].qty++}else if(cart[index].qty>1)cart[index].qty--;else cart.splice(index,1);persistCart()});
const originalRenderCart=renderCart;renderCart=function(){originalRenderCart();syncMobilePurchase()};
$$('.color-option,[data-config]').forEach(button=>button.addEventListener('click',syncMobilePurchase));syncMobilePurchase();
}
if($('.product-meta')){
const stockBadge=document.createElement('span');stockBadge.className='low-stock';stockBadge.textContent='فقط ۲ عدد باقی مانده';$('.product-meta').after(stockBadge);
const stockGroup=document.createElement('div');stockGroup.className='stock-group';$('.stock').before(stockGroup);stockGroup.append($('.stock'));
function arrangeStockBadge(){stockGroup.append(stockBadge)}
matchMedia('(min-width:768px)').addEventListener('change',arrangeStockBadge);arrangeStockBadge();
}
const headerSpacer=document.createElement('div');headerSpacer.className='mobile-header-spacer';$('#site-header').before(headerSpacer);
function sizeMobileHeader(){const height=$('#site-header').getBoundingClientRect().height+'px';headerSpacer.style.height=height;document.documentElement.style.setProperty('--mobile-header-height',height)}
new ResizeObserver(sizeMobileHeader).observe($('#site-header'));sizeMobileHeader();
function decorateLimitedProduct(){const card=$('#related-grid .related-card');if(card&&!card.querySelector('.low-stock')){const category=card.querySelector('.card-category');const row=document.createElement('span');row.className='related-card-tags';category.before(row);row.append(category);row.insertAdjacentHTML('beforeend','<span class="low-stock">فقط ۲ عدد باقی مانده</span>')}}
if(typeof renderRelated==='function'){const originalRenderRelated=renderRelated;renderRelated=function(query=''){originalRenderRelated(query);decorateLimitedProduct()};decorateLimitedProduct()}

const mobileNavigation=document.createElement('dialog');mobileNavigation.id='mobile-navigation';mobileNavigation.className='mobile-navigation';mobileNavigation.setAttribute('aria-label','منوی اصلی موبایل');document.body.append(mobileNavigation);
function renderMobileNavigation(screen='home',category='لپ‌تاپ'){
 const title=screen==='home'?'منوی رایاکس':screen==='categories'?'دسته‌بندی محصولات':category;
 const heading=`<div class="mobile-nav-heading">${screen!=='home'?'<button class="icon-btn" data-menu-back="'+(screen==='detail'?'categories':'home')+'" aria-label="بازگشت">'+icon('right')+'</button>':''}<h2>${title}</h2><button class="icon-btn" data-menu-close aria-label="بستن منوی موبایل">${icon('close')}</button></div>`;
 let content='';
 if(screen==='home')content=`<button class="mobile-nav-category" data-menu-categories>${icon('all')}<span>دسته‌بندی محصولات</span>${icon('arrow')}</button><div class="mobile-nav-links"><button data-menu-link="home">${icon('house')}صفحه اصلی</button><button data-menu-link="articles">${icon('article')}<span class="rayax-mag">رایاکس <b class="mag-badge">مگ</b></span></button><button data-menu-link="about">${icon('user')}درباره ما</button><button data-menu-link="contact">${icon('phone')}تماس با ما</button></div>`;
 if(screen==='categories')content=`<div class="mobile-nav-categories">${categoryData.map(([name,ic])=>`<button data-menu-category="${name}">${icon(ic)}<span>${name}</span>${icon('arrow')}</button>`).join('')}</div>`;
 if(screen==='detail'){
  renderMega(category);
  content=`<section class="mobile-nav-group"><h3>${$('.mega-subtitle').textContent}</h3><div class="mega-brands">${$('#mega-brands').innerHTML}</div></section><div class="mega-columns">${$('#mega-columns').innerHTML}</div>`.replaceAll('data-mega-filter','data-menu-filter');
 }
 mobileNavigation.innerHTML=heading+content;
}
mobileNavigation.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-menu-close'))mobileNavigation.close();else if(b.hasAttribute('data-menu-back'))renderMobileNavigation(b.dataset.menuBack);else if(b.hasAttribute('data-menu-categories'))renderMobileNavigation('categories');else if(b.hasAttribute('data-menu-category'))renderMobileNavigation('detail',b.dataset.menuCategory);else if(b.hasAttribute('data-menu-filter')){mobileNavigation.close();navigateCatalog(b.dataset.menuFilter)}else if(b.hasAttribute('data-menu-link')){mobileNavigation.close();const link=b.dataset.menuLink;if(link==='home')location.href=homePageURL();else info(...infoPages[link])}});
mobileNavigation.addEventListener('click',e=>{if(e.target!==mobileNavigation)return;const r=mobileNavigation.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom)mobileNavigation.close()});
