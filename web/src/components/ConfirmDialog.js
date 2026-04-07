import React from 'react';
import { AlertCircle } from 'lucide-react';
import { appTheme } from '../theme';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  tone = 'default',
  icon,
  busy = false,
}) => {
  if (!open) return null;

  const toneStyles = {
    default: {
      confirmBackground: appTheme.button,
      panelBackground: 'linear-gradient(135deg, #F4FAFF 0%, #EEF7F9 100%)',
      panelBorder: '1px solid rgba(209,229,226,0.9)',
      helperCopy: 'Please confirm before continuing.',
      helperColor: '#5B6B80',
    },
    danger: {
      confirmBackground: 'linear-gradient(135deg, #E11D48 0%, #F43F5E 55%, #FB7185 100%)',
      panelBackground: 'linear-gradient(135deg, #FFF1F2 0%, #FFF7F8 100%)',
      panelBorder: '1px solid rgba(251,113,133,0.22)',
      helperCopy: 'This action takes effect immediately.',
      helperColor: '#9F1239',
    },
    success: {
      confirmBackground: 'linear-gradient(135deg, #047857 0%, #10B981 58%, #6EE7B7 100%)',
      panelBackground: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
      panelBorder: '1px solid rgba(16,185,129,0.2)',
      helperCopy: 'Everything is ready to move forward.',
      helperColor: '#065F46',
    },
  };
  const activeTone = toneStyles[tone] || toneStyles.default;
  const Icon = icon || AlertCircle;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.28)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: appTheme.card, borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.86)', boxShadow: '0 28px 60px rgba(15,23,42,0.18)' }}>
        <div style={{ padding: '28px 28px 22px', background: activeTone.confirmBackground, color: 'white', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(255,255,255,0.14), transparent 26%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '18px', background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={26} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>{title}</h3>
            <p style={{ margin: '10px 0 0', lineHeight: 1.65, color: 'rgba(255,255,255,0.9)' }}>{message}</p>
          </div>
        </div>

        <div style={{ padding: '22px 28px 28px' }}>
          <div style={{ padding: '16px 18px', borderRadius: '22px', background: activeTone.panelBackground, border: activeTone.panelBorder, marginBottom: '18px' }}>
            <p style={{ margin: 0, color: activeTone.helperColor, fontSize: '14px', lineHeight: 1.55, fontWeight: '600' }}>
              {activeTone.helperCopy}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              style={{ flex: 1, background: '#F8FAFC', color: '#1E293B', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '16px', fontWeight: '700', cursor: busy ? 'default' : 'pointer' }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              style={{ flex: 1, background: activeTone.confirmBackground, color: 'white', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: '700', cursor: busy ? 'default' : 'pointer', boxShadow: `0 18px 32px ${tone === 'danger' ? 'rgba(244,63,94,0.22)' : tone === 'success' ? 'rgba(16,185,129,0.22)' : 'rgba(15,76,129,0.18)'}` }}
            >
              {busy ? 'Working...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
