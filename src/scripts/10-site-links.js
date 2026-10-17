function homePageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-home/index.html':'rayax-home.html'}
$$('.brand,.nav-row nav>a[href="#"],.breadcrumb>a:first-child').forEach(a=>a.href=homePageURL());
if(!$('#product'))$('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

function contactPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-contact/index.html':'rayax-contact.html'}
if($('#contact')){const skip=$('.skip');skip.href='#contact';skip.textContent='رفتن به محتوای تماس با ما';}

function faqPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-faq/index.html':'rayax-faq.html'}
$$('[data-faq-link]').forEach(a=>a.href=faqPageURL());
if($('#faq')){const skip=$('.skip');skip.href='#faq';skip.textContent='رفتن به سوالات متداول';}

function blogPageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-blog/index.html':'rayax-blog.html'}
$$('[data-info=articles]').forEach(a=>a.href=blogPageURL());
if($('#magazine')||$('#mag-article')){const skip=$('.skip');skip.href=$('#magazine')?'#magazine':'#mag-article';skip.textContent='رفتن به محتوای رایاکس مگ';}
