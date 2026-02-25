import React from 'react';
import AdminPanel from './AdminPanel'; // We will create this next
import StudentPanel from './StudentPanel';

const Dashboard = () => {
  const userRole = localStorage.getItem("userRole"); // Get "ADMIN" or "STUDENT"

  return (
    <div style={{ padding: '20px' }}>
      {userRole === 'ADMIN' ? (
        <AdminPanel />
      ) : (
        <StudentPanel />
      )}
    </div>
  );
};

export default Dashboard;