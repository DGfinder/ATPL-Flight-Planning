import React, { useState } from 'react';
import { Card, PrimaryButton, SecondaryButton, useDesignSystem } from '../../design-system';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    language: 'en'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card style={{
      maxWidth: '32rem',
      padding: spacing.scale[6],
      margin: spacing.scale[4],
      transform: 'scale(1)',
      animation: 'scaleIn 0.3s ease-out'
    }}>
      <h2 style={{ 
        ...styles.heading, 
        fontSize: '1.25rem',
        fontWeight: 700,
        color: colors.aviation.primary,
        marginBottom: spacing.scale[6]
      }}>
        Settings
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
        {/* Theme Setting */}
        <div>
          <label style={{ display: 'block', marginBottom: spacing.scale[2], fontSize: '0.875rem', fontWeight: 500 }}>
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            style={{
              width: '100%',
              padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: spacing.radius.md,
              fontSize: '0.875rem',
              outline: 'none'
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        {/* Notifications Setting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Enable Notifications
          </label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              accentColor: colors.aviation.primary
            }}
          />
        </div>

        {/* Auto Save Setting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Auto Save Progress
          </label>
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              accentColor: colors.aviation.primary
            }}
          />
        </div>

        {/* Language Setting */}
        <div>
          <label style={{ display: 'block', marginBottom: spacing.scale[2], fontSize: '0.875rem', fontWeight: 500 }}>
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            style={{
              width: '100%',
              padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: spacing.radius.md,
              fontSize: '0.875rem',
              outline: 'none'
            }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: spacing.scale[3], marginTop: spacing.scale[6] }}>
        <SecondaryButton
          onClick={onClose}
          style={{ flex: 1 }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            // Save settings logic here
            onClose();
          }}
          style={{ flex: 1 }}
        >
          Save Settings
        </PrimaryButton>
      </div>
    </Card>
  );
};

export default SettingsPanel;