import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const colors = { maroon: '#8B4444', gold: '#C5A059', bg: '#F4F0F0' };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");
    console.log("Registering:", formData.username);
    navigate('/login');
  };

  const inputStyle = { width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #DCD0D0', background: '#FFF', color: '#2D2D2D', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ background: colors.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '90%', maxWidth: '420px', border: '1px solid #E2DADA', boxShadow: '0 15px 30px rgba(0,0,0,0.04)', position: 'relative', zIndex: 10 }}>
        <img src={process.env.PUBLIC_URL + '/citu-logo.png'} alt="CIT-U" style={{ width: '60px', display: 'block', margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#2D2D2D', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800' }}>Join KIN</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onSubmit={handleRegister}>
          <input type="text" placeholder="Username" style={inputStyle} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email (@cit.edu)" style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirm Password" style={inputStyle} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          <button type="submit" style={{ background: colors.maroon, color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', pointerEvents: 'auto' }}>
            REGISTER
          </button>
        </form>
        
        <p onClick={() => navigate('/login')} style={{ color: '#999', marginTop: '1.5rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem' }}>
          Already a member? <span style={{color: colors.maroon, fontWeight: '700'}}>Log in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;