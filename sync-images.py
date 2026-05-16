#!/usr/bin/env python3
"""
Image Naming Standardization Script
Renames all images to follow: (projectname)_(uniqueStillIdentifier).format
- Project images: DearCancer_Screenshot205.png
- Untagged images: Untagged_Screenshot11.png
"""

import os
import json
import re
from pathlib import Path

ASSETS_DIR = Path('/mnt/c/Users/kundu/Desktop/portfolio-sample/assets/images')
CONFIG_PATH = Path('/mnt/c/Users/kundu/Desktop/portfolio-sample/config/site-config.json')

def sanitize_name(name):
    """Remove special chars, replace spaces with underscores"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = name.replace(' ', '')
    return name

def get_unique_identifier(filename):
    """Extract unique identifier from filename"""
    # Remove extension
    name = Path(filename).stem
    # Remove common prefixes
    for prefix in ['Screenshot', 'screenshot', 'IMG', 'DSC', 'photo', 'Photo']:
        name = re.sub(rf'^{prefix}\s*', '', name, flags=re.IGNORECASE)
    # Keep only alphanumeric
    name = re.sub(r'[^\w]', '', name)
    return name if name else 'img'

def main():
    print("=== Image Naming Standardization ===\n")
    
    # Load config
    with open(CONFIG_PATH, 'r') as f:
        config = json.load(f)
    
    # Track renamed files
    renamed = {}
    
    # Process gallery projects
    for proj in config.get('gallery', {}).get('projects', []):
        proj_name = proj.get('name', 'Unknown')
        safe_proj_name = sanitize_name(proj_name)
        print(f"\nProcessing: {proj_name} -> {safe_proj_name}")
        
        stills = proj.get('stills', [])
        for i, still in enumerate(stills):
            old_src = still.get('src', '')
            if not old_src:
                continue
                
            old_path = ASSETS_DIR / Path(old_src).name
            if not old_path.exists():
                print(f"  ⚠️  File not found: {old_path}")
                continue
            
            # Get unique identifier
            unique_id = get_unique_identifier(old_path.name)
            
            # Create new filename
            ext = old_path.suffix
            new_filename = f"{safe_proj_name}_{unique_id}{ext}" if unique_id else f"{safe_proj_name}_img{i}{ext}"
            new_path = ASSETS_DIR / new_filename
            
            # Rename if different
            if old_path != new_path:
                if new_path.exists():
                    print(f"  ⚠️  Target exists: {new_path.name}")
                    continue
                # old_path.rename(new_path)
                renamed[str(old_path)] = str(new_path)
                print(f"  ✅ Would rename: {old_path.name} -> {new_path.name}")
            else:
                print(f"  ✓ Already correct: {old_path.name}")
            
            # Update config
            still['src'] = f"assets/images/{new_filename}"
    
    # Process untagged images (files not in any project)
    print("\n\n=== Processing Untagged Images ===")
    gallery_files = set()
    for proj in config.get('gallery', {}).get('projects', []):
        for still in proj.get('stills', []):
            gallery_files.add(Path(still.get('src', '')).name)
    
    for file in ASSETS_DIR.iterdir():
        if file.is_file() and file.name not in gallery_files:
            # This is an untagged image
            unique_id = get_unique_identifier(file.name)
            ext = file.suffix
            new_filename = f"Untagged_{unique_id}{ext}" if unique_id else f"Untagged_img{file.stat().st_mtime}{ext}"
            new_path = ASSETS_DIR / new_filename
            
            if file != new_path and not new_path.exists():
                # file.rename(new_path)
                renamed[str(file)] = str(new_path)
                print(f"  ✅ Would rename: {file.name} -> {new_path.name}")
    
    # Save updated config
    print("\n\n=== Saving Updated Config ===")
    with open(CONFIG_PATH, 'w') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    print("✓ Config updated")
    
    print(f"\n\nTotal files that would be renamed: {len(renamed)}")
    print("Note: Actual renaming disabled - uncomment the rename() calls to execute")

if __name__ == '__main__':
    main()
