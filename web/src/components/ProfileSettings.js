import React, { useState } from 'react';
import { Camera, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { persistProfile } from '../utils/profileHelpers';

const ProfileSettings = () => {
  const initialName = localStorage.getItem("userName") || "";
  const [savedUsername, setSavedUsername] = useState(initialName);
  const [username, setUsername] = useState(initialName);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSaving, setIsSaving] = useState(false);

  const colors = {
    primary: '#1A5F7A',
    accent: '#57C5B6',
    danger: '#FF3B30',
    groupBg: '#F2F2F7',
    textSecondary: '#8E8E93'
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsSaving(true);

    try {
      await axios.put('http://localhost:8080/api/auth/user/update', {
        email: localStorage.getItem("userEmail"),
        username,
        currentPassword,
        newPassword,
        profilePic
      });

      if (savedUsername !== username) {
        await Promise.all([
          supabase.from('Kin').update({ username }).eq('username', savedUsername),
          supabase.from('messages').update({ sender_username: username }).eq('sender_username', savedUsername),
          supabase.from('messages').update({ receiver_username: username }).eq('receiver_username', savedUsername),
        ]);
      }

      persistProfile({
        userName: username,
        userEmail: localStorage.getItem("userEmail") || '',
        userRole: localStorage.getItem("userRole") || 'Student',
        profilePic: profilePic || '',
      });

      setSavedUsername(username);
      setMessage({ text: "Settings saved successfully", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      const errorText = error.response?.data?.message || "Verify your current password.";
      setMessage({ text: errorText, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const Group = ({ title, children }) => (
    <div style={{ marginBottom: '26px' }}>
      <p style={{ fontSize: '12px', color: colors.textSecondary, marginLeft: '16px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: '700' }}>{title}</p>
      <div style={{ background: 'linear-gradient(180deg, #F8FAFF 0%, #F2F5FB 100%)', borderRadius: '24px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(226,232,240,0.72)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}>
        {children}
      </div>
    </div>
  );

  const inputStyle = {
    width: '100%',
    padding: '14px 0',
    border: 'none',
    background: 'transparent',
    fontSize: '16px',
    color: '#000',
    outline: 'none',
    borderBottom: '0.5px solid rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', padding: '38px', borderRadius: '36px', background: 'linear-gradient(135deg, #0B3B66 0%, #155D87 45%, #1A5F7A 70%, #57C5B6 100%)', color: 'white', boxShadow: '0 32px 68px rgba(15,76,129,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(255,255,255,0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(255,255,255,0.12), transparent 24%)' }} />
        <div style={{ position: 'relative' }}>
        <div style={{ width: '112px', height: '112px', borderRadius: '38px', margin: '0 auto 16px', overflow: 'hidden', background: 'rgba(255,255,255,0.18)', position: 'relative', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(14px)', boxShadow: '0 18px 34px rgba(0,0,0,0.12)' }}>
          {profilePic ? <img src={profilePic} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={40} color="white" style={{ marginTop: '30px' }} />}
          <label style={{ position: 'absolute', bottom: 0, right: 0, left: 0, background: 'rgba(0,0,0,0.4)', padding: '4px', cursor: 'pointer', textAlign: 'center' }}>
            <Camera size={14} color="white" />
            <input type="file" hidden accept="image/*" onChange={(e) => {
              if (!e.target.files?.[0]) return;
              const reader = new FileReader();
              reader.onload = () => setProfilePic(reader.result);
              reader.readAsDataURL(e.target.files[0]);
            }} />
          </label>
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Account Settings</h2>
        <p style={{ margin: '10px 0 0', opacity: 0.88, maxWidth: '520px', marginInline: 'auto', lineHeight: 1.7 }}>Update your identity once and let it appear across your posts and chats.</p>
        </div>
      </header>

      {message.text && (
        <div style={{ padding: '12px', borderRadius: '14px', background: message.type === 'success' ? '#34C759' : colors.danger, color: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdate} style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,251,255,0.88) 100%)', borderRadius: '34px', padding: '30px', border: '1px solid rgba(226,232,240,0.85)', boxShadow: '0 24px 48px rgba(15,23,42,0.06)' }}>
        <Group title="Public Profile">
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: colors.primary }}>DISPLAY NAME</label>
            <input style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
        </Group>

        <Group title="Security & Passwords">
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: colors.primary }}>CURRENT PASSWORD</label>
            <input type="password" placeholder="Required to save" style={inputStyle} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: colors.primary }}>NEW PASSWORD</label>
            <input type="password" placeholder="Leave blank to keep current" style={inputStyle} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </Group>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', borderRadius: '22px', background: 'linear-gradient(180deg, #F8FAFC 0%, #F2F7FB 100%)', marginTop: '8px', marginBottom: '18px', border: '1px solid rgba(226,232,240,0.8)' }}>
          <ShieldCheck size={20} color={colors.primary} />
          <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>Saving your profile updates your account and syncs your identity on your messages and community posts.</p>
        </div>

        <button type="submit" disabled={isSaving} style={{ width: '100%', padding: '17px', background: 'linear-gradient(135deg, #0B3B66 0%, #155D87 45%, #1A5F7A 70%, #57C5B6 100%)', color: 'white', border: 'none', borderRadius: '22px', fontSize: '17px', fontWeight: '700', cursor: isSaving ? 'default' : 'pointer', marginTop: '10px', boxShadow: '0 22px 40px rgba(15,76,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {isSaving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
