import React from 'react';
import { ShieldCheck, Users, BellRing, ArrowRight } from 'lucide-react';

const AdminPanel = () => {
  const adminName = localStorage.getItem('userName') || 'Admin';

  const cards = [
    {
      title: 'Campus visibility',
      copy: 'Use the dashboard to monitor how polished and responsive the shared borrowing space feels.',
    },
    {
      title: 'Member trust',
      copy: 'Profile-first identity helps requests and messages feel more accountable and easier to verify.',
    },
    {
      title: 'Operational note',
      copy: 'This admin surface is styled and ready, but it still needs dedicated backend endpoints for live moderation data.',
    },
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #F6FAFF 0%, #EEF7F9 55%, #F8FAFC 100%)', minHeight: '100vh', padding: '8px 0 24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 58%, #57C5B6 100%)', color: 'white', borderRadius: '34px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 30px 60px rgba(15, 76, 129, 0.18)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8 }}>Admin overview</p>
          <h1 style={{ margin: 0, fontSize: '2.4rem', fontWeight: '800' }}>Hello, {adminName}</h1>
          <p style={{ margin: '12px 0 0', lineHeight: 1.7, maxWidth: '640px', opacity: 0.9 }}>
            The admin surface now matches the dashboard theme and is ready for moderation and analytics hooks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '18px' }}>
          <div style={{ background: 'rgba(255,255,255,0.82)', borderRadius: '28px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 18px 42px rgba(15,23,42,0.06)' }}>
            <ShieldCheck size={24} color="#1A5F7A" />
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>1</div>
            <p style={{ margin: '6px 0 0', color: '#64748B' }}>Signed-in admin session</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.82)', borderRadius: '28px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 18px 42px rgba(15,23,42,0.06)' }}>
            <Users size={24} color="#1A5F7A" />
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>Live</div>
            <p style={{ margin: '6px 0 0', color: '#64748B' }}>Shared user experience theme</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.82)', borderRadius: '28px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 18px 42px rgba(15,23,42,0.06)' }}>
            <BellRing size={24} color="#1A5F7A" />
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>Ready</div>
            <p style={{ margin: '6px 0 0', color: '#64748B' }}>For moderation endpoints</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {cards.map((card) => (
            <div key={card.title} style={{ background: 'rgba(255,255,255,0.82)', borderRadius: '30px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 18px 42px rgba(15,23,42,0.06)' }}>
              <h3 style={{ margin: '0 0 10px', color: '#0F172A' }}>{card.title}</h3>
              <p style={{ margin: 0, color: '#64748B', lineHeight: 1.7 }}>{card.copy}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '18px', background: 'rgba(255,255,255,0.82)', borderRadius: '30px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 18px 42px rgba(15,23,42,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '12px', color: '#94A3B8' }}>Next step</p>
              <h3 style={{ margin: 0, color: '#0F172A' }}>If you want, I can wire real admin data next.</h3>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#1A5F7A' }}>
              Add moderation tools <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
