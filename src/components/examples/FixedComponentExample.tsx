import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  PrimaryButton, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';

/**
 * Example of a properly implemented component using the design system
 * This shows how to avoid the mixed styling approaches that cause UI issues
 */
const FixedComponentExample: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();

  return (
    <div style={styles.container}>
      {/* ✅ GOOD: Using design system components consistently */}
      <Card variant="elevated" padding="lg">
        <CardHeader title="Proper Design System Usage" />
        <CardContent>
          <p style={styles.body}>
            This component demonstrates the correct way to use the aviation design system.
            No mixed styling approaches, no conflicting CSS classes.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: spacing.scale[3], 
            marginTop: spacing.scale[4] 
          }}>
            <PrimaryButton>Primary Action</PrimaryButton>
            <SecondaryButton>Secondary Action</SecondaryButton>
          </div>
        </CardContent>
      </Card>

      {/* ✅ GOOD: Using design system tokens for custom styling */}
      <Card variant="default" padding="md" style={{ marginTop: spacing.scale[4] }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing.scale[4]
        }}>
          <div style={{
            padding: spacing.scale[3],
            background: colors.aviation.light,
            borderRadius: spacing.radius.lg,
            border: `1px solid ${colors.gray[200]}`
          }}>
            <h3 style={styles.heading}>Consistent Styling</h3>
            <p style={styles.caption}>All styles come from design tokens</p>
          </div>
          
          <div style={{
            padding: spacing.scale[3],
            background: colors.white,
            borderRadius: spacing.radius.lg,
            border: `1px solid ${colors.aviation.primary}`,
            color: colors.aviation.primary
          }}>
            <h3 style={styles.heading}>No Conflicts</h3>
            <p style={styles.caption}>No CSS class conflicts or specificity issues</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

/**
 * ❌ BAD EXAMPLE: Mixed styling approaches (DON'T DO THIS)
 * 
 * This shows what NOT to do - mixing design system with Tailwind classes
 */
// const BadComponentExample: React.FC = () => {
//   return (
//     <div className="container mx-auto p-4"> {/* ❌ Mixing Tailwind with design system */}
//       <div className="aviation-card p-4"> {/* ❌ Using custom CSS classes */}
//         <h3 className="text-aviation-primary">Mixed Approaches</h3> {/* ❌ Tailwind aviation classes */}
//         <button className="aviation-button">Click me</button> {/* ❌ Custom CSS classes */}
//       </div>
//     </div>
//   );
// };

/**
 * ✅ GOOD EXAMPLE: Pure design system approach
 * 
 * This shows the correct way - using only design system components
 */
// const GoodComponentExample: React.FC = () => {
//   const { colors, spacing, styles } = useDesignSystem();
//   return (
//     <div style={styles.container}>
//       <Card variant="default" padding="md">
//         <CardHeader title="Pure Design System" />
//         <CardContent>
//           <p style={styles.body}>
//             This component uses only the design system - no Tailwind classes,
//             no custom CSS, no mixed approaches.
//           </p>
//           
//           <div style={{ 
//             display: 'flex', 
//             gap: spacing.scale[3], 
//             marginTop: spacing.scale[4] 
//           }}>
//             <PrimaryButton>Consistent Button</PrimaryButton>
//             <SecondaryButton>Another Button</SecondaryButton>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

export default FixedComponentExample;
