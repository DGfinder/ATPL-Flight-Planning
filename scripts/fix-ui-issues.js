#!/usr/bin/env node

/**
 * UI Issues Fix Script
 * 
 * This script helps identify and fix the mixed styling approaches
 * that are causing UI inconsistencies in your aviation app.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Problematic patterns to find
const PROBLEMATIC_PATTERNS = [
  // Tailwind aviation classes
  { pattern: /className="[^"]*aviation-[^"]*"/g, description: 'Tailwind aviation classes' },
  { pattern: /className='[^']*aviation-[^']*'/g, description: 'Tailwind aviation classes (single quotes)' },
  
  // Custom CSS classes
  { pattern: /className="[^"]*aviation-card[^"]*"/g, description: 'aviation-card CSS class' },
  { pattern: /className="[^"]*aviation-button[^"]*"/g, description: 'aviation-button CSS class' },
  { pattern: /className="[^"]*aviation-input[^"]*"/g, description: 'aviation-input CSS class' },
  { pattern: /className="[^"]*question-option[^"]*"/g, description: 'question-option CSS class' },
  
  // Mixed styling approaches
  { pattern: /style=\{.*\}[^}]*className=/g, description: 'Mixed inline styles with className' },
  { pattern: /className=.*style=\{/g, description: 'Mixed className with inline styles' }
];

// Files to scan
const SCAN_DIRECTORIES = [
  'src/components',
  'src/pages',
  'src/hooks',
  'src/contexts'
];

// Files to exclude
const EXCLUDE_FILES = [
  'design-system',
  'examples',
  'test',
  '.test.',
  '.spec.',
  'node_modules'
];

/**
 * Check if file should be scanned
 */
function shouldScanFile(filePath) {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  
  // Skip excluded files and directories
  for (const exclude of EXCLUDE_FILES) {
    if (fileName.includes(exclude) || dirName.includes(exclude)) {
      return false;
    }
  }
  
  // Only scan TypeScript/React files
  return filePath.endsWith('.tsx') || filePath.endsWith('.ts');
}

/**
 * Scan a file for problematic patterns
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    PROBLEMATIC_PATTERNS.forEach(({ pattern, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          description,
          matches: matches.length,
          examples: matches.slice(0, 3) // Show first 3 examples
        });
      }
    });
    
    return issues.length > 0 ? { filePath, issues } : null;
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}:${colors.reset}`, error.message);
    return null;
  }
}

/**
 * Recursively find all files in a directory
 */
function findFiles(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findFiles(fullPath));
      } else if (shouldScanFile(fullPath)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error reading directory ${dir}:${colors.reset}`, error.message);
  }
  
  return files;
}

/**
 * Generate fix suggestions
 */
function generateFixSuggestions(issues) {
  const suggestions = [];
  
  issues.forEach(issue => {
    switch (issue.description) {
      case 'Tailwind aviation classes':
        suggestions.push('Replace with design system components or useDesignSystem() hook');
        break;
      case 'aviation-card CSS class':
        suggestions.push('Replace with <Card> component from design system');
        break;
      case 'aviation-button CSS class':
        suggestions.push('Replace with <PrimaryButton> or <SecondaryButton> from design system');
        break;
      case 'aviation-input CSS class':
        suggestions.push('Replace with design system input component or inline styles');
        break;
      case 'question-option CSS class':
        suggestions.push('Replace with design system component or inline styles');
        break;
      case 'Mixed inline styles with className':
      case 'Mixed className with inline styles':
        suggestions.push('Choose one approach: either design system components OR Tailwind classes, not both');
        break;
    }
  });
  
  return [...new Set(suggestions)]; // Remove duplicates
}

/**
 * Main scanning function
 */
function scanForIssues() {
  console.log(`${colors.bold}${colors.blue}🔍 Scanning for UI Issues...${colors.reset}\n`);
  
  const allFiles = [];
  SCAN_DIRECTORIES.forEach(dir => {
    if (fs.existsSync(dir)) {
      allFiles.push(...findFiles(dir));
    }
  });
  
  console.log(`Found ${allFiles.length} files to scan\n`);
  
  const problematicFiles = [];
  
  allFiles.forEach(filePath => {
    const result = scanFile(filePath);
    if (result) {
      problematicFiles.push(result);
    }
  });
  
  if (problematicFiles.length === 0) {
    console.log(`${colors.green}✅ No UI issues found! Your code is already using the design system correctly.${colors.reset}`);
    return;
  }
  
  console.log(`${colors.red}❌ Found ${problematicFiles.length} files with UI issues:${colors.reset}\n`);
  
  problematicFiles.forEach(({ filePath, issues }) => {
    console.log(`${colors.bold}${filePath}${colors.reset}`);
    
    issues.forEach(issue => {
      console.log(`  ${colors.yellow}⚠️  ${issue.description}: ${issue.matches} instances${colors.reset}`);
      issue.examples.forEach(example => {
        console.log(`    ${colors.gray}${example}${colors.reset}`);
      });
    });
    
    const suggestions = generateFixSuggestions(issues);
    console.log(`  ${colors.blue}💡 Suggestions:${colors.reset}`);
    suggestions.forEach(suggestion => {
      console.log(`    ${colors.green}• ${suggestion}${colors.reset}`);
    });
    
    console.log('');
  });
  
  console.log(`${colors.bold}${colors.red}🚨 CRITICAL: These issues are causing UI inconsistencies!${colors.reset}`);
  console.log(`${colors.yellow}Follow the migration guide in DESIGN_SYSTEM_MIGRATION.md to fix these issues.${colors.reset}\n`);
}

/**
 * Generate a summary report
 */
function generateReport() {
  console.log(`${colors.bold}${colors.blue}📊 UI Issues Summary Report${colors.reset}\n`);
  
  const report = {
    totalFilesScanned: 0,
    problematicFiles: 0,
    totalIssues: 0,
    issueTypes: {}
  };
  
  // ... implementation would go here
  
  console.log(`Report generated at ${new Date().toISOString()}`);
}

// Run the script
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'scan':
      scanForIssues();
      break;
    case 'report':
      generateReport();
      break;
    default:
      console.log(`${colors.bold}UI Issues Fix Script${colors.reset}\n`);
      console.log('Usage:');
      console.log('  node scripts/fix-ui-issues.js scan    - Scan for UI issues');
      console.log('  node scripts/fix-ui-issues.js report  - Generate summary report');
      console.log('\nThis script helps identify mixed styling approaches that cause UI inconsistencies.');
  }
}

module.exports = { scanForIssues, generateReport };
