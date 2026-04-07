import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Heart, X, Save, Sparkles, ArrowRight, Coffee, Clock3, PencilLine, BellRing, MessageSquare, CircleAlert } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { getStoredProfile } from '../utils/profileHelpers';
import { appTheme } from '../theme';

const StudentPanel = ({ alerts = { unreadMessages: 0, currentPosts: 0 } }) => {
  const navigate = useNavigate();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [duration, setDuration] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [gratitude, setGratitude] = useState("");

  const { userName: username, greetingName, displayName, profilePic } = getStoredProfile();

  const colors = {
    primaryTeal: appTheme.primary,
    border: '#D1E5E2',
  };

  const durationOptions = [
    { label: '1 class', value: 'One class period' },
    { label: 'Few hrs', value: 'A few hours' },
    { label: 'Today', value: 'Until end of day' },
    { label: 'Overnight', value: 'Overnight' },
    { label: 'This week', value: 'This week' },
  ];

  const handlePostRequest = async (e) => {
    e.preventDefault();

    const gratitudeSummary = [
      additionalNote.trim() ? `Details: ${additionalNote.trim()}` : '',
      gratitude.trim() ? `Thanks: ${gratitude.trim()}` : '',
    ].filter(Boolean).join(' | ');

    const payload = { username, need: itemName, duration, gratitude: gratitudeSummary };
    const payloadWithProfile = profilePic ? { ...payload, profile_pic: profilePic } : payload;

    let { error } = await supabase
      .from('Kin')
      .insert([payloadWithProfile]);

    const shouldRetryWithoutAvatar = error?.message?.toLowerCase().includes('profile_pic')
      || error?.details?.toLowerCase().includes('profile_pic')
      || error?.hint?.toLowerCase().includes('profile_pic');

    if (shouldRetryWithoutAvatar) {
      ({ error } = await supabase
        .from('Kin')
        .insert([payload]));
    }

    if (error) {
      console.error("Error posting to Supabase:", error.message);
      alert('Could not post your request right now.');
      return;
    }

    setShowBorrowModal(false);
    setItemName("");
    setDuration("");
    setAdditionalNote("");
    setGratitude("");
    navigate('/borrow');
  };

  const modalOverlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.28)',
    backdropFilter: 'blur(14px)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
    overflowY: 'auto',
  };

  const modalContent = {
    background: appTheme.card,
    padding: '0',
    borderRadius: '36px',
    width: '100%',
    maxWidth: '620px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 32px 80px rgba(15, 23, 42, 0.18)',
    border: '1px solid rgba(255,255,255,0.92)',
    margin: '20px 0',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const featureCardStyle = {
    background: 'rgba(255,255,255,0.94)',
    padding: '2rem',
    borderRadius: '30px',
    border: `1px solid ${colors.border}`,
    cursor: 'pointer',
    boxShadow: '0 18px 42px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    flexDirection: 'column',
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
    padding: '16px 18px',
    borderRadius: '16px',
    border: '1px solid rgba(203,213,225,0.95)',
    outline: 'none',
    fontSize: '0.98rem',
    boxSizing: 'border-box',
    background: '#FFFFFF',
    color: '#0F172A',
    boxShadow: '0 6px 16px rgba(15,23,42,0.04)',
    display: 'block',
    maxWidth: '100%',
    minWidth: 0,
  };

  const textAreaStyle = {
    ...inputStyle,
    minHeight: '110px',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.55,
    overflow: 'hidden',
  };

  const fieldPanelStyle = {
    marginBottom: '18px',
    padding: '18px',
    borderRadius: '24px',
    background: '#F8FBFF',
    border: '1px solid rgba(209,229,226,0.9)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflow: 'hidden',
  };

  return (
    <div style={{ background: 'transparent', minHeight: '100%', padding: '8px 0 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {showBorrowModal && (
        <div style={modalOverlay}>
          <div style={modalContent} className="kin-scrollbar">
            <div style={{ padding: '28px 28px 22px', background: 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 58%, #57C5B6 100%)', color: 'white', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '22px' }}>
                <div>
                  <p style={{ margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '12px', opacity: 0.72, fontWeight: '700' }}>Borrow request</p>
                  <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', lineHeight: 1.05 }}>Ask the community for a quick hand</h2>
                  <p style={{ margin: '10px 0 0', lineHeight: 1.6, opacity: 0.9, maxWidth: '420px' }}>Make it clear, keep it friendly, and someone can jump in faster.</p>
                </div>
                <button onClick={() => setShowBorrowModal(false)} style={{ border: '1px solid rgba(255,255,255,0.24)', background: 'rgba(255,255,255,0.14)', width: '42px', height: '42px', borderRadius: '14px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', alignItems: 'stretch' }}>
                <div style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '24px', padding: '16px 18px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.72 }}>Posting as</p>
                  <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>{displayName || username}</p>
                  <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.55, opacity: 0.82 }}>A clear post gets noticed faster and makes replies easier.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '24px', padding: '16px 18px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.72 }}>Quick checklist</p>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.7, opacity: 0.88 }}>Item name, time needed, and one short note.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePostRequest} style={{ width: '100%', textAlign: 'left', padding: '24px 28px 28px', boxSizing: 'border-box' }}>
              <div style={fieldPanelStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Package size={18} color={colors.primaryTeal} />
                  <label style={{ fontWeight: '700', color: colors.primaryTeal, fontSize: '13px' }}>What item do you need?</label>
                </div>
                <input className="borrow-request-field" required style={inputStyle} placeholder="Example: Calculator or charger" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                <p style={{ margin: '6px 2px 0', fontSize: '12px', color: '#94A3B8' }}>Use the exact item name so people can scan it quickly.</p>
              </div>

              <div style={{ ...fieldPanelStyle, border: '1px solid rgba(219,234,254,0.95)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Clock3 size={18} color={colors.primaryTeal} />
                  <label style={{ fontWeight: '700', color: colors.primaryTeal, fontSize: '13px' }}>How long?</label>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDuration(option.value)}
                      style={{
                        border: duration === option.value ? '1px solid rgba(15,76,129,0.3)' : '1px solid rgba(209,229,226,0.9)',
                        background: duration === option.value ? 'linear-gradient(135deg, rgba(15,76,129,0.16) 0%, rgba(87,197,182,0.18) 100%)' : 'rgba(255,255,255,0.92)',
                        color: duration === option.value ? '#0F4C81' : '#475569',
                        padding: '10px 14px',
                        borderRadius: '999px',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        boxShadow: duration === option.value ? '0 10px 20px rgba(15,76,129,0.08)' : 'none',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p style={{ margin: '2px 2px 0', fontSize: '12px', color: '#94A3B8' }}>Pick the closest duration so helpers know if the request is urgent.</p>
              </div>

              <div style={{ ...fieldPanelStyle, border: '1px solid rgba(254,215,170,0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <PencilLine size={18} color={colors.primaryTeal} />
                  <label style={{ fontWeight: '700', color: colors.primaryTeal, fontSize: '13px' }}>Extra details</label>
                </div>
                <textarea className="borrow-request-field borrow-request-textarea" style={textAreaStyle} placeholder="Example: Need it for a 2 PM lab. I can return it after class." value={additionalNote} onChange={(e) => setAdditionalNote(e.target.value)} />
                <p style={{ margin: '2px 2px 0', fontSize: '12px', color: '#94A3B8' }}>This will appear in your post as extra details, separate from your token of thanks.</p>
              </div>

              <div style={{ ...fieldPanelStyle, background: 'linear-gradient(180deg, #FFF8EE 0%, #FFFDF8 100%)', border: '1px solid rgba(251,191,36,0.26)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Coffee size={18} color="#B45309" />
                  <label style={{ fontWeight: '700', color: '#9A3412', fontSize: '13px' }}>Token of thanks</label>
                </div>
                <textarea className="borrow-request-field borrow-request-textarea" style={{ ...textAreaStyle, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(251,191,36,0.18)' }} placeholder="Example: Coffee, snacks, or a big thank-you." value={gratitude} onChange={(e) => setGratitude(e.target.value)} />
                <p style={{ margin: '2px 2px 0', fontSize: '12px', color: '#B45309' }}>Optional, but a friendly note makes the request feel more personal.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '16px 18px', borderRadius: '22px', background: 'linear-gradient(135deg, #F4FAFF 0%, #EEF7F9 100%)', border: '1px solid rgba(209,229,226,0.9)' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8' }}>Ready to post</p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: 1.5 }}>Your request will show up in the hub right after this.</p>
                </div>
                <button type="submit" style={{ ...btnPrimary, minWidth: '180px', marginTop: 0 }}>
                  <Save size={18} /> Post request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ background: appTheme.button, color: 'white', borderRadius: '30px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 24px 48px rgba(15,76,129,0.2)', border: '1px solid rgba(255,255,255,0.16)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.76)' }}>Your dashboard</p>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0, color: 'white' }}>Hey, {greetingName || displayName || username}!</h1>
              <p style={{ margin: '12px 0 0', lineHeight: 1.7, maxWidth: '560px', color: 'rgba(255,255,255,0.88)' }}>
                Need something? Post it here, check the hub, and message people without the awkward back-and-forth.
              </p>
            </div>

            <div style={{ minWidth: '220px', background: appTheme.card, border: '1px solid rgba(255,255,255,0.86)', borderRadius: '24px', padding: '16px 18px', boxShadow: '0 10px 22px rgba(15,23,42,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Sparkles size={18} color="#1A5F7A" />
                <span style={{ fontWeight: '700', color: '#0F172A' }}>Quick start</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '14px', color: '#64748B' }}>Tap a card below to ask for something or see who needs help right now.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.8fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.94) 100%)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.86)', boxShadow: '0 18px 40px rgba(15,23,42,0.08)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <BellRing size={18} color="#DC2626" />
              <div>
                <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '800' }}>Overview alerts</p>
                <h2 style={{ margin: '4px 0 0', fontSize: '1.15rem', color: '#0F172A' }}>Current notifications</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '18px', background: 'linear-gradient(180deg, rgba(254,242,242,0.98) 0%, rgba(255,255,255,0.98) 100%)', border: '1px solid rgba(239,68,68,0.14)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquare size={16} color="#DC2626" />
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Current messages</p>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>Open Messages to check new conversations.</p>
                    </div>
                  </div>
                  {alerts.unreadMessages > 0 && (
                    <span style={{ minWidth: '28px', height: '28px', padding: '0 9px', borderRadius: '999px', background: '#DC2626', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
                      {alerts.unreadMessages}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: '18px', background: 'linear-gradient(180deg, rgba(254,242,242,0.98) 0%, rgba(255,255,255,0.98) 100%)', border: '1px solid rgba(239,68,68,0.14)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CircleAlert size={16} color="#DC2626" />
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Current posts</p>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>Your live requests are still visible in BorrowHub.</p>
                    </div>
                  </div>
                  {alerts.currentPosts > 0 && (
                    <span style={{ minWidth: '28px', height: '28px', padding: '0 9px', borderRadius: '999px', background: '#DC2626', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
                      {alerts.currentPosts}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.94) 100%)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.86)', boxShadow: '0 18px 40px rgba(15,23,42,0.08)', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ margin: '0 0 8px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '800' }}>Quick start</p>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.2rem' }}>Keep an eye on red remarks.</h2>
            <p style={{ margin: '10px 0 0', color: '#64748B', lineHeight: 1.65, fontSize: '14px' }}>Red marks now point to current messages and current posts, so you can see what needs attention faster.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          <div style={{ ...featureCardStyle, textAlign: 'left', alignItems: 'flex-start' }} onClick={() => setShowBorrowModal(true)}>
            <Package size={48} color={colors.primaryTeal} />
            <h2 style={{ color: colors.primaryTeal, marginBottom: '8px' }}>Ask for an item</h2>
            <p style={{ margin: 0, color: '#64748B', lineHeight: 1.6 }}>Put up a quick post and let people know what you're looking for.</p>
          </div>

          <div style={{ ...featureCardStyle, textAlign: 'left', alignItems: 'flex-start' }} onClick={() => navigate('/borrow')}>
            <Heart size={48} color="#F59E0B" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ color: colors.primaryTeal, margin: 0 }}>Check the hub</h2>
              {alerts.currentPosts > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: '999px', background: 'rgba(239,68,68,0.12)', color: '#DC2626', fontSize: '10px', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Current post
                </span>
              )}
            </div>
            <p style={{ margin: 0, color: '#64748B', lineHeight: 1.6 }}>See active requests, message other students, and jump in when you can help.</p>
            <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: colors.primaryTeal, fontWeight: '700' }}>
              Open the hub <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
