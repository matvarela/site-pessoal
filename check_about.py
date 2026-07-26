import urllib.request
import re

url = 'https://good-fella.com/about'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
chunks = re.findall(r'/_next/static/chunks/[^\s"\'<>]+\.js', html)
print('Chunks in /about:', len(chunks))

for c in set(chunks):
    try:
        content = urllib.request.urlopen('https://good-fella.com' + c).read().decode('utf-8', errors='ignore')
        found = re.findall(r'https://cdn\.sanity\.io/images/[^\s"\'<>]+', content)
        if found:
            print(c, found)
    except:
        pass
