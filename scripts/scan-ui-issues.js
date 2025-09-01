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
  { pattern: /className="[^"]*aviation-[^"]*"/g, description: 'Tailwind aviation classes' },
  { pattern: /className='[^']*aviation-[^']*'/g, description: 'Tailwind aviation classes (single quotes)' },
  { pattern: /className="[^"]*aviation-card[^"]*"/g, description: 'aviation-card CSS class' },
  { pattern: /className="[^"]*aviation-button[^"]*"/g, description: 'aviation-button CSS class' },
  { pattern: /className="[^"]*aviation-input[^"]*"/g, description: 'aviation-input CSS class' },
  { pattern: /className="[^"]*question-option[^"]*"/g, description: 'question-option CSS class' }
];

// Directories to scan
const SCAN_DIRECTORIES = [
  'src/components',
  'src/pages',
  'src/hooks',
  'src/contexts'
];

function findFiles(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findFiles(fullPath));
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        // Skip design-system files
        if (!fullPath.includes('design-system') && !fullPath.includes('examples')) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error reading directory ${dir}:${colors.reset}`, error.message);
  }
  
  return files;
}

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

function main() {
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
    
    console.log(`  ${colors.blue}💡 Suggestions:${colors.reset}`);
    console.log(`    ${colors.green}• Replace with design system components${colors.reset}`);
    console.log(`    ${colors.green}• Use useDesignSystem() hook for custom styling${colors.reset}`);
    console.log('');
  });
  
  console.log(`${colors.bold}${colors.red}🚨 CRITICAL: These issues are causing UI inconsistencies!${colors.reset}`);
  console.log(`${colors.yellow}Follow the migration guide in DESIGN_SYSTEM_MIGRATION.md to fix these issues.${colors.reset}\n`);
}

main();
