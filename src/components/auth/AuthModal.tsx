import React, { useState } from 'react';
import { Card, PrimaryButton, SecondaryButton, useDesignSystem } from '../../design-system';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(email, password);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <Card style={{
        padding: spacing.scale[6],
        width: '100%',
        maxWidth: '28rem',
        transform: 'scale(1)',
        animation: 'scaleIn 0.3s ease-out'
      }}>
        <h2 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[4] }}>
          {isLogin ? 'Login' : 'Register'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
          <div>
            <label style={{ display: 'block', marginBottom: spacing.scale[1], fontSize: '0.875rem', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: spacing.radius.md,
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: spacing.scale[1], fontSize: '0.875rem', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: spacing.radius.md,
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: spacing.scale[3] }}>
            <PrimaryButton
              type="submit"
              style={{ flex: 1 }}
            >
              {isLogin ? 'Login' : 'Register'}
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </SecondaryButton>
          </div>
        </form>
        
        <div style={{ marginTop: spacing.scale[4], textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: colors.aviation.primary,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;