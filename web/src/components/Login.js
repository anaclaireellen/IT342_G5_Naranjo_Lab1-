import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios'; // CRITICAL: Don't forget this import

const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colors = { maroon: '#8B4444', gold: '#C5A059', bg: '#F4F0F0' };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email: email,
      password: password
    });

    if (response.status === 200) {
    // If Java sends "username", you MUST use "username" here
    localStorage.setItem("userName", response.data.username); 
    localStorage.setItem("userRole", response.data.role);
    setAuth(true);
    navigate('/dashboard');
}
  } catch (error) {
    // If you see this alert, the backend rejected the password OR the URL is wrong
    alert(error.response?.data?.message || "Login failed. Check console for CORS or 401.");
    console.error("Login Detail:", error.response?.data);
  }
};

  const inputStyle = { 
    width: '100%', 
    padding: '14px 14px 14px 45px', 
    borderRadius: '12px', 
    border: '1px solid #DCD0D0', 
    background: '#FFF', 
    color: '#2D2D2D', 
    outline: 'none', 
    boxSizing: 'border-box' 
  };

  return (
    <div style={{ background: colors.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', width: '90%', maxWidth: '400px', border: '1px solid #E2DADA', boxShadow: '0 15px 30px rgba(0,0,0,0.04)', position: 'relative', zIndex: 10 }}>
        
        <img 
          src={process.env.PUBLIC_URL + '/citu-logo.png'} 
          alt="CIT-U" 
          style={{ width: '70px', display: 'block', margin: '0 auto 1.5rem' }} 
        />
        
        <h2 style={{ color: '#2D2D2D', textAlign: 'center', fontSize: '1.8rem', fontWeight: '800' }}>Welcome Back</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleLogin}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: colors.gold }} />
            <input 
              type="email" 
              placeholder="University Email" 
              style={inputStyle} 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: colors.gold }} />
            <input 
              type="password" 
              placeholder="Password" 
              style={inputStyle} 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              background: colors.maroon, 
              color: 'white', 
              border: 'none', 
              padding: '15px', 
              borderRadius: '12px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              width: '100%' 
            }}
          >
            LOG IN
          </button>
        </form>
        
        <p 
          onClick={() => navigate('/')} 
          style={{ 
            color: '#999', 
            marginTop: '2rem', 
            cursor: 'pointer', 
            textAlign: 'center', 
            fontSize: '0.9rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '5px' 
          }}
        >
          <ArrowLeft size={14} /> Back to home
        </p>
      </div>
    </div>
  );
};

export default Login;