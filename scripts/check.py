#!/usr/bin/env python3
"""Check rendered structure, local assets, icon references and font-size floor."""
from html.parser import HTMLParser
from pathlib import Path
import json,re
from build import render,SRC,ROOT
class Document(HTMLParser):
    def __init__(self):super().__init__();self.ids=set();self.duplicates=[];self.refs=[];self.icons=[];self.lang=None;self.direction=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='html':self.lang=a.get('lang');self.direction=a.get('dir')
        if a.get('id'):
            if a['id'] in self.ids:self.duplicates.append(a['id'])
            self.ids.add(a['id'])
        if a.get('src','').startswith('assets/'):self.refs.append(a['src'])
        if tag=='use':self.icons.append(a.get('href','').lstrip('#'))
def check():
    pages=json.loads((SRC/'pages.json').read_text());count=0
    for name in pages:
        html,css,js=render(name);doc=Document();doc.feed(html)
        assert doc.lang=='fa' and doc.direction=='rtl','Persian RTL root required'
        assert not doc.duplicates,doc.duplicates
        assert all((SRC/p).is_file() for p in doc.refs),'Missing HTML asset'
        assert all(ref in doc.ids for ref in doc.icons),'Missing icon symbol'
        for p in re.findall(r'url\(["\']?(assets/[^"\')]+)',css):assert (SRC/p).is_file(),p
        assert all(float(size)>=12 for size in re.findall(r'font-size:\s*([\d.]+)px',css)),'Text below 12px'
        assert len(re.findall(r'@font-face\{',css))==9,'All nine supplied FD weights required'
        required=['site-header','open-cart','account-button','cart-dialog','profile-dialog','mega-dialog']
        assert all(id in doc.ids for id in required),'Missing shared UI hook'
        if name=='product':
            assert all(id in doc.ids for id in ['product-video','article-toggle','article-more','write-review','review-list'])
        count+=1
    return {'pages':count,'checks':'RTL, unique IDs, assets, Phosphor symbols, nine fonts, 12px floor and required UI hooks'}
if __name__=='__main__':print(json.dumps(check(),ensure_ascii=False))
