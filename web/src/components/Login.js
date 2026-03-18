import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { persistProfile } from '../utils/profileHelpers';

const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const colors = {
    primaryTeal: '#1A5F7A',
    mintAccent: '#57C5B6',
    softBg: '#F0F9F8',
    border: '#D1E5E2'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        persistProfile({
          userName: response.data.username,
          userRole: response.data.role,
          userEmail: response.data.email,
          profilePic: response.data.profilePic || '',
        });
        setAuth(true);
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed.');
      console.error('Login Detail:', error.response?.data);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 14px 14px 45px',
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    background: '#FFF',
    color: '#2D2D2D',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  };

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #F7FBFF 0%, #EEF7F9 45%, #E9F6F4 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        padding: '24px'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.92) 100%)',
          padding: '3rem',
          borderRadius: '32px',
          width: '90%',
          maxWidth: '400px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 24px 48px rgba(26, 95, 122, 0.1)',
          position: 'relative'
        }}
      >
        <img
          src={process.env.PUBLIC_URL + '/citu-logo.png'}
          alt="Kin Logo"
          style={{ width: '150px', height: 'auto', display: 'block', margin: '0 auto 1.5rem' }}
        />

        <h2
          style={{
            color: colors.primaryTeal,
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: '800',
            marginBottom: '1.5rem'
          }}
        >
          Welcome Back
        </h2>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleLogin}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: colors.mintAccent }} />
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
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: colors.mintAccent }} />
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
              background: 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 58%, #57C5B6 100%)',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%',
              boxShadow: '0 10px 24px rgba(26, 95, 122, 0.2)',
              marginTop: '10px'
            }}
          >
            LOG IN
          </button>
        </form>

        <p
          onClick={() => navigate('/')}
          style={{
            color: '#6A8E8A',
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
