import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Trash2, Sparkles, Clock3, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { fetchProfilesByUsernames, getStoredProfile } from '../utils/profileHelpers';

const BorrowHub = () => {
  const navigate = useNavigate();
  const [communityRequests, setCommunityRequests] = useState([]);
  const [profiles, setProfiles] = useState({});
  const { userName: activeUser } = getStoredProfile();

  const colors = {
    bg: '#F8FAFC',
    primary: '#1A5F7A',
    accent: '#57C5B6',
    white: '#FFFFFF',
    text: '#334155'
  };

  const loadData = async () => {
    const { data, error } = await supabase.from('Kin').select('*').order('created_at', { ascending: false });
    if (error) return;

    const requests = data || [];
    setCommunityRequests(requests);

    try {
      const nextProfiles = await fetchProfilesByUsernames(requests.map((req) => req.username));
      setProfiles(nextProfiles);
    } catch (profileError) {
      console.error('Could not load profiles', profileError);
    }
  };

  useEffect(() => {
    loadData();
    const sub = supabase.channel('public:Kin').on('postgres_changes', { event: '*', schema: 'public', table: 'Kin' }, loadData).subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const handleLendHand = async (req) => {
    if (!activeUser || req.username === activeUser) return;

    const starterMessage = `Hi ${req.username}, I can lend a hand with your request for ${req.need}${req.duration ? ` for ${req.duration}` : ''}.`;
    const { error } = await supabase.from('messages').insert([{
      content: starterMessage,
      sender_username: activeUser,
      receiver_username: req.username,
    }]);

    if (error) {
      alert('Could not send your message right now.');
      return;
    }

    navigate(`/dashboard?tab=messages&user=${encodeURIComponent(req.username)}`);
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #F7FAFF 0%, #EFF6FF 35%, #F6FBFB 100%)', minHeight: '100vh', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(148,163,184,0.18)', color: colors.primary, fontWeight: '700', marginBottom: '1.5rem', cursor: 'pointer', padding: '12px 16px', borderRadius: '18px', backdropFilter: 'blur(16px)' }}>
          <ArrowLeft size={20} /> Dashboard
        </button>

        <div style={{ background: 'linear-gradient(135deg, rgba(15,76,129,0.96) 0%, rgba(26,95,122,0.92) 58%, rgba(87,197,182,0.82) 100%)', borderRadius: '34px', padding: '2rem', color: 'white', marginBottom: '2rem', boxShadow: '0 24px 56px rgba(37, 99, 235, 0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '12px', opacity: 0.78 }}>Borrow hub</p>
              <h1 style={{ fontSize: '2.6rem', fontWeight: '800', margin: 0 }}>Community requests, reworked.</h1>
              <p style={{ margin: '12px 0 0', maxWidth: '560px', lineHeight: 1.7, opacity: 0.88 }}>Browse what people need, see who posted it, and start a direct conversation in one tap.</p>
            </div>
            <div style={{ minWidth: '180px', padding: '18px 20px', borderRadius: '24px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Sparkles size={18} />
                <span style={{ fontWeight: '700' }}>Live requests</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>{communityRequests.length}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {communityRequests.map((req) => {
            const isOwn = req.username === activeUser;
            const requestProfilePic = profiles[req.username]?.profilePic || '';

            return (
              <div key={req.id} style={{ background: 'rgba(255,255,255,0.84)', padding: '2rem', borderRadius: '32px', boxShadow: '0 16px 38px rgba(15, 23, 42, 0.06)', position: 'relative', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(18px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '18px', overflow: 'hidden', background: '#E2E8F0', border: '1px solid rgba(148,163,184,0.16)' }}>
                      {requestProfilePic ? <img src={requestProfilePic} alt={req.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><User size={20} color={colors.primary} /></div>}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: colors.text }}>{req.username}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock3 size={12} />Community request</div>
                    </div>
                  </div>
                  {isOwn && <Trash2 size={18} color="#FDA4AF" style={{ cursor: 'pointer' }} />}
                </div>

                <h2 style={{ fontSize: '1.32rem', margin: '0 0 10px 0', color: colors.primary }}>{req.need}</h2>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', background: '#F1F5F9', padding: '4px 12px', borderRadius: '20px', color: '#64748B' }}>{req.duration}</span>
                  <span style={{ fontSize: '12px', background: 'rgba(87,197,182,0.14)', padding: '4px 12px', borderRadius: '20px', color: '#0F766E' }}>Borrower nearby</span>
                </div>

                <div style={{ background: `${colors.accent}10`, padding: '14px', borderRadius: '18px', marginBottom: '1.5rem', border: '1px solid rgba(87,197,182,0.12)' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: colors.accent, fontWeight: '600', lineHeight: 1.6 }}>Token of thanks: {req.gratitude || 'A kind favor in return'}</p>
                </div>

                <button
                  disabled={isOwn}
                  onClick={() => !isOwn && handleLendHand(req)}
                  style={{ width: '100%', padding: '15px', borderRadius: '20px', border: 'none', background: isOwn ? '#F1F5F9' : 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 60%, #57C5B6 100%)', color: isOwn ? '#94A3B8' : 'white', fontWeight: '700', cursor: isOwn ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: isOwn ? 'none' : '0 14px 32px rgba(15, 76, 129, 0.2)' }}
                >
                  <MessageCircle size={18} /> {isOwn ? "Manage Post" : "Lend a Hand"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BorrowHub;
