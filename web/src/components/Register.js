import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const colors = {
    primaryTeal: '#1A5F7A',
    mintAccent: '#57C5B6',
    softBg: '#F0F9F8',
    border: '#D1E5E2'
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'STUDENT'
      });

      if (response.status === 200 || response.status === 201) {
        alert('Registration successful.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      alert(error.response?.data?.message || 'Connection failed. Is the server running?');
    }
  };

  const inputContainerStyle = { position: 'relative', width: '100%' };
  const inputStyle = {
    width: '100%',
    padding: '14px 14px 14px 45px',
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    background: '#FFF',
    color: '#2D2D2D',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: '0.95rem'
  };
  const iconStyle = { position: 'absolute', left: '15px', top: '14px', color: colors.mintAccent };

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
          padding: '2.5rem',
          borderRadius: '32px',
          width: '90%',
          maxWidth: '420px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 24px 48px rgba(26, 95, 122, 0.1)'
        }}
      >
        <h2 style={{ color: colors.primaryTeal, textAlign: 'center', fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>
          Join KIN
        </h2>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onSubmit={handleRegister}>
          <div style={inputContainerStyle}>
            <User size={18} style={iconStyle} />
            <input
              type="text"
              placeholder="Username"
              style={inputStyle}
              required
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div style={inputContainerStyle}>
            <Mail size={18} style={iconStyle} />
            <input
              type="email"
              placeholder="Email (@cit.edu)"
              style={inputStyle}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div style={inputContainerStyle}>
            <Lock size={18} style={iconStyle} />
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div style={inputContainerStyle}>
            <Lock size={18} style={iconStyle} />
            <input
              type="password"
              placeholder="Confirm Password"
              style={inputStyle}
              required
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '10px',
              boxShadow: '0 10px 24px rgba(26, 95, 122, 0.2)'
            }}
          >
            CREATE ACCOUNT
          </button>
        </form>

        <p onClick={() => navigate('/login')} style={{ color: '#6A8E8A', marginTop: '1.5rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.9rem' }}>
          Already a member? <span style={{ color: colors.primaryTeal, fontWeight: '700' }}>Log in</span>
        </p>

        <p
          onClick={() => navigate('/')}
          style={{
            color: '#999',
            marginTop: '1rem',
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <ArrowLeft size={12} /> Back to home
        </p>
      </div>
    </div>
  );
};

export default Register;
