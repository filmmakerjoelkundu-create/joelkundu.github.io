#!/usr/bin/env python3
"""
Sync Gallery stills to Selected Works
This script copies still images from Gallery projects to their corresponding Selected Works projects.
"""

import json
import os

config_path = 'config/site-config.json'

print("🔄 Syncing Gallery stills to Selected Works...")

# Load config
with open(config_path, 'r') as f:
    config = json.load(f)

# Create map of gallery projects by name
gallery_map = {}
if 'gallery' in config and 'projects' in config['gallery']:
    for proj in config['gallery']['projects']:
        name = proj.get('name', '')
        gallery_map[name] = proj
        print(f"  Gallery: {name} → {len(proj.get('stills', []))} stills")

# Update selectedWorks with stills from gallery
updated_count = 0
if 'selectedWorks' in config:
    for work in config['selectedWorks']:
        title = work.get('title', '')
        
        # Look for matching gallery project
        if title in gallery_map:
            gallery_proj = gallery_map[title]
            gallery_stills = gallery_proj.get('stills', [])
            
            if gallery_stills:
                # Copy stills to selected works
                work['stills'] = gallery_stills
                print(f"  ✓ {title}: Copied {len(gallery_stills)} stills")
                updated_count += 1
            else:
                print(f"  ⚠ {title}: Gallery has no stills")
        else:
            print(f"  ⚠ {title}: No matching gallery project")

print(f"\n✅ Updated {updated_count} projects")

# Save back
with open(config_path, 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print(f"✅ Config saved to {config_path}")
