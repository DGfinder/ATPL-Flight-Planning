import React from 'react';
import { useDesignSystem } from '../design-system';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

interface MenuScreenProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  title?: string;
  subtitle?: string;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ 
  items, 
  onItemClick, 
  title = "Menu", 
  subtitle 
}) => {
  const { colors, spacing, styles } = useDesignSystem();

  return (
    <div style={{ padding: spacing.scale[6] }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing.scale[8] }}>
          <h1 style={{ ...styles.heading, fontSize: '2rem', marginBottom: spacing.scale[2] }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ ...styles.body, fontSize: '1.125rem', color: colors.aviation.muted }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Menu Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing.scale[4]
        }}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[3],
                padding: `${spacing.scale[3]} ${spacing.scale[3]}`,
                textAlign: 'left',
                borderRadius: spacing.radius.xl,
                background: item.isActive 
                  ? `linear-gradient(90deg, ${colors.aviation.primary} 0%, ${colors.aviation.secondary} 100%)`
                  : colors.white,
                color: item.isActive ? colors.white : colors.aviation.navy,
                boxShadow: item.isActive 
                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transform: item.isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: `1px solid ${item.isActive ? 'transparent' : colors.gray[200]}`
              }}
            >
              <div style={{
                width: '2rem',
                height: '2rem',
                background: item.isActive 
                  ? colors.white 
                  : `linear-gradient(135deg, ${colors.aviation.primary} 0%, ${colors.aviation.secondary} 100%)`,
                borderRadius: spacing.radius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                color: item.isActive ? colors.aviation.primary : colors.white
              }}>
                {item.icon}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  ...styles.heading, 
                  fontSize: '1.125rem', 
                  marginBottom: spacing.scale[1],
                  color: 'inherit'
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  opacity: item.isActive ? 0.9 : 0.7,
                  color: 'inherit'
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;