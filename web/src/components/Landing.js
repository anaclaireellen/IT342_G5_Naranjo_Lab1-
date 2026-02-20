import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  
  // Matte Pastel Palette (Refined Maroon & Gold)
  const colors = { 
    maroon: '#8B4444', 
    gold: '#C5A059', 
    bg: '#F4F0F0' 
  };

  return (
    <div style={{ 
      background: colors.bg, 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'Inter, sans-serif' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '3.5rem', 
        borderRadius: '32px', 
        textAlign: 'center', 
        width: '90%', 
        maxWidth: '400px', 
        border: '1px solid #E2DADA', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.03)' 
      }}>
        
        {/* Fixed Filename to match your 'citu-logo.png.png' */}
        <img 
          src="/citu-logo.png" 
          alt="CIT-U Logo" 
          style={{ width: '120px', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem' }} 
        />
        
        <h1 style={{ color: '#2D2D2D', fontSize: '3rem', margin: 0, fontWeight: '900', letterSpacing: '1px' }}>KIN</h1>
        <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1rem', fontWeight: '500' }}>Your campus companion.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => navigate('/login')} 
            style={{ background: colors.maroon, color: 'white', border: 'none', padding: '15px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Jump In
          </button>
          <button onClick={() => navigate('/register')} 
            style={{ background: 'white', color: colors.maroon, border: `2px solid ${colors.maroon}`, padding: '14px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            Join the Kinship
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;