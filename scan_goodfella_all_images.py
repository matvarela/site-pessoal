import urllib.request
import re
from PIL import Image
import io

pages = ['https://good-fella.com/', 'https://good-fella.com/about', 'https://good-fella.com/work', 'https://good-fella.com/contact', 'https://good-fella.com/pricing']
image_urls = set()

for page in pages:
    try:
        req = urllib.request.Request(page, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        found = re.findall(r'https://cdn\.sanity\.io/images/[^\s"\'<>]+', html)
        for f in found:
            # clean url
            clean = f.split('?')[0]
            image_urls.add(clean)
    except Exception as e:
        print(f"Error fetching {page}: {e}")

print(f"Found {len(image_urls)} unique Sanity image URLs:")
for idx, url in enumerate(image_urls):
    print(f"\n--- IMAGE {idx}: {url} ---")
    try:
        data = urllib.request.urlopen(url).read()
        img = Image.open(io.BytesIO(data))
        print("Size:", img.size, "Mode:", img.mode)
        # Generate small ASCII preview
        small = img.resize((60, 20)).convert('L')
        chars = ' .:-=+*#%@'
        preview = '\n'.join(''.join(chars[p * (len(chars)-1) // 255] for p in [small.getpixel((x, y)) for x in range(60)]) for y in range(20))
        print(preview)
    except Exception as e:
        print("Failed to download/process:", e)
