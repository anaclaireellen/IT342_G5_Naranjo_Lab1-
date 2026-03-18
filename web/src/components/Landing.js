import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, MessagesSquare } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, rgba(87,197,182,0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(15,76,129,0.18), transparent 30%), linear-gradient(180deg, #F8FBFF 0%, #EDF5FB 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '28px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img src={process.env.PUBLIC_URL + '/citu-logo.png'} alt="Kin Logo" style={{ width: '138px', height: 'auto' }} />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '40px', boxShadow: '0 30px 80px rgba(15,23,42,0.08)', backdropFilter: 'blur(24px)', overflow: 'hidden' }}>
          <div style={{ padding: '56px 48px', display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: '34px', alignItems: 'stretch' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '999px', background: 'rgba(15,76,129,0.08)', color: '#1A5F7A', fontWeight: '700', marginBottom: '20px' }}>
                <Sparkles size={16} /> Student support, thoughtfully designed
              </div>
              <h1 style={{ fontSize: '4.4rem', lineHeight: 0.98, letterSpacing: '-0.05em', margin: '0 0 18px', color: '#0F172A' }}>KIN helps students borrow, connect, and support one another.</h1>
              <p style={{ fontSize: '18px', lineHeight: 1.75, color: '#475569', maxWidth: '680px', margin: '0 0 28px' }}>
                Request essential items, explore current community posts, and communicate directly with fellow students through a clean and approachable campus platform.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '34px' }}>
                <button onClick={() => navigate('/login')} style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 58%, #57C5B6 100%)', color: 'white', border: 'none', padding: '16px 22px', borderRadius: '18px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 18px 36px rgba(15,76,129,0.18)' }}>
                  Log In <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/register')} style={{ background: 'rgba(255,255,255,0.86)', color: '#1A5F7A', border: '1px solid #D9E5F0', padding: '16px 22px', borderRadius: '18px', fontWeight: '800', cursor: 'pointer' }}>
                  Create Account
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '18px', borderRadius: '24px', background: 'rgba(248,250,252,0.86)', border: '1px solid #E2E8F0' }}>
                  <MessagesSquare size={20} color="#1A5F7A" />
                  <h3 style={{ margin: '14px 0 8px', color: '#0F172A' }}>Direct messages</h3>
                  <p style={{ margin: 0, color: '#64748B', lineHeight: 1.6 }}>Connect with fellow students quickly once someone is ready to assist.</p>
                </div>
                <div style={{ padding: '18px', borderRadius: '24px', background: 'rgba(248,250,252,0.86)', border: '1px solid #E2E8F0' }}>
                  <ShieldCheck size={20} color="#1A5F7A" />
                  <h3 style={{ margin: '14px 0 8px', color: '#0F172A' }}>Student identity</h3>
                  <p style={{ margin: 0, color: '#64748B', lineHeight: 1.6 }}>Your profile helps make every request and conversation more personal and trustworthy.</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(160deg, rgba(15,76,129,0.98) 0%, rgba(26,95,122,0.94) 58%, rgba(87,197,182,0.86) 100%)', color: 'white', borderRadius: '34px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 28px 56px rgba(15,76,129,0.22)' }}>
              <div>
                <p style={{ margin: 0, opacity: 0.76, textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '12px' }}>Why students use KIN</p>
                <h2 style={{ margin: '12px 0 0', fontSize: '2rem', lineHeight: 1.1 }}>A more organized way to ask for help and respond with care.</h2>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  'Borrow requests are easier to read and respond to.',
                  'Messages can begin directly from the community hub.',
                  'Your profile remains visible across posts, chats, and settings.'
                ].map((text) => (
                  <div key={text} style={{ padding: '16px 18px', borderRadius: '20px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', lineHeight: 1.6 }}>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
