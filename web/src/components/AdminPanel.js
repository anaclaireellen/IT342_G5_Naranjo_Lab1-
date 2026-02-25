import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const colors = { maroon: '#8B4444', gold: '#C5A059', bg: '#F4F0F0' };

  <h2 style={{ color: '#2D2D2D', fontWeight: '800', margin: 0 }}>
    Admin Console: <span style={{color: colors.maroon}}>{localStorage.getItem("userName")}</span>
</h2>

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        setUsers(response.data);
      } catch (err) { console.error("Error fetching users"); }
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '95%', maxWidth: '900px', border: '1px solid #E2DADA', boxShadow: '0 15px 30px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={process.env.PUBLIC_URL + '/citu-logo.png'} alt="CIT-U" style={{ width: '50px' }} />
            <h2 style={{ color: '#2D2D2D', fontWeight: '800', margin: 0 }}>Admin Console</h2>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: colors.maroon, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            <LogOut size={18} /> LOGOUT
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.gold}` }}>
                <th style={{ textAlign: 'left', padding: '12px', color: colors.maroon }}>Username</th>
                <th style={{ textAlign: 'left', padding: '12px', color: colors.maroon }}>Email</th>
                <th style={{ textAlign: 'center', padding: '12px', color: colors.maroon }}>Role</th>
                <th style={{ textAlign: 'center', padding: '12px', color: colors.maroon }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px' }}>{user.username}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ background: user.role === 'ADMIN' ? colors.gold : '#EEE', color: user.role === 'ADMIN' ? 'white' : '#666', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button style={{ color: '#FF4D4D', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;