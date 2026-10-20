#!/usr/bin/env python3
"""Build shared RAYAX sources; --package adds standalone HTML and ZIP deliverables."""
from pathlib import Path
from html import escape
import argparse,base64,json,mimetypes,re,shutil,zipfile
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'src'
OUT=ROOT/'outputs'

def render(page='product'):
    config=json.loads((SRC/'pages.json').read_text())[page]
    def includes(text,seen=()):
        def read(m):
            name=m[1].strip()
            if name in seen:raise ValueError('Recursive include: '+name)
            path=(SRC/name).resolve()
            if not path.is_relative_to(SRC.resolve()):raise ValueError('Include outside src')
            return includes(path.read_text(),seen+(name,))
        return re.sub(r'\{\{>\s*(.*?)\s*\}\}',read,text)
    html=includes((SRC/'layout.html').read_text())
    for token,value in {'title':escape(config['title']),'content':includes((SRC/config['content']).read_text()),'page_extra':(SRC/config['extra']).read_text() if config.get('extra') else ''}.items():html=html.replace('{{'+token+'}}',value)
    if re.search(r'\{\{(?:>|title|content|page_extra)',html):raise ValueError('Unresolved layout token')
    css=(SRC/'shared/fonts.css').read_text()+(SRC/'shared/styles.css').read_text()+(SRC/'shared/mobile-repair.css').read_text()+(SRC/'shared/auth.css').read_text()
    css+=''.join((SRC/name).read_text() for name in config.get('styles',[]))
    css+=(SRC/'shared/mobile-platform.css').read_text()+(SRC/'shared/ui-unify.css').read_text()
    js=''.join((SRC/name).read_text() for name in config['scripts'])
    return html,css,js

def uri(relative):
    path=SRC/relative
    mime={'.ttf':'font/ttf','.svg':'image/svg+xml','.webm':'video/webm'}.get(path.suffix) or mimetypes.guess_type(path)[0] or 'application/octet-stream'
    return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()

def build(page='product',package=False):
    html,css,js=render(page);dest=OUT/('rayax-product' if page=='product' else 'rayax-'+page);dest.mkdir(parents=True,exist_ok=True)
    for name,text in [('index.html',html),('styles.css',css),('app.js',js)]:
        p=dest/name
        if not p.exists() or p.read_text()!=text:p.write_text(text)
    shutil.copytree(SRC/'assets',dest/'assets',dirs_exist_ok=True)
    shutil.copy2(ROOT/'docs/design-system.md',dest/'design-system.md')
    if package:
        inlined_css=re.sub(r'url\(["\']?(assets/[^"\')]+)["\']?\)',lambda m:'url("'+uri(m[1])+'")',css)
        inlined_html=re.sub(r'src="(assets/[^"]+)"',lambda m:'src="'+uri(m[1])+'"',html)
        inlined_html=re.sub(r'srcset="(assets/[^"]+)"',lambda m:'srcset="'+uri(m[1])+'"',inlined_html)
        images={name:uri('assets/'+name) for name in ['hero.jpg','detail.jpg','display.jpg','lifestyle.jpg','video-poster-v1.png','macbook-editorial-banner-v1.png','product-intro.webm']}
        images.update({str(p.relative_to(SRC/'assets')):uri(str(p.relative_to(SRC))) for p in (SRC/'assets/home').rglob('*') if p.is_file()})
        inlined_js=js.replace("const asset=name=>'assets/'+name;",'const embeddedAssets='+json.dumps(images)+';\nconst asset=name=>embeddedAssets[name]||\'assets/\'+name;')
        inlined_html=re.sub(r'<link rel="stylesheet" href="styles\.css(?:\?[^\"]*)?">',lambda m:'<style>'+inlined_css+'</style>',inlined_html)
        inlined_html=re.sub(r'<script src="app\.js(?:\?[^\"]*)?"></script>',lambda m:'<script>'+inlined_js+'</script>',inlined_html)
        (OUT/f'rayax-{page}.html').write_text(inlined_html)
        with zipfile.ZipFile(OUT/f'rayax-{page}.zip','w',zipfile.ZIP_DEFLATED) as z:
            for p in dest.rglob('*'):
                if p.is_file():z.write(p,p.relative_to(OUT))
            assert z.testzip() is None
        with zipfile.ZipFile(OUT/'rayax-project.zip','w',zipfile.ZIP_DEFLATED) as z:
            for folder in ['src','scripts','docs','.agents']:
                for p in (ROOT/folder).rglob('*'):
                    if p.is_file() and '__pycache__' not in p.parts:z.write(p,Path('rayax-project')/p.relative_to(ROOT))
            for name in ['AGENTS.md','README.md']:
                if (ROOT/name).exists():z.write(ROOT/name,Path('rayax-project')/name)
            assert z.testzip() is None
        shutil.copy2(ROOT/'docs/design-system.md',OUT/'design-system.md')
    return dest

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--page',default='product');parser.add_argument('--package',action='store_true');args=parser.parse_args();dest=build(args.page,args.package);print('Built',dest.name, '+ standalone and source ZIPs' if args.package else '(preview only)')
