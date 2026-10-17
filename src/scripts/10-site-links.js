function homePageURL(){return location.pathname.endsWith('/')||location.pathname.endsWith('/index.html')?'../rayax-home/index.html':'rayax-home.html'}
$$('.brand,.nav-row nav>a[href="#"],.breadcrumb>a:first-child').forEach(a=>a.href=homePageURL());
if(!$('#product'))$('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
