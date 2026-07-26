import urllib.request
import re
import json

url = 'https://good-fella.com/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Search for Sanity images
sanity_images = re.findall(r'https://cdn\.sanity\.io/images/[^\s"\'<>]+', html)
print("Sanity images found:")
for img in set(sanity_images):
    print(img)

# Search for chunks
chunks = re.findall(r'/_next/static/chunks/[^\s"\'<>]+\.js', html)
print("\nJS Chunks:", len(chunks))

# Search for chunk 387835 or module AsciiTypewriter
for chunk in set(chunks):
    chunk_url = 'https://good-fella.com' + chunk
    try:
        content = urllib.request.urlopen(chunk_url).read().decode('utf-8', errors='ignore')
        if 'AsciiTypewriter' in content or 'asciiImage' in content:
            print(f"\nFOUND ASCII TYPEWRITER IN {chunk}:")
            # print snippet
            idx = content.find('AsciiTypewriter')
            print(content[max(0, idx-200):min(len(content), idx+500)])
    except Exception as e:
        pass
