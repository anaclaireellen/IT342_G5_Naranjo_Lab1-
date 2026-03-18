import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Heart, X, Save, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { getStoredProfile } from '../utils/profileHelpers';

const StudentPanel = () => {
  const navigate = useNavigate();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [duration, setDuration] = useState("");
  const [gratitude, setGratitude] = useState("");

  const { userName: username } = getStoredProfile();

  const colors = {
    primaryTeal: '#1A5F7A',
    mintAccent: '#57C5B6',
    softBg: '#F0F9F8',
    border: '#D1E5E2',
  };

  const handlePostRequest = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('Kin')
      .insert([{ username, need: itemName, duration, gratitude }]);

    if (error) {
      console.error("Error posting to Supabase:", error.message);
      return;
    }

    setShowBorrowModal(false);
    setItemName("");
    setDuration("");
    setGratitude("");
    navigate('/borrow');
  };

  const modalOverlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.25)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
  };

  const modalContent = {
    background: 'rgba(255,255,255,0.94)',
    padding: '2rem',
    borderRadius: '32px',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 28px 60px rgba(15, 23, 42, 0.18)',
    border: '1px solid rgba(255,255,255,0.85)',
  };

  const featureCardStyle = {
    background: 'rgba(255,255,255,0.78)',
    padding: '2rem',
    borderRadius: '30px',
    border: `1px solid ${colors.border}`,
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 18px 42px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '250px',
    backdropFilter: 'blur(20px)',
  };

  const btnPrimary = {
    background: 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 58%, #57C5B6 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '18px',
    cursor: 'pointer',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    boxShadow: '0 18px 34px rgba(15, 76, 129, 0.18)',
  };

  const inputStyle = {
    width: '100%',
    padding: '15px 16px',
    marginBottom: '15px',
    borderRadius: '16px',
    border: '1px solid #D1E5E2',
    outline: 'none',
    fontSize: '1rem',
    boxSizing: 'border-box',
    background: '#F8FAFC',
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #F6FAFF 0%, #EEF7F9 55%, #F8FAFC 100%)', minHeight: '100vh', padding: '8px 0 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {showBorrowModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <p style={{ margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '12px', color: '#94A3B8' }}>Borrow hub</p>
                <h2 style={{ color: colors.primaryTeal, margin: 0, fontSize: '28px' }}>Request an Item</h2>
              </div>
              <X onClick={() => setShowBorrowModal(false)} style={{ cursor: 'pointer', color: '#64748B' }} />
            </div>
            <form onSubmit={handlePostRequest} style={{ width: '100%', textAlign: 'left' }}>
              <label style={{ fontWeight: '700', color: colors.primaryTeal, display: 'block', marginBottom: '8px' }}>Item Name</label>
              <input required style={inputStyle} placeholder="What do you need?" value={itemName} onChange={(e) => setItemName(e.target.value)} />

              <label style={{ fontWeight: '700', color: colors.primaryTeal, display: 'block', marginBottom: '8px' }}>Duration</label>
              <input required style={inputStyle} placeholder="e.g. 3 hours" value={duration} onChange={(e) => setDuration(e.target.value)} />

              <label style={{ fontWeight: '700', color: colors.primaryTeal, display: 'block', marginBottom: '8px' }}>Gratitude</label>
              <input style={inputStyle} placeholder="e.g. Coffee or snacks" value={gratitude} onChange={(e) => setGratitude(e.target.value)} />

              <button type="submit" style={{ ...btnPrimary, width: '100%', marginTop: '8px' }}>
                <Save size={18} /> Post to Hub
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 55%, #57C5B6 100%)', color: 'white', borderRadius: '34px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 30px 60px rgba(15, 76, 129, 0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8 }}>Community dashboard</p>
              <h1 style={{ color: 'white', fontSize: '2.4rem', fontWeight: '800', margin: 0 }}>Hello, {username}</h1>
              <p style={{ margin: '12px 0 0', lineHeight: 1.7, maxWidth: '560px', opacity: 0.88 }}>
                Request what you need, browse the hub, and jump into user-to-user conversations with a cleaner flow.
              </p>
            </div>

            <div style={{ minWidth: '220px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '24px', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Sparkles size={18} />
                <span style={{ fontWeight: '700' }}>Quick actions</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '14px' }}>Use the cards below to post a request or browse the live feed of borrowers.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          <div style={featureCardStyle} onClick={() => setShowBorrowModal(true)}>
            <Package size={48} color={colors.primaryTeal} />
            <h2 style={{ color: colors.primaryTeal, marginBottom: '8px' }}>Borrow Items</h2>
            <p style={{ margin: 0, color: '#64748B', lineHeight: 1.6 }}>Create a request with the item, how long you need it, and a thank-you note.</p>
          </div>

          <div style={featureCardStyle} onClick={() => navigate('/borrow')}>
            <Heart size={48} color="#F59E0B" />
            <h2 style={{ color: colors.primaryTeal, marginBottom: '8px' }}>View Hub</h2>
            <p style={{ margin: 0, color: '#64748B', lineHeight: 1.6 }}>See community posts, open direct chats, and match with the right person faster.</p>
            <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: colors.primaryTeal, fontWeight: '700' }}>
              Open hub <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
