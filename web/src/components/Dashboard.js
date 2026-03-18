import React, { useState, useEffect } from 'react';
import { MessageSquare, LayoutDashboard, LogOut, Settings, User, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentPanel from './StudentPanel';
import ProfileSettings from './ProfileSettings';
import AestheticChat from './AestheticChat';
import AdminPanel from './AdminPanel';
import { getStoredProfile, PROFILE_UPDATED_EVENT } from '../utils/profileHelpers';

const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionProfile, setSessionProfile] = useState(getStoredProfile());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { userName, userRole, profilePic } = sessionProfile;

  const colors = {
    bg: '#EEF4FA',
    sidebar: 'rgba(255,255,255,0.82)',
    primary: '#1A5F7A',
    accent: '#57C5B6',
    border: '#E2E8F0',
    textMain: '#1E293B',
    textMuted: '#64748B',
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
    const params = new URLSearchParams(location.search);
    const requestedTab = params.get('tab');

    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [location.search]);

  const handleLogout = () => {
    localStorage.clear();
    setAuth(false);
    navigate('/login');
  };

  const navItemStyle = (tab) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '18px',
    cursor: 'pointer',
    transition: '0.2s ease',
    border: '1px solid transparent',
    width: '100%',
    textAlign: 'left',
    marginBottom: '10px',
    background: activeTab === tab ? 'linear-gradient(135deg, rgba(15,76,129,0.16) 0%, rgba(87,197,182,0.16) 100%)' : 'transparent',
    color: activeTab === tab ? colors.primary : colors.textMuted,
    fontWeight: activeTab === tab ? '700' : '600',
    outline: 'none',
    boxShadow: activeTab === tab ? '0 12px 24px rgba(15,76,129,0.08)' : 'none'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'radial-gradient(circle at top left, rgba(87,197,182,0.16), transparent 26%), radial-gradient(circle at bottom right, rgba(15,76,129,0.14), transparent 32%), linear-gradient(180deg, #F8FBFF 0%, #EDF5FB 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflow: 'hidden', padding: '16px', gap: '16px' }}>
      <aside style={{ width: '300px', background: 'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(245,250,255,0.84) 100%)', border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', padding: '28px 20px', flexShrink: 0, backdropFilter: 'blur(26px)', borderRadius: '34px', boxShadow: '0 24px 60px rgba(15,23,42,0.06)' }}>
        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(226,232,240,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <img src="/citu-logo.png" alt="CITU" style={{ width: '122px', height: 'auto', cursor: 'pointer' }} onClick={() => setActiveTab('overview')} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8' }}>Workspace</p>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '24px' }}>KIN Dashboard</h2>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <button onClick={() => setActiveTab('overview')} style={navItemStyle('overview')}><LayoutDashboard size={20}/> Overview</button>
          <button onClick={() => setActiveTab('messages')} style={navItemStyle('messages')}><MessageSquare size={20}/> Messages</button>
          <button onClick={() => setActiveTab('settings')} style={navItemStyle('settings')}><Settings size={20}/> Settings</button>
          <button onClick={() => setShowLogoutConfirm(true)} style={{ ...navItemStyle('logout'), color: colors.danger, marginTop: '12px' }}>
            <LogOut size={20}/> Logout
          </button>
        </nav>

        <div onClick={() => setActiveTab('settings')} style={{ background: 'linear-gradient(180deg, rgba(248,251,255,0.95) 0%, rgba(238,244,255,0.92) 100%)', padding: '16px', borderRadius: '28px', border: `1px solid ${colors.border}`, cursor: 'pointer', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 14px 28px rgba(15,76,129,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '18px', overflow: 'hidden', border: `2px solid ${colors.accent}`, background: 'white', boxShadow: '0 10px 22px rgba(87,197,182,0.18)' }}>
              {profilePic ? <img src={profilePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="profile" /> : <User size={20} style={{ margin: '12px', color: colors.primary }} />}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: colors.textMain }}>{userName}</p>
              <p style={{ margin: 0, fontSize: '12px', color: colors.textMuted }}>{userRole}</p>
            </div>
          </div>
          <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.78)', borderRadius: '18px', border: `1px solid ${colors.border}` }}>
            <p style={{ margin: 0, fontSize: '12px', color: colors.textMuted }}>Manage your photo, display name, and password.</p>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '6px' }}>
        {activeTab === 'messages' ? (
          <AestheticChat
            colors={colors}
            userName={userName}
            initialRecipient={new URLSearchParams(location.search).get('user') || ''}
          />
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', background: 'linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.24) 100%)', borderRadius: '34px', border: '1px solid rgba(226,232,240,0.8)', backdropFilter: 'blur(18px)', boxShadow: '0 24px 50px rgba(15,23,42,0.04)' }}>
            <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '22px' }}>
              {activeTab === 'overview' && userRole === 'ADMIN' && <AdminPanel />}
              {activeTab === 'overview' && userRole !== 'ADMIN' && <StudentPanel />}
              {activeTab === 'settings' && <ProfileSettings />}
            </div>
          </div>
        )}
      </main>

      {showLogoutConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.24)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.94) 100%)', padding: '32px', borderRadius: '30px', textAlign: 'center', width: '340px', boxShadow: '0 24px 48px rgba(15,23,42,0.14)', border: '1px solid rgba(255,255,255,0.85)' }}>
            <AlertCircle size={48} color={colors.danger} style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', color: colors.textMain }}>Sign Out?</h3>
            <p style={{ fontSize: '14px', color: colors.textMuted, marginBottom: '25px', lineHeight: 1.6 }}>Are you sure you want to end your current session?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleLogout} style={{ flex: 1, background: colors.danger, color: 'white', border: 'none', padding: '12px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}>Logout</button>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, background: '#F8FAFC', color: colors.textMain, border: '1px solid #E2E8F0', padding: '12px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
