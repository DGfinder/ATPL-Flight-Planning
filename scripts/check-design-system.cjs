#!/usr/bin/env node

/**
 * Design System Compliance Checker
 * 
 * This script validates that all components follow the design system
 * and don't use forbidden patterns like aviation-* classes.
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

// Forbidden patterns that violate design system
const FORBIDDEN_PATTERNS = [
  {
    pattern: /className="[^"]*aviation-[^"]*"/g,
    description: 'Tailwind aviation classes',
    suggestion: 'Use design system components or useDesignSystem() hook'
  },
  {
    pattern: /className='[^']*aviation-[^']*'/g,
    description: 'Tailwind aviation classes (single quotes)',
    suggestion: 'Use design system components or useDesignSystem() hook'
  },
  {
    pattern: /className="[^"]*aviation-card[^"]*"/g,
    description: 'aviation-card CSS class',
    suggestion: 'Replace with <Card> component from design system'
  },
  {
    pattern: /className="[^"]*aviation-button[^"]*"/g,
    description: 'aviation-button CSS class',
    suggestion: 'Replace with <PrimaryButton> or <SecondaryButton> from design system'
  },
  {
    pattern: /className="[^"]*aviation-input[^"]*"/g,
    description: 'aviation-input CSS class',
    suggestion: 'Replace with design system input component'
  },
  {
    pattern: /className="[^"]*question-option[^"]*"/g,
    description: 'question-option CSS class',
    suggestion: 'Replace with design system component or inline styles'
  }
];

// Directories to scan
const SCAN_DIRECTORIES = [
  'src/components',
  'src/pages',
  'src/hooks',
  'src/contexts'
];

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
  'design-system',
  'examples',
  'test',
  '.test.',
  '.spec.',
  'node_modules',
  '__tests__'
];

/**
 * Check if file should be scanned
 */
function shouldScanFile(filePath) {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  
  // Skip excluded files and directories
  for (const exclude of EXCLUDE_PATTERNS) {
    if (fileName.includes(exclude) || dirName.includes(exclude)) {
      return false;
    }
  }
  
  // Only scan TypeScript/React files
  return filePath.endsWith('.tsx') || filePath.endsWith('.ts');
}

/**
 * Scan a file for forbidden patterns
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    FORBIDDEN_PATTERNS.forEach(({ pattern, description, suggestion }) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          description,
          suggestion,
          matches: matches.length,
          examples: matches.slice(0, 3)
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
 * Main checking function
 */
function checkDesignSystem() {
  console.log(`${colors.bold}${colors.blue}🔍 Checking Design System Compliance...${colors.reset}\n`);
  
  const allFiles = [];
  SCAN_DIRECTORIES.forEach(dir => {
    if (fs.existsSync(dir)) {
      allFiles.push(...findFiles(dir));
    }
  });
  
  console.log(`Found ${allFiles.length} files to check\n`);
  
  const violations = [];
  
  allFiles.forEach(filePath => {
    const result = scanFile(filePath);
    if (result) {
      violations.push(result);
    }
  });
  
  if (violations.length === 0) {
    console.log(`${colors.green}✅ All files follow design system guidelines!${colors.reset}`);
    return { success: true, violations: [] };
  }
  
  console.log(`${colors.red}❌ Found ${violations.length} files with design system violations:${colors.reset}\n`);
  
  violations.forEach(({ filePath, issues }) => {
    console.log(`${colors.bold}${filePath}${colors.reset}`);
    
    issues.forEach(issue => {
      console.log(`  ${colors.yellow}⚠️  ${issue.description}: ${issue.matches} instances${colors.reset}`);
      issue.examples.forEach(example => {
        console.log(`    ${colors.gray}${example}${colors.reset}`);
      });
      console.log(`  ${colors.blue}💡 ${issue.suggestion}${colors.reset}`);
    });
    
    console.log('');
  });
  
  console.log(`${colors.bold}${colors.red}🚨 CRITICAL: These violations break design system consistency!${colors.reset}`);
  console.log(`${colors.yellow}Follow the migration guide in DESIGN_SYSTEM_MIGRATION.md to fix these issues.${colors.reset}\n`);
  
  return { success: false, violations };
}

/**
 * Run the check
 */
function main() {
  const result = checkDesignSystem();
  
  // Exit with error code if violations found
  if (!result.success) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkDesignSystem };
