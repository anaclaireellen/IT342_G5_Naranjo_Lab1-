import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart } from 'lucide-react';

const RequestItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    need: '',
    duration: '',
    gratitude: ''
  });

  const colors = { 
    primaryTeal: '#1A5F7A', 
    mintAccent: '#57C5B6', 
    softBg: '#F0F9F8',
    border: '#D1E5E2' 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Get current user
    const currentUser = localStorage.getItem("userName") || "Guest";

    // 2. Create the new request
    const newRequest = {
      id: Date.now(),
      user: currentUser,
      need: formData.need,
      duration: formData.duration,
      gratitude: formData.gratitude
    };

    // 3. Save to SHARED KEY: "communityRequests"
    const existing = JSON.parse(localStorage.getItem("communityRequests") || "[]");
    const updated = [...existing, newRequest];
    
    localStorage.setItem("communityRequests", JSON.stringify(updated));
    
    // Debug log to confirm it's working
    console.log("Successfully saved to communityRequests:", updated);

    alert("Request posted successfully!");
    navigate('/borrow'); // Navigate to your Hub
  };

  return (
    <div style={{ background: colors.softBg, minHeight: '100vh', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#6A8E8A', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#FFFBEB', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Heart size={24} color="#F59E0B" />
          </div>
          <h2 style={{ color: colors.primaryTeal, fontWeight: '900', margin: 0 }}>Ask for Help</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            required 
            placeholder="What do you need?" 
            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${colors.border}` }}
            onChange={(e) => setFormData({...formData, need: e.target.value})}
          />
          <input 
            required 
            placeholder="For how long?" 
            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${colors.border}` }}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
          />
          <input 
            placeholder="Token of thanks (Optional)" 
            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${colors.border}` }}
            onChange={(e) => setFormData({...formData, gratitude: e.target.value})}
          />
          <button type="submit" style={{ background: colors.primaryTeal, color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            POST REQUEST
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestItem;