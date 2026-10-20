function homePageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-home/index.html':'rayax-home.html'}
$$('.brand,.nav-row nav>a[href="#"],.breadcrumb>a:first-child').forEach(a=>a.href=homePageURL());
if(!$('#product'))$('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

function contactPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-contact/index.html':'rayax-contact.html'}
function termsPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-terms/index.html':'rayax-terms.html'}
function aboutPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-about/index.html':'rayax-about.html'}
$$('[data-contact-link]').forEach(a=>a.href=contactPageURL());
if($('#contact')){const skip=$('.skip');skip.href='#contact';skip.textContent='رفتن به محتوای تماس با ما';}

function faqPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-faq/index.html':'rayax-faq.html'}
$$('[data-faq-link]').forEach(a=>a.href=faqPageURL());
if($('#faq')){const skip=$('.skip');skip.href='#faq';skip.textContent='رفتن به سوالات متداول';}

function blogPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-blog/index.html':'rayax-blog.html'}
$$('[data-info=articles]').forEach(a=>a.href=blogPageURL());
if($('#magazine')||$('#mag-article')){const skip=$('.skip');skip.href=$('#magazine')?'#magazine':'#mag-article';skip.textContent='رفتن به محتوای رایاکس مگ';}

function trackPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-track/index.html':'rayax-track.html'}
$$('[data-track-link]').forEach(a=>a.href=trackPageURL());
if($('#track')){const skip=$('.skip');skip.href='#track';skip.textContent='رفتن به پیگیری سفارش';}
if($('#account-page')){const skip=$('.skip');skip.href='#account-page';skip.textContent='رفتن به پنل کاربری';}
// Header: highlight the menu item of the current page
{const page=(location.pathname.match(/rayax-([a-z0-9-]+)/)||[])[1]||'home',nav=$('.nav-row nav'),pick={home:'a[href]:not([data-info]):not([data-track-link])',home2:'a[href]:not([data-info]):not([data-track-link])',blog:'[data-info="articles"]',article:'[data-info="articles"]','mag-category':'[data-info="articles"]',track:'[data-track-link]',about:'[data-info="about"]',contact:'[data-info="contact"]'}[page];
 const cur=pick&&nav?.querySelector(pick);if(cur){cur.classList.add('is-current');cur.setAttribute('aria-current','page')}}
