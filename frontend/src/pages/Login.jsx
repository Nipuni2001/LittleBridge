import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import api from '../services/api';
import { Eye, EyeOff, Heart, Shield, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --primary: #0F2854;
  --primary-dark: #0A1B3D;
  --primary-mid: #1C4D8D;
  --hover: #4988C4;
  --light: #BDE8F5;
  --border: #C8D8EC;
  --bg: #F0F6FF;
  --text: #1A2744;
}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);}
.lg-page{min-height:100vh;display:flex;}
.lg-left{
  flex:1;
  background:linear-gradient(155deg, var(--primary) 0%, var(--primary-mid) 55%, #2C6BAD 100%);
  display:flex;flex-direction:column;justify-content:center;
  padding:60px 56px;position:relative;overflow:hidden;
}
.lg-left::before{content:'';position:absolute;top:-80px;right:-80px;width:320px;height:320px;background:rgba(189,232,245,0.12);border-radius:50%;}
.lg-left::after{content:'';position:absolute;bottom:-60px;left:-40px;width:240px;height:240px;background:rgba(255,255,255,0.04);border-radius:50%;}
.lg-right{width:100%;max-width:500px;display:flex;flex-direction:column;justify-content:center;padding:56px 48px;background:#fff;overflow-y:auto;}
@media(max-width:768px){.lg-left{display:none;}.lg-right{max-width:100%;padding:36px 24px;}}
.tab-wrap{display:flex;background:var(--bg);border-radius:10px;padding:4px;margin-bottom:28px;}
.tab-btn{flex:1;padding:9px;border-radius:8px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;transition:all .2s;}
.tab-active{background:#fff;color:var(--primary);box-shadow:0 1px 4px rgba(0,0,0,0.08);}
.tab-idle{background:transparent;color:#8A9AB5;}
.form-field{margin-bottom:18px;}
.form-label{display:block;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--text);margin-bottom:7px;}
.form-input-wrap{position:relative;}
.form-input{width:100%;padding:12px 14px;padding-left:42px;border:1.5px solid var(--border);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);outline:none;transition:border-color .2s;background:#fff;}
.form-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(15,40,84,0.08);}
.form-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#8A9AB5;pointer-events:none;}
.show-pw{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#8A9AB5;display:flex;}
.btn-primary{width:100%;padding:13px;background:var(--primary);color:#fff;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-primary:hover{background:var(--hover);}
.btn-primary:disabled{opacity:.55;cursor:not-allowed;}
.btn-ghost{width:100%;padding:12px;background:transparent;color:var(--primary);border:1.5px solid var(--border);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-ghost:hover{background:var(--light);border-color:var(--primary);}
.err-box{background:#FEF2F2;border:1px solid #FECACA;border-radius:9px;padding:11px 14px;display:flex;gap:8px;align-items:center;margin-bottom:16px;}
@keyframes spin{to{transform:rotate(360deg)}}
`;

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      style={{ animation:'spin .8s linear infinite', flexShrink:0 }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login, guestLogin } = useAuth();

  const [tab, setTab]       = useState('user');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // User login
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // Staff login
  const [staffUser, setStaffUser] = useState('');
  const [staffPass, setStaffPass] = useState('');

  const handleUserLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      const data = await login(email, password);
      const t = data.user?.userType;
      if      (t === 'admin' || t === 'super_admin') navigate('/admin/dashboard',     { replace:true });
      else if (t === 'childcare_services')            navigate('/childcare/dashboard', { replace:true });
      else                                            navigate('/dashboard',           { replace:true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    }
    setLoading(false);
  };

  
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    if (!staffUser || !staffPass) { setError('Please enter username and password.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/admin/login', {
        username: staffUser.trim(),
        password: staffPass,
      });

      if (!data.token) throw new Error('No token received from server');

      // ← THE FIX: use authService.setSession so keys match what getCurrentUser reads
      authService.setSession(data.token, data.admin || data.user);

      const userType = (data.admin?.role || data.user?.role || data.user?.userType || '');
      const dest     = userType === 'childcare_services' ? '/childcare/dashboard' : '/admin/dashboard';

      // Use window.location so React re-reads from localStorage on mount
      window.location.replace(dest);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials.');
    }
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await guestLogin();
      navigate('/sponsorship', { replace:true });
    } catch {
      setError('Guest login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{S}</style>
      <div className="lg-page">

        {/* ── LEFT PANEL ── */}
        <div className="lg-left">
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:48 }}>
              <div style={{ width:42, height:42, background:'rgba(255,255,255,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Heart size={20} color="white" fill="white"/>
              </div>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'#fff' }}>
                Little Bridge
              </span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,3vw,40px)', fontWeight:700, color:'#fff', lineHeight:1.2, marginBottom:18 }}>
              Welcome Back
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:'rgba(255,255,255,0.72)', lineHeight:1.7, marginBottom:40 }}>
              Continue your journey connecting children with loving families across Sri Lanka.
            </p>
            {[
              { icon:'🏠', text:'Track adoption applications in real-time' },
              { icon:'💙', text:'Manage sponsorships and donations' },
              { icon:'🛡️', text:'Secure and verified platform' },
            ].map(item => (
              <div key={item.text} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.75)' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lg-right">
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'var(--primary)', marginBottom:6 }}>
              Sign In
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color:'var(--primary)', fontWeight:600, textDecoration:'none' }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Tabs */}
          <div className="tab-wrap">
            <button className={`tab-btn ${tab==='user'?'tab-active':'tab-idle'}`}
              onClick={() => { setTab('user'); setError(''); }}>
              <User size={13} style={{ display:'inline', marginRight:5, verticalAlign:'middle' }}/>
              User Login
            </button>
            <button className={`tab-btn ${tab==='staff'?'tab-active':'tab-idle'}`}
              onClick={() => { setTab('staff'); setError(''); }}>
              <Shield size={13} style={{ display:'inline', marginRight:5, verticalAlign:'middle' }}/>
              Staff Login
            </button>
          </div>

          {error && (
            <div className="err-box">
              <AlertCircle size={15} color="#DC2626"/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#DC2626' }}>{error}</span>
            </div>
          )}

          {/* ── USER LOGIN ── */}
          {tab === 'user' && (
            <form onSubmit={handleUserLogin} noValidate>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <User size={15} className="form-icon"/>
                  <input type="email" className="form-input" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <div className="form-input-wrap">
                  <Lock size={15} className="form-icon"/>
                  <input type={showPw?'text':'password'} className="form-input"
                    placeholder="Your password" style={{ paddingRight:42 }}
                    value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"/>
                  <button type="button" className="show-pw" onClick={() => setShowPw(p => !p)}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <><Spinner/>Signing in…</> : <>Sign In <ArrowRight size={15}/></>}
              </button>
              <button type="button" className="btn-ghost" onClick={handleGuestLogin} disabled={loading}>
                Continue as Guest (Browse &amp; Donate)
              </button>
            </form>
          )}

          {/* ── STAFF LOGIN ── */}
          {tab === 'staff' && (
            <form onSubmit={handleStaffLogin} noValidate>
              {/* Credentials info card — no credentials in placeholders */}
              <div style={{ background:'#EFF6FF', border:'1px solid var(--light)', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:'var(--primary)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                  <Shield size={13}/>Staff Accounts — password: Admin@2026
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'var(--primary-mid)' }}>
                  <span style={{ fontWeight:600 }}>superadmin</span><span>Super Admin</span>
                  <span style={{ fontWeight:600 }}>admin</span><span>Administrator</span>
                  <span style={{ fontWeight:600 }}>childcare</span><span>Childcare Services</span>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Username</label>
                <div className="form-input-wrap">
                  <User size={15} className="form-icon"/>
                  <input type="text" className="form-input" placeholder="Enter username"
                    value={staffUser} onChange={e => setStaffUser(e.target.value)} autoComplete="username"/>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Password</label>
                <div className="form-input-wrap">
                  <Lock size={15} className="form-icon"/>
                  <input type={showPw?'text':'password'} className="form-input"
                    placeholder="Enter password" style={{ paddingRight:42 }}
                    value={staffPass} onChange={e => setStaffPass(e.target.value)} autoComplete="current-password"/>
                  <button type="button" className="show-pw" onClick={() => setShowPw(p => !p)}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <><Spinner/>Signing in…</> : <><Shield size={15}/>Staff Sign In</>}
              </button>
            </form>
          )}

          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#B0BAC8', textAlign:'center', marginTop:24 }}>
            By signing in you agree to our{' '}
            <Link to="/terms"   style={{ color:'var(--primary)', textDecoration:'none' }}>Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" style={{ color:'var(--primary)', textDecoration:'none' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  );
}
