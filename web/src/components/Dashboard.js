import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Star, Clock, LogOut } from 'lucide-react';

const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  const colors = { maroon: '#8B4444', gold: '#C5A059', bg: '#F4F0F0' };

  // Mock data representing items from GET /api/items
  const [items] = useState([
    { id: 1, name: 'Scientific Calculator', status: 'Available', lender: 'Juan D.', rep: '4.9', cat: 'Stationery' },
    { id: 2, name: 'Type-C Adapter', status: 'On Loan', lender: 'Maria K.', rep: '4.7', cat: 'Electronics' }
  ]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setAuth(false);
      navigate('/');
    }
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ background: 'white', padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2DADA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={process.env.PUBLIC_URL + '/citu-logo.png'} alt="CIT-U" style={{ width: '40px' }} />
          <h2 style={{ color: colors.maroon, fontWeight: '900', margin: 0 }}>KIN</h2>
        </div>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.maroon }}><LogOut /></button>
      </nav>

      <div style={{ padding: '2rem 5%' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1>The Hub</h1>
          <p style={{ color: '#666' }}>Browse active campus listings.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2DADA' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Package color={colors.gold} size={24} />
                <span style={{ 
                  fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px',
                  background: item.status === 'Available' ? '#D1FAE5' : '#FEE2E2',
                  color: item.status === 'Available' ? '#065F46' : '#991B1B'
                }}>
                  {item.status}
                </span>
              </div>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <Star size={14} color={colors.gold} fill={colors.gold} />
                <span>{item.rep} • Lender: {item.lender}</span>
              </div>
              <button 
                onClick={() => navigate(`/item/${item.id}`)}
                disabled={item.status === 'On Loan'}
                style={{ 
                  width: '100%', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold',
                  background: item.status === 'Available' ? colors.maroon : '#DDD',
                  color: 'white', cursor: item.status === 'Available' ? 'pointer' : 'not-allowed'
                }}>
                View & Request
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;