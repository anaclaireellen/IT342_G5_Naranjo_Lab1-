import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ShieldCheck, Package } from 'lucide-react';

const ItemDetail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const colors = { maroon: '#8B4444', gold: '#C5A059', bg: '#F4F0F0' };

  const handleRequest = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mimicking POST /api/transactions/request
    setTimeout(() => {
      alert("Borrow Request Sent! Transaction status: PENDING.");
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', padding: '2rem 5%', fontFamily: 'Inter, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#666', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to Hub
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', background: 'white', padding: '3rem', borderRadius: '32px', border: '1px solid #E2DADA' }}>
        <div>
          <div style={{ background: colors.bg, height: '280px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={100} color={colors.gold} />
          </div>
          <h1 style={{ marginTop: '1.5rem' }}>Scientific Calculator</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#059669', fontWeight: 'bold', marginTop: '10px' }}>
            <ShieldCheck size={20} /> Lender Reputation: 4.9/5.0
          </div>
        </div>

        <form onSubmit={handleRequest}>
          <h2 style={{ marginBottom: '1.5rem' }}>Borrow Request</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16}/> Duration</label>
            <input type="text" placeholder="e.g., 2 days" required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #DCD0D0', marginTop: '8px' }} />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16}/> Meeting Spot</label>
            <select required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #DCD0D0', marginTop: '8px' }}>
              <option value="">Select a location...</option>
              <option value="Library">Main Library</option>
              <option value="GLE">GLE Lobby</option>
              <option value="Canteen">Canteen A</option>
            </select>
          </div>
          <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: colors.maroon, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? "Processing..." : "Initiate Borrow Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemDetail;