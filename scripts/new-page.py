#!/usr/bin/env python3
"""Create a requested page using the existing RAYAX shell; does not build or publish."""
from pathlib import Path
import argparse,json,re
from html import escape
root=Path(__file__).resolve().parents[1];p=argparse.ArgumentParser();p.add_argument('slug');p.add_argument('--title',required=True);a=p.parse_args()
assert re.fullmatch('[a-z][a-z0-9-]{0,50}',a.slug),'Use a lowercase page slug'
manifest=root/'src/pages.json';pages=json.loads(manifest.read_text());assert a.slug not in pages,'Page already exists'
file=root/f'src/pages/{a.slug}.html';file.write_text('<main class="container"><h1>'+escape(a.title)+'</h1></main>')
pages[a.slug]={'title':a.title,'content':f'pages/{a.slug}.html','scripts':['scripts/01-core.js','scripts/03-cart.js','scripts/06-navigation.js','scripts/07-account.js']}
manifest.write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n');print('Created',file.name)
