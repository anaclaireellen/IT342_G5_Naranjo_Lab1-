import React, { useState, useEffect } from 'react';
import { MessageSquare, LayoutDashboard, LogOut, Settings, User, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentPanel from './StudentPanel';
import ProfileSettings from './ProfileSettings';
import AestheticChat from './AestheticChat';
import AdminPanel from './AdminPanel';
import { clearStoredSession, getStoredProfile, PROFILE_UPDATED_EVENT } from '../utils/profileHelpers';
import { appTheme } from '../theme';
import ConfirmDialog from './ConfirmDialog';
import { supabase } from '../supabaseClient';

const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionProfile, setSessionProfile] = useState(getStoredProfile());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(() => window.innerWidth <= 900);
  const [dashboardAlerts, setDashboardAlerts] = useState({ unreadMessages: 0, currentPosts: 0 });

  const { userName, displayName, greetingName, userRole, profilePic } = sessionProfile;

  const colors = {
    bg: '#EEF4FA',
    sidebar: 'rgba(255,255,255,0.82)',
    primary: appTheme.primary,
    accent: appTheme.accent,
    border: '#E2E8F0',
    textMain: '#1E293B',
    textMuted: appTheme.textMuted,
    danger: '#EF4444'
  };

  useEffect(() => {
    const syncProfile = () => setSessionProfile(getStoredProfile());
    window.addEventListener('storage', syncProfile);
    window.addEventListener(PROFILE_UPDATED_EVENT, syncProfile);

    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener(PROFILE_UPDATED_EVENT, syncProfile);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsCompactLayout(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedTab = params.get('tab');

    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

  useEffect(() => {
    if (!userName || userRole === 'ADMIN') return undefined;

    const loadAlerts = async () => {
      const [{ data: messageData, error: messageError }, { data: postData, error: postError }] = await Promise.all([
        supabase
          .from('messages')
          .select('sender_username, receiver_username, created_at')
          .eq('receiver_username', userName)
          .order('created_at', { ascending: false }),
        supabase
          .from('Kin')
          .select('id, username')
          .eq('username', userName),
      ]);

      if (!messageError) {
        const latestBySender = new Map();
        (messageData || []).forEach((entry) => {
          if (!entry.sender_username) return;
          if (!latestBySender.has(entry.sender_username)) {
            latestBySender.set(entry.sender_username, entry);
          }
        });
        setDashboardAlerts((current) => ({ ...current, unreadMessages: latestBySender.size }));
      }

      if (!postError) {
        setDashboardAlerts((current) => ({ ...current, currentPosts: (postData || []).length }));
      }
    };

    loadAlerts();
    const messageSub = supabase.channel(`dashboard-messages-${userName}`).on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, loadAlerts).subscribe();
    const postSub = supabase.channel(`dashboard-posts-${userName}`).on('postgres_changes', { event: '*', schema: 'public', table: 'Kin' }, loadAlerts).subscribe();

    return () => {
      supabase.removeChannel(messageSub);
      supabase.removeChannel(postSub);
    };
  }, [userName, userRole]);

  const handleLogout = () => {
    clearStoredSession();
    setAuth(false);
    navigate('/login');
  };

  const navItemStyle = (tab) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: '0.24s ease',
    border: activeTab === tab ? '1px solid rgba(255,255,255,0.28)' : '1px solid transparent',
    width: '100%',
    textAlign: 'left',
    marginBottom: '10px',
    background: activeTab === tab ? 'linear-gradient(135deg, rgba(15,76,129,0.16) 0%, rgba(87,197,182,0.2) 100%)' : 'rgba(255,255,255,0.42)',
    color: activeTab === tab ? '#0F3F63' : '#52657E',
    fontWeight: activeTab === tab ? '700' : '600',
    outline: 'none',
    boxShadow: activeTab === tab ? '0 14px 28px rgba(15,76,129,0.12)' : 'inset 0 1px 0 rgba(255,255,255,0.55)'
  });

  return (
    <div style={{ display: 'flex', flexDirection: isCompactLayout ? 'column' : 'row', height: isCompactLayout ? 'auto' : '100vh', minHeight: '100vh', background: appTheme.background, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflowX: 'hidden', overflowY: isCompactLayout ? 'auto' : 'hidden', padding: isCompactLayout ? '12px' : '18px', gap: isCompactLayout ? '14px' : '20px', boxSizing: 'border-box', alignItems: 'stretch' }}>
      <aside style={{ width: isCompactLayout ? '100%' : '312px', background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(242,248,252,0.94) 100%)', border: '1px solid rgba(255,255,255,0.88)', display: 'flex', flexDirection: 'column', padding: isCompactLayout ? '16px' : '22px', flexShrink: 0, borderRadius: isCompactLayout ? '28px' : '36px', boxShadow: '0 30px 70px rgba(15,23,42,0.16)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '150px', height: '150px', borderRadius: '999px', background: 'radial-gradient(circle, rgba(87,197,182,0.24) 0%, rgba(87,197,182,0) 70%)' }} />

        <div style={{ marginBottom: '18px', padding: isCompactLayout ? '18px 18px 22px' : '24px 22px', minHeight: isCompactLayout ? '232px' : 'auto', borderRadius: '28px', background: 'linear-gradient(160deg, rgba(11,59,102,0.98) 0%, rgba(21,93,135,0.96) 52%, rgba(87,197,182,0.9) 100%)', color: 'white', boxShadow: '0 22px 40px rgba(15,76,129,0.18)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(255,255,255,0.14), transparent 24%)' }} />
          <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: isCompactLayout ? '20px' : '18px' }}>
            <div style={{ width: isCompactLayout ? '58px' : '72px', height: isCompactLayout ? '58px' : '72px', borderRadius: isCompactLayout ? '20px' : '24px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(14px)' }}>
              <img src="/citu-logo.png" alt="CITU" style={{ width: isCompactLayout ? '36px' : '48px', height: isCompactLayout ? '36px' : '48px', objectFit: 'contain', cursor: 'pointer' }} onClick={() => setActiveTab('overview')} />
            </div>
            <div style={{ padding: isCompactLayout ? '7px 10px' : '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', fontSize: isCompactLayout ? '10px' : '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700' }}>
              Student space
            </div>
          </div>

          <div>
            <p style={{ margin: '0 0 8px', fontSize: isCompactLayout ? '11px' : '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.76)', fontWeight: '700' }}>Student space</p>
            <h2 style={{ margin: 0, fontSize: isCompactLayout ? '1.82rem' : '2rem', fontWeight: '800', lineHeight: isCompactLayout ? 1.08 : 1.02, maxWidth: isCompactLayout ? '240px' : 'none' }}>Hey, {greetingName || displayName || userName}!</h2>
            <p style={{ margin: '12px 0 0', fontSize: isCompactLayout ? '12px' : '14px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, maxWidth: isCompactLayout ? '240px' : 'none' }}>Borrow, help out, and keep up with requests and messages from one polished home base.</p>
          </div>
          </div>
        </div>

        <nav style={{ flex: 1, background: 'linear-gradient(180deg, rgba(247,251,255,0.96) 0%, rgba(241,248,250,0.96) 100%)', border: '1px solid rgba(226,232,240,0.9)', borderRadius: '30px', padding: '18px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.78)' }}>
          <p style={{ margin: '0 0 12px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Navigation</p>
          <button onClick={() => setActiveTab('overview')} style={navItemStyle('overview')}><LayoutDashboard size={20}/><span style={{ fontSize: '15px', letterSpacing: '0.01em' }}>Overview</span></button>
          <button onClick={() => setActiveTab('messages')} style={navItemStyle('messages')}>
            <MessageSquare size={20}/>
            <span style={{ fontSize: '15px', letterSpacing: '0.01em', flex: 1 }}>Messages</span>
            {dashboardAlerts.unreadMessages > 0 && (
              <span style={{ minWidth: '24px', height: '24px', padding: '0 8px', borderRadius: '999px', background: '#DC2626', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}>
                {dashboardAlerts.unreadMessages}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('settings')} style={navItemStyle('settings')}><Settings size={20}/><span style={{ fontSize: '15px', letterSpacing: '0.01em' }}>Settings</span></button>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(226,232,240,0.85)' }}>
          <button onClick={() => setShowLogoutConfirm(true)} style={{ ...navItemStyle('logout'), color: colors.danger, marginTop: 0, background: 'rgba(255,255,255,0.56)' }}>
            <LogOut size={20}/><span style={{ fontSize: '15px', letterSpacing: '0.01em' }}>Log out</span>
          </button>
          </div>
        </nav>

        <div onClick={() => setActiveTab('settings')} style={{ marginTop: '18px', background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.94) 100%)', padding: '18px', borderRadius: '28px', border: `1px solid ${colors.border}`, cursor: 'pointer', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 16px 32px rgba(15,76,129,0.08)' }}>
          <p style={{ margin: '0 0 12px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Account</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '20px', overflow: 'hidden', border: `2px solid ${colors.accent}`, background: 'white', boxShadow: '0 10px 22px rgba(87,197,182,0.18)' }}>
              {profilePic ? <img src={profilePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="profile" /> : <User size={20} style={{ margin: '12px', color: colors.primary }} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: colors.textMain }}>{displayName || userName}</p>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: colors.textMuted }}>{userRole}</p>
              <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '999px', background: 'rgba(87,197,182,0.12)', color: '#0F766E', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Profile settings
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: isCompactLayout ? '0' : '6px', minWidth: 0, minHeight: isCompactLayout ? '560px' : 0 }}>
        {activeTab === 'messages' ? (
          <AestheticChat
            colors={colors}
            userName={userName}
            initialRecipient={new URLSearchParams(location.search).get('user') || ''}
            requestContext={{
              requestId: new URLSearchParams(location.search).get('requestId') || '',
              requestNeed: new URLSearchParams(location.search).get('requestNeed') || '',
              requestOwner: new URLSearchParams(location.search).get('requestOwner') || '',
            }}
          />
        ) : (
          <div className="kin-scrollbar" style={{ flex: 1, overflow: 'auto', background: appTheme.card, borderRadius: '32px', border: '1px solid rgba(255,255,255,0.78)', boxShadow: appTheme.shadow, minHeight: 0 }}>
            <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '22px' }}>
              {activeTab === 'overview' && userRole === 'ADMIN' && <AdminPanel />}
              {activeTab === 'overview' && userRole !== 'ADMIN' && <StudentPanel alerts={dashboardAlerts} />}
              {activeTab === 'settings' && <ProfileSettings />}
            </div>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Leaving already?"
        message="You'll be signed out of your account for now."
        confirmLabel="Log out"
        cancelLabel="Stay here"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        tone="danger"
        icon={AlertCircle}
      />
    </div>
  );
};

export default Dashboard;
