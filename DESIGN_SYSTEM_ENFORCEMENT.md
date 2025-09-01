# Design System Enforcement Guide

## 🛡️ **Prevention System Setup**

This guide ensures your team never goes outside the design system again, preventing UI inconsistencies.

### **1. ESLint Rules (CRITICAL)**

Add these ESLint rules to catch violations before they reach production:

```json
// .eslintrc.json
{
  "rules": {
    // Prevent Tailwind aviation classes
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/aviation-/]",
        "message": "Use design system components instead of aviation-* classes"
      }
    ],
    
    // Prevent custom CSS classes
    "no-restricted-properties": [
      "error",
      {
        "object": "className",
        "property": "aviation-card",
        "message": "Use <Card> component from design system"
      },
      {
        "object": "className", 
        "property": "aviation-button",
        "message": "Use <PrimaryButton> or <SecondaryButton> from design system"
      },
      {
        "object": "className",
        "property": "aviation-input", 
        "message": "Use design system input component"
      }
    ]
  }
}
```

### **2. Pre-commit Hooks**

Install husky and add pre-commit validation:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "npm run check-design-system"
    ]
  }
}
```

### **3. Design System Check Script**

Create a script that validates design system usage:

```javascript
// scripts/check-design-system.js
const fs = require('fs');
const path = require('path');

const FORBIDDEN_PATTERNS = [
  /className="[^"]*aviation-[^"]*"/g,
  /className='[^']*aviation-[^']*'/g,
  /className="[^"]*aviation-card[^"]*"/g,
  /className="[^"]*aviation-button[^"]*"/g,
  /className="[^"]*aviation-input[^"]*"/g
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  FORBIDDEN_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        pattern: index,
        matches: matches.length,
        examples: matches.slice(0, 2)
      });
    }
  });
  
  return issues.length > 0 ? { filePath, issues } : null;
}

function main() {
  const srcDir = 'src';
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !fullPath.includes('design-system')) {
        walkDir(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  }
  
  walkDir(srcDir);
  
  const violations = [];
  files.forEach(file => {
    const result = checkFile(file);
    if (result) violations.push(result);
  });
  
  if (violations.length > 0) {
    console.error('❌ Design System Violations Found:');
    violations.forEach(v => {
      console.error(`  ${v.filePath}`);
      v.issues.forEach(i => {
        console.error(`    - ${i.matches} violations`);
      });
    });
    process.exit(1);
  }
  
  console.log('✅ All files follow design system guidelines');
}

main();
```

### **4. TypeScript Custom Types**

Create strict types to prevent misuse:

```typescript
// src/types/design-system.ts
export type DesignSystemColor = 
  | 'aviation-primary'
  | 'aviation-secondary' 
  | 'aviation-navy'
  | 'aviation-muted'
  | 'aviation-text'
  | 'aviation-light';

export type DesignSystemComponent = 
  | 'Card'
  | 'Button' 
  | 'Input'
  | 'Layout'
  | 'Sidebar';

// Prevent direct className usage
export type RestrictedClassName = never;

// Force design system usage
export interface DesignSystemProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  // ... other design system props
}
```

### **5. IDE Extensions & Snippets**

#### **VS Code Extensions:**
- **ESLint** - Catches violations in real-time
- **Prettier** - Consistent formatting
- **TypeScript Importer** - Auto-imports design system components

#### **VS Code Snippets:**
```json
// .vscode/snippets/design-system.json
{
  "Design System Card": {
    "prefix": "dscard",
    "body": [
      "<Card variant=\"default\" padding=\"md\">",
      "  <CardHeader title=\"$1\" />",
      "  <CardContent>",
      "    $2",
      "  </CardContent>",
      "</Card>"
    ]
  },
  "Design System Button": {
    "prefix": "dsbtn",
    "body": [
      "<PrimaryButton onClick={() => $1}>",
      "  $2",
      "</PrimaryButton>"
    ]
  },
  "Design System Hook": {
    "prefix": "dshook",
    "body": [
      "const { colors, spacing, styles } = useDesignSystem();"
    ]
  }
}
```

### **6. Code Review Checklist**

Add this to your PR template:

```markdown
## Design System Compliance Checklist

- [ ] No `className="aviation-*"` usage
- [ ] No custom CSS classes (`.aviation-card`, `.aviation-button`)
- [ ] Using design system components (`<Card>`, `<Button>`, etc.)
- [ ] Using `useDesignSystem()` hook for custom styling
- [ ] No inline styles mixed with className
- [ ] All colors from design system tokens
- [ ] All spacing from design system tokens
- [ ] All typography from design system tokens

## Before Merging

- [ ] Run `npm run check-design-system`
- [ ] Run `npm run lint`
- [ ] Visual review confirms consistency
```

### **7. Automated Testing**

Add design system tests:

```typescript
// src/__tests__/design-system.test.tsx
import { render } from '@testing-library/react';
import { Card, Button, useDesignSystem } from '../design-system';

describe('Design System Components', () => {
  test('Card renders with correct styling', () => {
    const { container } = render(
      <Card variant="default" padding="md">
        <div>Test content</div>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    });
  });
  
  test('Button renders with correct styling', () => {
    const { container } = render(
      <Button variant="primary">Test Button</Button>
    );
    
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveStyle({
      background: 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)',
      color: '#ffffff'
    });
  });
});
```

### **8. Documentation & Training**

#### **Team Training:**
1. **Design System Workshop** - 2-hour session
2. **Component Usage Examples** - Live coding
3. **Common Pitfalls** - What NOT to do
4. **Migration Guide** - How to fix existing code

#### **Documentation:**
- Component API documentation
- Usage examples
- Best practices
- Migration patterns

### **9. Monitoring & Alerts**

Set up monitoring to catch violations:

```javascript
// scripts/monitor-design-system.js
const fs = require('fs');
const path = require('path');

// Run daily to check for violations
function monitorDesignSystem() {
  // Implementation here
  const violations = scanForViolations();
  
  if (violations.length > 0) {
    // Send alert to team
    sendAlert({
      type: 'design-system-violation',
      count: violations.length,
      files: violations.map(v => v.filePath)
    });
  }
}

// Run in CI/CD pipeline
if (process.env.CI) {
  monitorDesignSystem();
}
```

### **10. Enforcement Levels**

#### **Level 1: Warnings (Development)**
- ESLint warnings
- IDE hints
- Code review comments

#### **Level 2: Blocking (Pre-commit)**
- Pre-commit hooks
- Automated checks
- PR blocking

#### **Level 3: Automated Fixes**
- Auto-replace patterns
- Migration scripts
- Code generation

## 🎯 **Implementation Priority**

1. **Week 1**: ESLint rules + Pre-commit hooks
2. **Week 2**: TypeScript types + IDE setup
3. **Week 3**: Testing + Documentation
4. **Week 4**: Monitoring + Team training

## 🚀 **Benefits**

- ✅ **Zero UI inconsistencies**
- ✅ **Faster development** (reusable components)
- ✅ **Better maintainability**
- ✅ **Type safety**
- ✅ **Automated quality control**
- ✅ **Team productivity**

This system ensures your design system is the **single source of truth** and prevents any future UI issues!
