import React, { useEffect, useState } from 'react';

// ConsentPopup: small bottom‑right modal informing about data usage (LGPD)
// Shows two buttons: Confirm and Deny. Stores choice in localStorage and
// optionally notifies the backend.

const ConsentPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Determine if consent already set
  useEffect(() => {
    const consent = localStorage.getItem('lgpdConsent');
    if (!consent) {
      // Show after a short delay for UX
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const sendConsent = async (accepted: boolean) => {
    // Persist locally
    localStorage.setItem('lgpdConsent', accepted ? 'accepted' : 'rejected');
    setVisible(false);
    // Fire‑and‑forget request to backend (ignore errors for demo)
    try {
      await fetch('/api/users/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: accepted }),
        credentials: 'include',
      });
    } catch (e) {
      console.error('Failed to store consent', e);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      padding: '16px 24px',
      maxWidth: '420px',
      zIndex: 1000,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <p style={{ margin: 0, marginBottom: '12px', color: '#222', fontWeight: 500 }}>
        Este site utiliza seus dados para análises de vendas e segurança, em conformidade com a LGPD.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button
          onClick={() => sendConsent(false)}
          style={{
            background: '#e0e0e0',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 14px',
            cursor: 'pointer',
          }}>
          Negar
        </button>
        <button
          onClick={() => sendConsent(true)}
          style={{
            background: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 14px',
            cursor: 'pointer',
          }}>
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default ConsentPopup;
