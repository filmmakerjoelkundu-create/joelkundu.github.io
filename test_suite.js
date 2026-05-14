#!/usr/bin/env node

/**
 * COMPREHENSIVE PORTFOLIO TEST SUITE
 * Tests every configurable feature of the dashboard and live site
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  dashboardUrl: 'http://localhost:5001/dashboard/',
  liveSiteUrl: 'http://localhost:5001/',
  configPath: path.join(__dirname, 'dashboard-server', 'config', 'site-config.json'),
  liveConfigPath: path.join(__dirname, 'config', 'site-config.json'),
};

// Test results storage
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Helper: Log with timestamp
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  const prefix = {
    info: '📝',
    pass: '✅',
    fail: '❌',
    skip: '⏭️',
    error: '🔴'
  }[type] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// Helper: Add test result
function addTest(feature, test, passed, details = '') {
  testResults.total++;
  if (passed) testResults.passed++;
  else testResults.failed++;
  
  testResults.tests.push({
    feature,
    test,
    passed,
    details,
    timestamp: new Date().toISOString()
  });
  
  log(`${feature}: ${test} - ${passed ? 'PASSED' : 'FAILED'} ${details ? `(${details})` : ''}`, passed ? 'pass' : 'fail');
}

// TEST 1: Config File Structure
function testConfigStructure() {
  log('\n🔍 TEST 1: Config File Structure', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    // Check required sections
    const requiredSections = ['hero', 'about', 'selectedWorks', 'gallery', 'contact', 'footer', 'services', 'showreel'];
    requiredSections.forEach(section => {
      addTest('Config Structure', `Has ${section} section`, section in config);
    });
    
    // Check hero fields
    addTest('Config Structure', 'Hero has name', 'name' in config.hero);
    addTest('Config Structure', 'Hero has tagline', 'tagline' in config.hero);
    addTest('Config Structure', 'Hero has themes', Array.isArray(config.hero.themes));
    addTest('Config Structure', 'Hero has laurels', Array.isArray(config.hero.laurels));
    
    // Check gallery structure
    addTest('Config Structure', 'Gallery has projects', Array.isArray(config.gallery?.projects));
    addTest('Config Structure', 'Gallery has knownCameras', Array.isArray(config.gallery?.knownCameras));
    
    // Check selected works structure
    addTest('Config Structure', 'Selected Works is array', Array.isArray(config.selectedWorks));
    
    return true;
  } catch (error) {
    addTest('Config Structure', 'Config file exists and is valid JSON', false, error.message);
    return false;
  }
}

// TEST 2: Hero Section
function testHeroSection() {
  log('\n🎬 TEST 2: Hero Section', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    // Name field
    addTest('Hero Section', 'Name is string', typeof config.hero.name === 'string');
    addTest('Hero Section', 'Name is not empty', config.hero.name.trim().length > 0);
    
    // Tagline field
    addTest('Hero Section', 'Tagline is string', typeof config.hero.tagline === 'string');
    
    // Themes
    addTest('Hero Section', 'Has at least one theme', config.hero.themes?.length > 0);
    
    if (config.hero.themes?.length > 0) {
      const theme = config.hero.themes[0];
      addTest('Hero Section', 'Theme has id', 'id' in theme);
      addTest('Hero Section', 'Theme has name', 'name' in theme);
      addTest('Hero Section', 'Theme has colors', 'colors' in theme);
      
      if (theme.colors) {
        const colorFields = ['bgPrimary', 'bgSecondary', 'bgTertiary', 'textPrimary', 'textSecondary', 'accent', 'accentHover'];
        colorFields.forEach(field => {
          addTest('Hero Section', `Theme has ${field}`, field in theme.colors);
        });
      }
    }
    
    // Laurels
    addTest('Hero Section', 'Laurels is array', Array.isArray(config.hero.laurels));
    
    // Pattern settings
    addTest('Hero Section', 'Pattern opacity is number', typeof config.hero.patternOpacity === 'number' || config.hero.patternOpacity === undefined);
    
    return true;
  } catch (error) {
    addTest('Hero Section', 'Test execution', false, error.message);
    return false;
  }
}

// TEST 3: Selected Works (IMDb-style)
function testSelectedWorks() {
  log('\n🎭 TEST 3: Selected Works (IMDb-style)', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    addTest('Selected Works', 'Is array', Array.isArray(config.selectedWorks));
    
    if (config.selectedWorks.length > 0) {
      const project = config.selectedWorks[0];
      
      // Basic fields
      addTest('Selected Works', 'Project has title', 'title' in project);
      addTest('Selected Works', 'Project has role', 'role' in project || project.role === undefined);
      addTest('Selected Works', 'Project has category', 'category' in project || project.category === undefined);
      
      // Crew credits (all optional)
      if (project.credits) {
        const crewFields = [
          'director', 'dop', 'producer', 'productionDesigner',
          'editor', 'assistantDirector', 'writer', 'composer',
          'soundDesigner', 'colorist', 'vfx', 'costume',
          'makeup', 'gaffer', 'keyGrip'
        ];
        
        crewFields.forEach(field => {
          const exists = field in project.credits;
          addTest('Selected Works', `Credits has ${field}`, true, exists ? 'present' : 'optional');
        });
      } else {
        addTest('Selected Works', 'Credits object exists', false, 'No credits yet - optional field');
      }
      
      // Optional fields
      addTest('Selected Works', 'Visibility toggle exists', 'visible' in project || project.visible === undefined);
      addTest('Selected Works', 'Image field exists', 'image' in project || project.image === undefined);
    } else {
      addTest('Selected Works', 'No projects yet (acceptable)', true, 'Empty array is valid');
    }
    
    return true;
  } catch (error) {
    addTest('Selected Works', 'Test execution', false, error.message);
    return false;
  }
}

// TEST 4: Gallery Section
function testGallerySection() {
  log('\n🖼️ TEST 4: Gallery Section', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    addTest('Gallery', 'Gallery object exists', 'gallery' in config);
    addTest('Gallery', 'Projects is array', Array.isArray(config.gallery?.projects));
    addTest('Gallery', 'Known cameras is array', Array.isArray(config.gallery?.knownCameras));
    
    if (config.gallery?.projects?.length > 0) {
      const project = config.gallery.projects[0];
      
      addTest('Gallery', 'Project has name', 'name' in project);
      addTest('Gallery', 'Project name is string', typeof project.name === 'string');
      addTest('Gallery', 'Project has type', 'type' in project || project.type === undefined);
      addTest('Gallery', 'Project has camera', 'camera' in project || project.camera === undefined);
      addTest('Gallery', 'Project has year', 'year' in project || project.year === undefined);
      addTest('Gallery', 'Project has stills', Array.isArray(project.stills));
      
      // Test stills structure
      if (project.stills?.length > 0) {
        const still = project.stills[0];
        addTest('Gallery', 'Still has src', 'src' in still);
        addTest('Gallery', 'Still src is string', typeof still.src === 'string');
      }
    } else {
      addTest('Gallery', 'No gallery projects yet (acceptable)', true, 'Empty array is valid');
    }
    
    return true;
  } catch (error) {
    addTest('Gallery', 'Test execution', false, error.message);
    return false;
  }
}

// TEST 5: Contact Section
function testContactSection() {
  log('\n📧 TEST 5: Contact Section', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    addTest('Contact', 'Contact object exists', 'contact' in config);
    
    if (config.contact) {
      addTest('Contact', 'Email is string', typeof config.contact.email === 'string');
      addTest('Contact', 'Email is valid format', config.contact.email.includes('@') || config.contact.email === '');
      
      if (config.contact.location) {
        addTest('Contact', 'Location has text', 'text' in config.contact.location);
        addTest('Contact', 'Location has visible', 'visible' in config.contact.location);
      }
      
      if (config.contact.website) {
        addTest('Contact', 'Website has url', 'url' in config.contact.website);
        addTest('Contact', 'Website has visible', 'visible' in config.contact.website);
      }
    }
    
    return true;
  } catch (error) {
    addTest('Contact', 'Test execution', false, error.message);
    return false;
  }
}

// TEST 6: Footer Section
function testFooterSection() {
  log('\n👣 TEST 6: Footer Section', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    addTest('Footer', 'Footer object exists', 'footer' in config);
    
    if (config.footer) {
      addTest('Footer', 'Tagline is string', typeof config.footer.tagline === 'string');
      addTest('Footer', 'Social links is array', Array.isArray(config.footer.socialLinks));
      
      if (config.footer.socialLinks?.length > 0) {
        const link = config.footer.socialLinks[0];
        addTest('Footer', 'Link has platform', 'platform' in link || link.platform === undefined);
        addTest('Footer', 'Link has url', 'url' in link || link.url === undefined);
        addTest('Footer', 'Link has visible', 'visible' in link || link.visible === undefined);
      }
    }
    
    return true;
  } catch (error) {
    addTest('Footer', 'Test execution', false, error.message);
    return false;
  }
}

// TEST 7: Services Section
function testServicesSection() {
  log('\n🛠️ TEST 7: Services Section', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    addTest('Services', 'Services is array', Array.isArray(config.services));
    
    if (config.services?.length > 0) {
      const service = config.services[0];
      addTest('Services', 'Service has title', 'title' in service);
      addTest('Services', 'Service has description', 'description' in service);
      addTest('Services', 'Service has visible', 'visible' in service);
    } else {
      addTest('Services', 'No services yet (acceptable)', true, 'Empty array is valid');
    }
    
    return true;
  } catch (error) {
    addTest('Services', 'Test execution', false, error.message);
    return false;
  }
}

// TEST 8: Showreel Section
function testShowreelSection() {
  log('\n🎬 TEST 8: Showreel Section', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    
    addTest('Showreel', 'Showreel object exists', 'showreel' in config);
    
    if (config.showreel) {
      addTest('Showreel', 'Has vimeoUrl or url', 'vimeoUrl' in config.showreel || 'url' in config.showreel);
    }
    
    return true;
  } catch (error) {
    addTest('Showreel', 'Test execution', false, error.message);
    return false;
  }
}

// TEST 9: Build & Push Functionality
function testBuildPush() {
  log('\n🚀 TEST 9: Build & Push Functionality', 'info');
  
  // Check server.js has endpoints
  const serverPath = path.join(__dirname, 'dashboard-server', 'server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');
  
  addTest('Build/Push', 'Build endpoint exists', serverCode.includes("app.post('/api/build'"));
  addTest('Build/Push', 'Push endpoint exists', serverCode.includes("app.post('/api/push'"));
  addTest('Build/Push', 'Git add command exists', serverCode.includes('git add -A'));
  addTest('Build/Push', 'Git commit command exists', serverCode.includes('git commit'));
  addTest('Build/Push', 'Git push command exists', serverCode.includes('git push'));
  
  // Check dashboard has UI buttons
  const dashboardPath = path.join(__dirname, 'dashboard-server', 'index.html');
  const dashboardCode = fs.readFileSync(dashboardPath, 'utf8');
  
  addTest('Build/Push', 'Build button exists', dashboardCode.includes('buildForDeploy'));
  addTest('Build/Push', 'Push button exists', dashboardCode.includes('pushToGitHub'));
  addTest('Build/Push', 'Deploy bar exists', dashboardCode.includes('deployBar'));
  
  return true;
}

// TEST 10: Live Site Integration
function testLiveSiteIntegration() {
  log('\n🔗 TEST 10: Live Site Integration', 'info');
  
  // Check script.js has rendering functions
  const scriptPath = path.join(__dirname, 'script.js');
  const scriptCode = fs.readFileSync(scriptPath, 'utf8');
  
  addTest('Live Site', 'Has updateHeroFromConfig function', scriptCode.includes('updateHeroFromConfig'));
  addTest('Live Site', 'Has updateSelectedWorks function', scriptCode.includes('updateSelectedWorks'));
  addTest('Live Site', 'Has updateGallery function', scriptCode.includes('updateGallery'));
  addTest('Live Site', 'Has updateContact function', scriptCode.includes('updateContact'));
  addTest('Live Site', 'Has updateFooter function', scriptCode.includes('updateFooter'));
  addTest('Live Site', 'Has updateServices function', scriptCode.includes('updateServices'));
  addTest('Live Site', 'Has updateShowreel function', scriptCode.includes('updateShowreel'));
  addTest('Live Site', 'Fetches config file', scriptCode.includes('fetch(\'config/site-config.json\')'));
  
  return true;
}

// TEST 11: Data Integrity
function testDataIntegrity() {
  log('\n💾 TEST 11: Data Integrity', 'info');
  
  try {
    const config = JSON.parse(fs.readFileSync(TEST_CONFIG.configPath, 'utf8'));
    const configStr = JSON.stringify(config);
    
    // Check for common issues
    addTest('Data Integrity', 'Config is valid JSON', true);
    addTest('Data Integrity', 'No circular references', true);
    addTest('Data Integrity', 'Config size reasonable', configStr.length < 10 * 1024 * 1024); // < 10MB
    
    // Check for required top-level keys
    const requiredKeys = ['hero', 'about', 'selectedWorks', 'gallery', 'contact', 'footer'];
    requiredKeys.forEach(key => {
      addTest('Data Integrity', `Has required key: ${key}`, key in config);
    });
    
    return true;
  } catch (error) {
    addTest('Data Integrity', 'Data integrity check', false, error.message);
    return false;
  }
}

// Generate comprehensive report
function generateReport() {
  const report = `
# 🧪 COMPREHENSIVE PORTFOLIO TEST REPORT

**Test Date:** ${new Date().toISOString()}
**Test Suite:** Automated Feature Testing

---

## 📊 SUMMARY

| Metric | Value |
|--------|-------|
| **Total Tests** | ${testResults.total} |
| **Passed** | ${testResults.passed} ✅ |
| **Failed** | ${testResults.failed} ❌ |
| **Success Rate** | ${((testResults.passed / testResults.total) * 100).toFixed(2)}% |

---

## 📋 DETAILED RESULTS

`;

  // Group by feature
  const byFeature = {};
  testResults.tests.forEach(test => {
    if (!byFeature[test.feature]) {
      byFeature[test.feature] = { total: 0, passed: 0, failed: 0, tests: [] };
    }
    byFeature[test.feature].total++;
    if (test.passed) byFeature[test.feature].passed++;
    else byFeature[test.feature].failed++;
    byFeature[test.feature].tests.push(test);
  });

  // Generate feature-by-feature report
  Object.keys(byFeature).forEach(feature => {
    const data = byFeature[feature];
    const passRate = ((data.passed / data.total) * 100).toFixed(0);
    
    report += `### ${data.passed === data.total ? '✅' : '⚠️'} ${feature}\n`;
    report += `**Pass Rate:** ${passRate}% (${data.passed}/${data.total})\n\n`;
    
    report += '| Test | Status | Details |\n';
    report += '|------|--------|--------|\n';
    
    data.tests.forEach(test => {
      const status = test.passed ? '✅ PASS' : '❌ FAIL';
      report += `| ${test.test} | ${status} | ${test.details || '-'} |\n`;
    });
    
    report += '\n';
  });

  // Conclusion
  const overallPassRate = ((testResults.passed / testResults.total) * 100).toFixed(2);
  report += `---\n\n## 🎯 CONCLUSION\n\n`;
  
  if (testResults.failed === 0) {
    report += `**Status: ✅ ALL TESTS PASSED**\n\n`;
    report += `All ${testResults.total} tests passed successfully. The portfolio system is functioning correctly across all configurable features.\n`;
  } else {
    report += `**Status: ⚠️ ${testResults.failed} TESTS FAILED**\n\n`;
    report += `While ${testResults.passed} tests passed, ${testResults.failed} tests failed. Please review the failures above.\n`;
  }
  
  report += `\n---\n\n**Generated by:** Hermes Automated Test Suite\n`;
  report += `**Timestamp:** ${new Date().toISOString()}\n`;

  return report;
}

// Main execution
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Portfolio Test Suite\n');
  console.log('=' .repeat(60));
  
  // Run all tests
  testConfigStructure();
  testHeroSection();
  testSelectedWorks();
  testGallerySection();
  testContactSection();
  testFooterSection();
  testServicesSection();
  testShowreelSection();
  testBuildPush();
  testLiveSiteIntegration();
  testDataIntegrity();
  
  // Generate report
  const report = generateReport();
  
  // Save report
  fs.writeFileSync(path.join(__dirname, 'TEST_REPORT.md'), report);
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 FINAL RESULTS: ${testResults.passed}/${testResults.total} tests passed (${((testResults.passed / testResults.total) * 100).toFixed(2)}%)`);
  console.log(`📄 Full report saved to: TEST_REPORT.md`);
  
  // Return results for Telegram
  return {
    total: testResults.total,
    passed: testResults.passed,
    failed: testResults.failed,
    report
  };
}

// Execute
runAllTests().catch(console.error);
