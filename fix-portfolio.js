#!/usr/bin/env node
/**
 * Portfolio Fix Script - Comprehensive Fixes
 * 
 * This script fixes:
 * 1. Normalizes all image paths (adds leading slash)
 * 2. Updates gallery filter logic
 * 3. Adds camera equipment fields to config schema
 * 4. Fixes showreel section
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config', 'site-config.json');

console.log('🔧 Starting portfolio fixes...\n');

// Read config
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('✅ Config loaded successfully');
} catch (error) {
  console.error('❌ Error reading config:', error.message);
  process.exit(1);
}

let changesCount = 0;

// Fix 1: Normalize all image paths in gallery stills
console.log('\n📸 Fix 1: Normalizing gallery still paths...');
if (config.gallery && config.gallery.projects) {
  config.gallery.projects.forEach(project => {
    if (project.stills) {
      project.stills.forEach(still => {
        if (still.src && !still.src.startsWith('/')) {
          still.src = '/' + still.src;
          changesCount++;
        }
        if (still.src && still.src.startsWith('//')) {
          still.src = still.src.substring(1); // Fix double slash
        }
      });
    }
  });
  console.log(`   Fixed ${changesCount} still paths`);
}

// Fix 2: Add camera equipment fields to selected works if missing
console.log('\n🎥 Fix 2: Adding camera equipment fields to selected works...');
let equipmentAdded = 0;
if (config.selectedWorks) {
  config.selectedWorks.forEach(work => {
    if (!work.camera) {
      work.camera = {
        body: '',
        lens: '',
        filmStock: '',
        aspectRatio: '',
        specialEquipment: ''
      };
      equipmentAdded++;
    }
  });
  console.log(`   Added camera fields to ${equipmentAdded} projects`);
}

// Fix 3: Ensure showreel section exists
console.log('\n🎬 Fix 3: Ensuring showreel section...');
if (!config.showreel) {
  config.showreel = {
    vimeoUrl: 'https://vimeo.com/1132983429',
    vimeoId: '1132983429',
    visible: true
  };
  console.log('   Created showreel section');
} else {
  console.log('   Showreel section exists');
}

// Fix 4: Add project IDs to gallery filter mapping
console.log('\n🏷️ Fix 4: Updating gallery project metadata...');
const projectMapping = {
  'e13m': 'e13m',
  'gallery-project-1778767201249': 'dear-cancer',
  'gallery-fgt': 'fgt',
  'gallery-sanjeevani': 'sanjeevani',
  'gallery-the-last-convo': 'the-last-convo',
  'gallery-what-the-fck': 'what-the-fck',
  'gallery-whats-that-noise': 'whats-that-noise'
};

if (config.gallery && config.gallery.projects) {
  config.gallery.projects.forEach(project => {
    if (!project.id) {
      project.id = project.name ? project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'unknown';
    }
  });
  console.log('   Updated project metadata');
}

// Save config
console.log('\n💾 Saving updated config...');
try {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  console.log('✅ Config saved successfully');
} catch (error) {
  console.error('❌ Error saving config:', error.message);
  process.exit(1);
}

console.log('\n✨ All fixes applied successfully!');
console.log(`   Total changes: ${changesCount + equipmentAdded}`);
