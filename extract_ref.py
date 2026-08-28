import urllib.request
import re
import json

url = 'https://summit-drift-trek.base44.app/assets/index-DvufRrq0.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

idx = content.find('Choose Your')
chunk = content[max(0, idx-500):idx+8000]

with open('scratch_corridor.txt', 'w', encoding='utf-8') as f:
    f.write(chunk)

images = re.findall(r'https?://[^\s"\'<>\)]+?\.(?:jpg|jpeg|png|webp|svg)(?:\?[^\s"\'<>\)]*)?', content)
with open('scratch_images.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sorted(set(images))))

# Let's also look for all expeditions data
for m in re.finditer(r'\[\{id:[^\]]+\]', content):
    with open('scratch_data.txt', 'a', encoding='utf-8') as f:
        f.write(m.group(0) + '\n\n')

print(f"Extracted corridor info, {len(set(images))} images found.")
