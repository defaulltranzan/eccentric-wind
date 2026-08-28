import glob
import re
import json
import os

def update_files():
    html_files = glob.glob('public/*.html')
    
    for fpath in html_files:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Update Title and metadata
        content = re.sub(r'Vertical Odyssey', 'Himalayan Magic Adventure', content, flags=re.IGNORECASE)
        content = re.sub(r'The Ascent', 'Himalayan Magic Adventure', content, flags=re.IGNORECASE)
        content = re.sub(r'verticalodyssey\.np', 'himalayanmagic.com', content, flags=re.IGNORECASE)
        content = re.sub(r'theascent\.np', 'himalayanmagic.com', content, flags=re.IGNORECASE)
        
        # 2. Update Header Logo Icon & Text
        content = re.sub(
            r'(<div[^>]*class="[^"]*h-10\s+w-10[^"]*"[^>]*>)\s*[VA]\s*(</div>)',
            r'\1H\2',
            content
        )
        content = re.sub(
            r'(<div[^>]*class="[^"]*h-9\s+w-9[^"]*"[^>]*>)\s*[VA]\s*(</div>)',
            r'\1H\2',
            content
        )
        content = re.sub(
            r'(<div[^>]*class="[^"]*h-8\s+w-8[^"]*"[^>]*>)\s*[VA]\s*(</div>)',
            r'\1H\2',
            content
        )
        
        # 3. Update Subtitles & Badges
        content = content.replace('HIGH CORRIDORS OF NEPAL', 'HIGH CORRIDORS OF NEPAL · EST. 1993')
        content = content.replace('The Ascent Route', 'Himalayan Magic Route')
        
        # 4. Hero section in index.html
        if 'index.html' in fpath:
            # Replace main big title
            content = re.sub(
                r'<span id="hero-title-primary"[^>]*>.*?</span>',
                '<span id="hero-title-primary" data-key="hero.title_primary" class="block font-light text-white/95">HIMALAYAN</span>',
                content,
                flags=re.DOTALL
            )
            content = re.sub(
                r'<span id="hero-title-italic"[^>]*>.*?</span>',
                '<span id="hero-title-italic" data-key="hero.title_italic" class="block text-accent font-semibold">MAGIC ADVENTURE</span>',
                content,
                flags=re.DOTALL
            )
            content = re.sub(
                r'<span id="hero-badge"[^>]*>.*?</span>',
                '<span id="hero-badge" data-key="hero.badge" class="font-mono text-[10px] uppercase tracking-[0.3em] text-accent font-medium">EST. 1993 · 30+ YEARS OF HIMALAYAN EXCELLENCE</span>',
                content,
                flags=re.DOTALL
            )
        
        # 5. Fix any double 'Himalayan Magic Adventure (Himalayan Magic Adventure)'
        content = content.replace('Himalayan Magic Adventure (Himalayan Magic Adventure)', 'Himalayan Magic Adventure')
        content = content.replace('HIMALAYAN MAGIC ADVENTURE (HIMALAYAN MAGIC ADVENTURE)', 'HIMALAYAN MAGIC ADVENTURE')
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Updated {fpath}")

    # Also update content.json
    if os.path.exists('content.json'):
        with open('content.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if 'hero' in data:
            data['hero']['title_top'] = "HIMALAYAN"
            data['hero']['title_bottom'] = "MAGIC ADVENTURE"
            data['hero']['badge'] = "EST. 1993 · 30+ YEARS OF HIMALAYAN EXCELLENCE"
            data['hero']['description'] = "A pilgrimage of endurance across Nepal's sacred peaks and high corridors since 1993. Guided by veteran IFMGA/NMA Sherpa masters with zero safety compromise."
        
        with open('content.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print("Updated content.json")

if __name__ == '__main__':
    update_files()
