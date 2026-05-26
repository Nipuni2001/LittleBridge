import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Heart, Home, Users, Shield, Building2, ArrowRight, ChevronLeft, CheckCircle } from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#FAFAF8;}
.su-wrap{min-height:100vh;display:flex;}
.su-left{flex:1;background:linear-gradient(155deg,#0F2854 0%,#7A2444 50%,#1C1C2E 100%);display:flex;flex-direction:column;justify-content:center;padding:60px 56px;position:relative;overflow:hidden;}
.su-right{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:40px 48px;overflow-y:auto;}
@media(max-width:768px){.su-left{display:none;}.su-right{flex:1;padding:24px;}}
.su-panel{width:100%;max-width:520px;padding-top:16px;}
.role-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;}
.role-card{padding:16px 14px;border:1.5px solid #E8E4DF;border-radius:12px;cursor:pointer;transition:all .2s;background:#fff;text-align:left;}
.role-card:hover{border-color:#0F2854;background:rgba(155,58,90,0.03);}
.role-card.selected{border-color:#0F2854;background:rgba(155,58,90,0.06);}
.input{width:100%;padding:12px 14px;border:1.5px solid #E8E4DF;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:#1C1C2E;outline:none;transition:border-color .2s;background:#fff;}
.input:focus{border-color:#0F2854;box-shadow:0 0 0 3px rgba(155,58,90,0.08);}
.input.err{border-color:#DC2626;}
.btn-primary{background:#0F2854;color:#fff;border:none;border-radius:10px;padding:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;width:100%;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-primary:hover:not(:disabled){background:#7A2444;transform:translateY(-1px);}
.btn-primary:disabled{opacity:.55;cursor:not-allowed;transform:none;}
.err-msg{color:#DC2626;font-family:'DM Sans',sans-serif;font-size:12px;margin-top:5px;}
.field{margin-bottom:16px;}
.label{display:block;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#1C1C2E;margin-bottom:6px;}
.admin-box{background:#FFF7ED;border:1.5px solid #FED7AA;border-radius:10px;padding:14px;margin-bottom:16px;}
.orphanage-box{background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:10px;padding:14px;margin-bottom:16px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fade{animation:fadeIn .3s ease forwards;}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const ROLES = [
  {
    id: 'adopter',
    label: 'Parent / Adopter',
    sub: 'I want to adopt a child',
    icon: <Home size={20} color="#0F2854"/>,
    color: '#0F2854',
  },
  {
    id: 'sponsor',
    label: 'Sponsor / Donor',
    sub: 'I want to donate to orphanages',
    icon: <Heart size={20} color="#C8963E" fill="#C8963E"/>,
    color: '#C8963E',
  },
  {
    id: 'both',
    label: 'Adopter & Sponsor',
    sub: 'I want to adopt and donate',
    icon: <Users size={20} color="#059669"/>,
    color: '#059669',
  },
  {
    id: 'orphanage',
    label: 'Orphanage',
    sub: 'Register my orphanage',
    icon: <Building2 size={20} color="#4F46E5"/>,
    color: '#4F46E5',
  },
  {
    id: 'admin',
    label: 'Administrator',
    sub: 'Staff / Dept. official (code required)',
    icon: <Shield size={20} color="#7C3AED"/>,
    color: '#7C3AED',
  },
];

const ADMIN_TYPES = ['admin', 'childcare_services'];

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      style={{ animation:'spin .8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.35)" strokeWidth="2.5"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Signup() {
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const { register } = useAuth();

  const [step, setStep] = useState(1);  // 1 = pick role, 2 = fill form
  const [role, setRole] = useState(params.get('role') || '');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '', state: '', adminCode: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [done, setDone]       = useState(false);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Must include uppercase, lowercase and a number';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (ADMIN_TYPES.includes(role) && !form.adminCode.trim()) {
      e.adminCode = 'Registration code is required for this account type';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      await register({
        email:      form.email,
        password:   form.password,
        firstName:  form.firstName,
        lastName:   form.lastName,
        phone:      form.phone,
        city:       form.city,
        state:      form.state,
        country:    'Sri Lanka',
        userType:   role,
        adminCode:  form.adminCode || undefined,
      });
      setDone(true);
      // Redirect after short delay to show success state
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  // ── Success screen ────────────────────────────────────────
  if (done) {
    return (
      <>
        <style>{S}</style>
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF8', padding:24 }}>
          <div style={{ textAlign:'center', maxWidth:440 }}>
            <CheckCircle size={64} color="#16A34A" style={{ margin:'0 auto 20px', display:'block' }}/>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#1C1C2E', marginBottom:10 }}>
              {role === 'orphanage' ? 'Account Created!' : 'Welcome to LittleBridge!'}
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'#504E5E', lineHeight:1.7 }}>
              {role === 'orphanage'
                ? 'Your account is ready. You can now register your orphanage for review by the Childcare Services Department.'
                : 'Your account is ready. Redirecting to your dashboard…'}
            </p>
          </div>
        </div>
      </>
    );
  }

  const selectedRole = ROLES.find(r => r.id === role);

  return (
    <>
      <style>{S}</style>
      <div className="su-wrap">

        {/* Left panel */}
        <div className="su-left">
          <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, background:'rgba(255,255,255,0.04)', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, background:'rgba(200,150,62,0.08)', borderRadius:'50%' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#fff', marginBottom:12 }}>
              Little Bridge
            </div>
            <div style={{ width:40, height:2, background:'#C8963E', marginBottom:28 }}/>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:'rgba(255,255,255,0.92)', lineHeight:1.5, marginBottom:24 }}>
              Join thousands making a difference in children's lives
            </h2>

            {/* Steps */}
            {[
              { n:'1', title:'Choose Your Role', sub:'Select how you want to help' },
              { n:'2', title:'Create Account',   sub:'Fill in your details' },
              { n:'3', title:'Start Your Journey', sub:'Adopt, donate, or register' },
            ].map((s, i) => (
              <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:18 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background: i < step ? '#C8963E' : 'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:'#fff' }}>{s.n}</span>
                </div>
                <div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.9)', marginBottom:2 }}>{s.title}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.5)' }}>{s.sub}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop:32, padding:'16px 18px', background:'rgba(255,255,255,0.07)', borderRadius:12 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>
                "LittleBridge made our adoption journey transparent and supported. The guidance was invaluable."
              </div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(200,150,62,0.9)', marginTop:8 }}>
                — Tharindu &amp; Nimesha, Colombo
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="su-right">
          <div className="su-panel">

            {/* Header */}
            <div style={{ marginBottom:28 }}>
              <button onClick={() => step === 2 ? setStep(1) : navigate('/login')}
                style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A8799', marginBottom:20 }}>
                <ChevronLeft size={15}/>
                {step === 2 ? 'Change role' : 'Back to Login'}
              </button>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#1C1C2E', marginBottom:6 }}>
                {step === 1 ? 'Create Your Account' : `Register as ${selectedRole?.label}`}
              </h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>
                {step === 1 ? 'Choose how you want to join LittleBridge' : 'Fill in your details to get started'}
              </p>
            </div>

            {/* STEP 1 — Role selection */}
            {step === 1 && (
              <div className="fade">
                <div className="role-grid">
                  {ROLES.map(r => (
                    <div key={r.id}
                      className={`role-card ${role === r.id ? 'selected' : ''}`}
                      style={{ borderColor: role === r.id ? r.color : '#E8E4DF', background: role === r.id ? `rgba(${r.color === '#0F2854' ? '155,58,90' : r.color === '#C8963E' ? '200,150,62' : r.color === '#059669' ? '5,150,105' : r.color === '#4F46E5' ? '79,70,229' : '124,58,237'},.05)` : '#fff' }}
                      onClick={() => setRole(r.id)}>
                      <div style={{ marginBottom:8 }}>{r.icon}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:'#1C1C2E', marginBottom:4 }}>{r.label}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799', lineHeight:1.5 }}>{r.sub}</div>
                    </div>
                  ))}
                </div>

                <button className="btn-primary" disabled={!role} onClick={() => role && setStep(2)}>
                  Continue as {selectedRole?.label || '…'} <ArrowRight size={16}/>
                </button>

                <div style={{ textAlign:'center', marginTop:20 }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A8799' }}>
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', cursor:'pointer', color:'#0F2854', fontWeight:600, fontSize:13 }}>Sign in</button>
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2 — Form */}
            {step === 2 && (
              <div className="fade">

                {/* Orphanage info banner */}
                {role === 'orphanage' && (
                  <div className="orphanage-box">
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#0369A1', fontWeight:600, marginBottom:4, display:'flex', alignItems:'center', gap:6 }}>
                      <Building2 size={14}/>Orphanage Account
                    </div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#0369A1', lineHeight:1.65 }}>
                      Create your account first, then register your orphanage from your dashboard. Your orphanage listing will be visible only after approval by the Childcare Services Department.
                    </div>
                  </div>
                )}

                {/* Admin code banner */}
                {ADMIN_TYPES.includes(role) && (
                  <div className="admin-box">
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#92400E', fontWeight:600, marginBottom:4 }}>
                      🔐 Admin Registration Code Required
                    </div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#92400E', lineHeight:1.65 }}>
                      This account type requires an authorisation code from LittleBridge. Contact <strong>lttlbrdg@gmail.com</strong> to obtain your code.
                    </div>
                  </div>
                )}

                {apiError && (
                  <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', marginBottom:16, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#DC2626' }}>
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                    <div>
                      <label className="label">First Name *</label>
                      <input className={`input ${errors.firstName ? 'err' : ''}`}
                        value={form.firstName} onChange={e => set('firstName', e.target.value)}
                        placeholder="Priya"/>
                      {errors.firstName && <div className="err-msg">{errors.firstName}</div>}
                    </div>
                    <div>
                      <label className="label">Last Name *</label>
                      <input className={`input ${errors.lastName ? 'err' : ''}`}
                        value={form.lastName} onChange={e => set('lastName', e.target.value)}
                        placeholder="Fernando"/>
                      {errors.lastName && <div className="err-msg">{errors.lastName}</div>}
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Email Address *</label>
                    <input type="email" className={`input ${errors.email ? 'err' : ''}`}
                      value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="you@example.com"/>
                    {errors.email && <div className="err-msg">{errors.email}</div>}
                  </div>

                  <div className="field">
                    <label className="label">Phone Number</label>
                    <input type="tel" className="input"
                      value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+94 XX XXX XXXX"/>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                    <div>
                      <label className="label">City</label>
                      <input className="input"
                        value={form.city} onChange={e => set('city', e.target.value)}
                        placeholder="Colombo"/>
                    </div>
                    <div>
                      <label className="label">Province</label>
                      <input className="input"
                        value={form.state} onChange={e => set('state', e.target.value)}
                        placeholder="Western Province"/>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password *</label>
                    <div style={{ position:'relative' }}>
                      <input type={showPw ? 'text' : 'password'}
                        className={`input ${errors.password ? 'err' : ''}`}
                        style={{ paddingRight:44 }}
                        value={form.password} onChange={e => set('password', e.target.value)}
                        placeholder="Min 8 chars, upper + lower + number"/>
                      <button type="button" onClick={() => setShowPw(p => !p)}
                        style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8A8799' }}>
                        {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {errors.password && <div className="err-msg">{errors.password}</div>}
                  </div>

                  <div className="field">
                    <label className="label">Confirm Password *</label>
                    <input type={showPw ? 'text' : 'password'}
                      className={`input ${errors.confirmPassword ? 'err' : ''}`}
                      value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                      placeholder="Re-enter your password"/>
                    {errors.confirmPassword && <div className="err-msg">{errors.confirmPassword}</div>}
                  </div>

                  {/* Admin code field */}
                  {ADMIN_TYPES.includes(role) && (
                    <div className="field">
                      <label className="label">Registration Code *</label>
                      <input className={`input ${errors.adminCode ? 'err' : ''}`}
                        value={form.adminCode} onChange={e => set('adminCode', e.target.value)}
                        placeholder="Enter the authorisation code"/>
                      {errors.adminCode && <div className="err-msg">{errors.adminCode}</div>}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop:8 }}>
                    {loading ? <><Spinner/>Creating account…</> : 'Create Account'}
                  </button>
                </form>

                <div style={{ textAlign:'center', marginTop:20 }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A8799' }}>
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', cursor:'pointer', color:'#0F2854', fontWeight:600, fontSize:13 }}>Sign in</button>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
