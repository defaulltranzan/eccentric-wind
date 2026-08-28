import re
import json

def polish_all():
    # 1. Update edit.js
    with open('public/edit.js', 'r', encoding='utf-8') as f:
        js = f.read()
    
    js = js.replace('heroTitlePrimary: "THE",', 'heroTitlePrimary: "HIMALAYAN",')
    js = js.replace('heroTitleItalic: "ASCENT",', 'heroTitleItalic: "MAGIC ADVENTURE",')
    js = js.replace('heroBadge: "NEPAL\'S PREMIER ADVENTURE SPECIALISTS",', 'heroBadge: "EST. 1993 · 30+ YEARS OF HIMALAYAN EXCELLENCE",')
    js = js.replace('heroDesc: "A pilgrimage of endurance across Nepal\'s highest corridors. Not a vacation—a transformative elevation of the body and spirit. Led by certified IFMGA Sherpa masters.",', 'heroDesc: "Orchestrating transformative journeys across Nepal\'s sacred peaks and high corridors since 1993. Guided by veteran IFMGA/NMA Sherpa masters with 100% safety commitment.",')
    js = js.replace('adminTitle: "Vertical Odyssey Control Panel",', 'adminTitle: "Himalayan Magic Adventure Control Panel",')
    js = js.replace('Vertical Odyssey', 'Himalayan Magic Adventure')
    
    with open('public/edit.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated edit.js")

    # 2. Update index.html Header uppercase styling
    with open('public/index.html', 'r', encoding='utf-8') as f:
        idx = f.read()
    
    idx = idx.replace('<span class="block font-heading text-sm font-light tracking-widest text-white">Himalayan Magic Adventure</span>', '<span class="block font-heading text-sm font-light tracking-widest text-white uppercase">HIMALAYAN MAGIC ADVENTURE</span>')
    
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(idx)
    print("Updated index.html uppercase logo text")

    # 3. Update manifest.json
    manifest = {
      "name": "Himalayan Magic Adventure",
      "short_name": "Himalayan Magic",
      "description": "Nepal's premier mountaineering and trekking specialist operating since 1993.",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#1b1e22",
      "theme_color": "#f06225",
      "icons": [
        {
          "src": "/images/favicon.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    }
    with open('public/manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    print("Updated manifest.json")

polish_all()
