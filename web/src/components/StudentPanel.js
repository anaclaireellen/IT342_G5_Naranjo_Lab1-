import React from 'react';
import { LogOut, Package, Search, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentPanel = () => {
  const navigate = useNavigate();
  // FIXED: Must match the key "userName" set in Login.js
  const username = localStorage.getItem("userName"); 
  const colors = { maroon: '#8B4444', gold: '#C5A059', bg: '#F4F0F0' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const featureCard = {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '32px',
    border: '1px solid #E2DADA',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0,0,0,0.02)',
    transition: 'transform 0.2s ease'
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', padding: '3rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: '#2D2D2D', fontSize: '2.5rem', fontWeight: '800' }}>
            Welcome, <span style={{color: colors.maroon}}>{username || 'Student'}</span>!
          </h1>
          <button onClick={handleLogout} style={{ background: colors.maroon, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={18} /> LOGOUT
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {/* Borrowing Feature */}
          <div style={featureCard} onClick={() => navigate('/borrow')}>
            <Package size={48} color={colors.gold} style={{marginBottom: '15px'}} />
            <h2 style={{color: colors.maroon, margin: '0 0 10px 0'}}>Borrow Items</h2>
            <p style={{color: '#666', fontSize: '0.95rem'}}>Request for university equipment or facility keys</p>
          </div>

          {/* Lost and Found Feature */}
          <div style={featureCard} onClick={() => navigate('/lost-found')}>
            <Search size={48} color={colors.gold} style={{marginBottom: '15px'}} />
            <h2 style={{color: colors.maroon, margin: '0 0 10px 0'}}>Lost & Found</h2>
            <p style={{color: '#666', fontSize: '0.95rem'}}>Report lost belongings or claim found items</p>
          </div>

          {/* Activity Log Feature */}
          <div style={{...featureCard, gridColumn: 'span 2'}} onClick={() => navigate('/activity')}>
            <History size={40} color={colors.gold} style={{marginBottom: '10px'}} />
            <h2 style={{color: colors.maroon, margin: '0 0 5px 0'}}>My Activity</h2>
            <p style={{color: '#666'}}>Track the status of your current requests and reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;