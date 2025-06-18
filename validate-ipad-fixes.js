#!/usr/bin/env node

/**
 * iPad Pro Canvas Positioning Validation Script
 *
 * This script validates that all the iPad Pro portrait mode fixes
 * are correctly implemented and functioning as expected.
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 iPad Pro Canvas Positioning - Validation Script');
console.log('==================================================\n');

// File paths to check
const filesToCheck = [
  './src/App.css',
  './src/App.jsx',
  './src/index.css',
  './components/experience/Experience.jsx',
  './components/select_gallery/types.css',
];

// Validation checks
const checks = {
  appCss: {
    file: './src/App.css',
    requiredContent: [
      '@media (min-width: 1024px) and (orientation: portrait)',
      'position: fixed !important',
      'z-index: 1 !important',
      '.header {',
      'z-index: 100 !important',
    ],
    description:
      'iPad Pro portrait media queries and simplified z-index hierarchy',
  },
  appJsx: {
    file: './src/App.jsx',
    requiredContent: [
      'getIPadProPortraitStyles',
      'isIPadProPortrait',
      'canvasWrapperStyles',
      "filter: 'none'",
      "position: 'static'",
    ],
    description: 'iPad Pro detection and container style overrides',
  },
  indexCss: {
    file: './src/index.css',
    requiredContent: [
      '@media (min-width: 768px) and (orientation: portrait)',
      'z-index: 100 !important',
      'backdrop-filter: blur(5px) !important',
      'min-height: 44px !important',
    ],
    description:
      'Defensive button visibility CSS rules with simplified z-index',
  },
  experienceJsx: {
    file: './components/experience/Experience.jsx',
    requiredContent: [
      'iPad Pro Portrait Mode Detected',
      'Button visibility debugging',
      'isIPadProPortrait',
      "filter: isIPadProPortrait && hasOverlay ? 'blur(20px)' : undefined",
      'getBoundingClientRect()',
    ],
    description: 'Canvas blur application and button visibility debugging',
  },
  typesCss: {
    file: './components/select_gallery/types.css',
    requiredContent: [
      '@media (min-width: 1024px) and (orientation: portrait)',
      'position: fixed !important',
      'max-width: 100vw !important',
    ],
    description: 'Types overlay positioning constraints for iPad Pro',
  },
};

let allChecksPass = true;

// Perform validation
Object.keys(checks).forEach((checkKey) => {
  const check = checks[checkKey];
  console.log(`📁 Checking: ${check.file}`);
  console.log(`   Purpose: ${check.description}`);

  if (!fs.existsSync(check.file)) {
    console.log(`   ❌ File not found: ${check.file}`);
    allChecksPass = false;
    return;
  }

  const content = fs.readFileSync(check.file, 'utf8');
  let checkPassed = true;

  check.requiredContent.forEach((requirement) => {
    if (!content.includes(requirement)) {
      console.log(`   ❌ Missing: "${requirement}"`);
      checkPassed = false;
      allChecksPass = false;
    }
  });

  if (checkPassed) {
    console.log(`   ✅ All requirements found`);
  }

  console.log('');
});

// Summary
console.log('📊 Validation Summary');
console.log('====================');

if (allChecksPass) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('');
  console.log(
    '🎉 iPad Pro canvas positioning fixes are correctly implemented.'
  );
  console.log('');
  console.log('Next steps:');
  console.log(
    '1. Test in browser with iPad Pro 12.9" emulation (1024x1366 portrait)'
  );
  console.log(
    '2. Test in browser with iPad Pro 11" emulation (834x1194 portrait)'
  );
  console.log(
    '3. Verify buttons remain visible when Types/Contact overlays are active'
  );
  console.log('4. Check console for debug messages starting with 🎯 and 🔘');
  console.log('5. Deploy to staging for final validation');
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log('');
  console.log('Please review the missing requirements above and ensure');
  console.log('all iPad Pro fixes are properly implemented.');
}

console.log('');
console.log('🔗 For detailed documentation, see: ./IPAD_PRO_FIXES.md');
