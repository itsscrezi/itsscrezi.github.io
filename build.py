import re, pathlib

read = lambda f: pathlib.Path(f).read_text(encoding='utf-8')

# Extra rules: show whole images, never cropped
EXTRA = """
.hero-portrait img{width:100%;height:auto;aspect-ratio:auto;object-fit:contain}
#musicGrid .music-cover>img{object-fit:contain!important}
.carousel-photo{object-fit:contain}
"""

css = '\n'.join(read(f) for f in ['styles.css', 'site-refresh.css', 'ui-fixes.css']) + EXTRA
css = re.sub(r'@import[^;]+;', '', css)          # fonts are already loaded by index.html
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)  # remove comments
css = re.sub(r'\s+', ' ', css)
css = re.sub(r'\s*([{};])\s*', r'\1', css)

html = read('index.src.html')
html = re.sub(r'\s*<link rel="stylesheet" href="(?:site-refresh|ui-fixes)\.css">', '', html)
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + css + '</style>')

pathlib.Path('index.html').write_text(html, encoding='utf-8')
print('index.html built, CSS inlined:', len(css) // 1024, 'KB')
