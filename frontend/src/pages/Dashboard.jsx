import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown  from '../components/ProfileDropdown';
import OrphanageDashboard from './orphanage/OrphanageDashboard';
import {
  Heart, Home, FileText, Users, MapPin, CheckCircle,
  ArrowRight, Plus, TrendingUp, Award, Building2,
} from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--p:#0F2854;--pd:#7A2444;--gold:#C8963E;--border:#E8E4DF;--bg:#FAFAF8;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);}
.db-nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;}
.db-gold{height:3px;background:linear-gradient(90deg,var(--gold),#E8B96B,var(--gold));}
.stat-card{background:#fff;border-radius:16px;border:1.5px solid var(--border);padding:22px;transition:transform .2s,box-shadow .2s;}
.stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(155,58,90,0.09);}
.cta-card{border-radius:20px;padding:30px;color:#fff;cursor:pointer;transition:transform .2s,box-shadow .2s;}
.cta-card:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(0,0,0,0.15);}
.app-card{background:#fff;border-radius:16px;border:1.5px solid var(--border);padding:22px;cursor:pointer;transition:transform .2s,box-shadow .2s;}
.app-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(155,58,90,0.09);}
.tab-btn{flex:1;padding:10px 14px;border-radius:9px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;transition:all .2s;}
.tab-active{background:var(--p);color:#fff;}
.tab-idle{background:transparent;color:#8A8799;}
.tab-idle:hover{background:#F5F2EC;}
.db-btn{background:var(--p);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s;}
.db-btn:hover{background:var(--pd);}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .35s ease forwards;}
`;

// ── Shared nav bar ──────────────────────────────────────────
function Nav({ title, subtitle }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="db-nav">
      <div className="db-gold"/>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:68,
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{ width:38, height:38,
            background:'linear-gradient(135deg,#0F2854,#7A2444)',
            borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Heart size={17} color="white" fill="white"/>
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
              fontWeight:700, color:'#0F2854' }}>Little Bridge</div>
            {subtitle && (
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10,
                color:'#8A8799', fontWeight:700, letterSpacing:.6, textTransform:'uppercase' }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <NotificationBell/>
          <ProfileDropdown onLogout={() => { logout(); navigate('/'); }}/>
        </div>
      </div>
    </div>
  );
}

// ── Guest dashboard ─────────────────────────────────────────
function GuestDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <>
      <style>{S}</style>
      <Nav/>
      <div style={{ maxWidth:560, margin:'80px auto', padding:'0 24px', textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:20 }}>👋</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700,
          color:'#1C1C2E', marginBottom:12 }}>Welcome, Guest!</h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'#8A8799',
          lineHeight:1.7, marginBottom:32 }}>
          You can browse orphanages and donate anonymously.
          Create a free account to track your donations.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <button className="db-btn" style={{ justifyContent:'center', padding:14 }}
            onClick={() => navigate('/sponsorship')}>
            <Heart size={15} fill="white"/>Browse &amp; Donate Now
          </button>
          <button onClick={() => navigate('/signup?role=sponsor')}
            style={{ background:'transparent', color:'#0F2854', border:'1.5px solid #0F2854',
              borderRadius:10, padding:14, fontFamily:"'DM Sans',sans-serif", fontSize:14,
              fontWeight:600, cursor:'pointer' }}>
            Create Free Account
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ background:'none', border:'none', color:'#B8B4AF',
              fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:'pointer', marginTop:4 }}>
            Exit Guest Session
          </button>
        </div>
      </div>
    </>
  );
}

// ── Orphanage pending dashboard ─────────────────────────────
function OrphanagePendingDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <style>{S}</style>
      <Nav subtitle="Orphanage Account"/>
      <div style={{ maxWidth:560, margin:'80px auto', padding:'0 24px', textAlign:'center' }}>
        <Building2 size={56} color="#0F2854" style={{ margin:'0 auto 20px', display:'block' }}/>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700,
          color:'#1C1C2E', marginBottom:12 }}>
          Register Your Orphanage
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'#8A8799',
          lineHeight:1.7, marginBottom:28 }}>
          Your account is ready. Submit your orphanage details for review by the
          Childcare Services Department. Once approved, you'll appear on the platform.
        </p>
        <button className="db-btn" style={{ justifyContent:'center', padding:14 }}
          onClick={() => navigate('/orphanage/register')}>
          <Plus size={15}/>Register Orphanage
        </button>
      </div>
    </>
  );
}

// ── Main user dashboard (adopter / sponsor / both) ──────────
function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab]     = useState('overview');
  const [applications, setApps]       = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading]         = useState(true);

  const isAdopter = ['adopter', 'both'].includes(user?.userType);
  const isSponsor = ['sponsor', 'both'].includes(user?.userType);

  useEffect(() => {
    const load = async () => {
      try {
        const calls = [];
        if (isAdopter) calls.push(api.get('/adoptions/my-applications').then(r => setApps(r.data.data || [])));
        if (isSponsor) calls.push(api.get('/sponsorships/my-sponsorships').then(r => setSponsorships(r.data.data || [])));
        await Promise.all(calls);
      } catch { /* show empty state */ }
      setLoading(false);
    };
    load();
  }, []);

  const TABS = [
    { id:'overview',      label:'Overview' },
    ...(isAdopter ? [{ id:'applications', label:'My Applications' }] : []),
    ...(isSponsor  ? [{ id:'donations',   label:'My Donations' }]    : []),
  ];

  return (
    <>
      <style>{S}</style>
      <Nav/>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 24px' }}>

        {/* Welcome banner */}
        <div className="fu" style={{ background:'linear-gradient(135deg,#0F2854,#7A2444)',
          borderRadius:20, padding:'32px 36px', color:'#fff', marginBottom:28,
          position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200,
            background:'rgba(255,255,255,0.04)', borderRadius:'50%' }}/>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700,
            marginBottom:6, position:'relative' }}>
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14,
            color:'rgba(255,255,255,0.7)', position:'relative' }}>
            {user?.userType === 'both'    ? 'Adopter & Sponsor Account'
             : user?.userType === 'adopter' ? 'Parent / Adopter Account'
             : 'Sponsor / Donor Account'}
          </p>
        </div>

        {/* Stats row */}
        <div className="fu" style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',
          gap:16, marginBottom:26 }}>
          {[
            ...(isSponsor ? [
              { label:'Total Donations', value:sponsorships.length, icon:<Heart size={19} color="white" fill="white"/>, bg:'linear-gradient(135deg,#0F2854,#C47A96)' },
              { label:'Orphanages Helped', value:new Set(sponsorships.map(s=>s.orphanage_id)).size, icon:<Home size={19} color="white"/>, bg:'linear-gradient(135deg,#059669,#047857)' },
            ] : []),
            ...(isAdopter ? [
              { label:'Active Applications', value:applications.length, icon:<FileText size={19} color="white"/>, bg:'linear-gradient(135deg,#4F46E5,#7C3AED)' },
            ] : []),
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ width:42, height:42, background:s.bg, borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                {s.icon}
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24,
                fontWeight:700, color:'#1C1C2E', marginBottom:3 }}>{s.value}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif",
                fontSize:13, color:'#8A8799' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        {TABS.length > 1 && (
          <div className="fu" style={{ background:'#fff', border:'1.5px solid var(--border)',
            borderRadius:12, padding:4, display:'flex', gap:4, marginBottom:22 }}>
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn ${activeTab===t.id?'tab-active':'tab-idle'}`}
                onClick={() => setActiveTab(t.id)}>{t.label}</button>
            ))}
          </div>
        )}

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="fu" style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
            {isAdopter && (
              <div className="cta-card"
                style={{ background:'linear-gradient(135deg,#C8963E,#A07030)' }}
                onClick={() => navigate('/adoption/discover')}>
                <Home size={34} style={{ marginBottom:14 }}/>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:21,
                  fontWeight:700, marginBottom:7 }}>
                  {applications.length === 0 ? 'Start Adoption Journey' : 'My Adoption Applications'}
                </h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  color:'rgba(255,255,255,0.78)', lineHeight:1.65, marginBottom:18 }}>
                  {applications.length === 0
                    ? 'Find verified orphanages near you and begin your journey.'
                    : `${applications.length} active application${applications.length > 1 ? 's' : ''}.`}
                </p>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6,
                  background:'rgba(255,255,255,0.2)', borderRadius:8,
                  padding:'8px 14px', fontFamily:"'DM Sans',sans-serif",
                  fontSize:13, fontWeight:600 }}>
                  {applications.length === 0 ? 'Find Orphanages' : 'View Applications'}
                  <ArrowRight size={12}/>
                </div>
              </div>
            )}
            {isSponsor && (
              <div className="cta-card"
                style={{ background:'linear-gradient(135deg,#0F2854,#7A2444)' }}
                onClick={() => navigate('/sponsorship')}>
                <Heart size={34} style={{ marginBottom:14 }} fill="white"/>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:21,
                  fontWeight:700, marginBottom:7 }}>Make a Donation</h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  color:'rgba(255,255,255,0.78)', lineHeight:1.65, marginBottom:18 }}>
                  {sponsorships.length === 0
                    ? "Support verified orphanages across Sri Lanka."
                    : `${sponsorships.length} donation${sponsorships.length > 1 ? 's' : ''} made so far.`}
                </p>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6,
                  background:'rgba(255,255,255,0.18)', borderRadius:8,
                  padding:'8px 14px', fontFamily:"'DM Sans',sans-serif",
                  fontSize:13, fontWeight:600 }}>
                  Donate Now<ArrowRight size={12}/>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Applications tab */}
        {activeTab === 'applications' && (
          <div>
            {applications.length === 0 ? (
              <div className="stat-card" style={{ textAlign:'center', padding:'48px 24px' }}>
                <FileText size={38} color="#E0DDD8" style={{ margin:'0 auto 16px', display:'block' }}/>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
                  color:'#1C1C2E', marginBottom:8 }}>No applications yet</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  color:'#8A8799', marginBottom:20 }}>
                  Start your adoption journey today.
                </p>
                <button className="db-btn" onClick={() => navigate('/adoption/discover')}>
                  <Plus size={14}/>Find Orphanages
                </button>
              </div>
            ) : applications.map(app => (
              <div key={app.application_id} className="app-card"
                style={{ marginBottom:14 }}
                onClick={() => navigate(`/adoption/details/${app.application_id}`)}>
                <div style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                  <div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
                      fontWeight:700, color:'#1C1C2E', marginBottom:4 }}>
                      {app.orphanage_name}
                    </h3>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <MapPin size={12} color="#9A8F8A"/>
                      <span style={{ fontFamily:"'DM Sans',sans-serif",
                        fontSize:13, color:'#8A8799' }}>{app.orphanage_city}</span>
                    </div>
                  </div>
                  <span style={{ background:'rgba(155,58,90,0.08)', color:'#0F2854',
                    borderRadius:8, padding:'6px 14px', fontSize:12, fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif" }}>
                    {app.current_stage}
                  </span>
                </div>
                <div style={{ background:'#F0EDE8', borderRadius:5, height:8, overflow:'hidden', marginBottom:8 }}>
                  <div style={{ width:`${Math.round(((app.completed_stages||0)/(app.total_stages||7))*100)}%`,
                    height:'100%', background:'linear-gradient(90deg,#0F2854,#C47A96)', borderRadius:5 }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between',
                  fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#B8B4AF' }}>
                  <span>Stage {app.completed_stages||0}/{app.total_stages||7}</span>
                  <span>{Math.round(((app.completed_stages||0)/(app.total_stages||7))*100)}% complete</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Donations tab */}
        {activeTab === 'donations' && (
          <div>
            {sponsorships.length === 0 ? (
              <div className="stat-card" style={{ textAlign:'center', padding:'48px 24px' }}>
                <Heart size={38} color="#E0DDD8" style={{ margin:'0 auto 16px', display:'block' }}/>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
                  color:'#1C1C2E', marginBottom:8 }}>No donations yet</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  color:'#8A8799', marginBottom:20 }}>Make your first donation today.</p>
                <button className="db-btn" onClick={() => navigate('/sponsorship')}>
                  <Heart size={13} fill="white"/>Donate Now
                </button>
              </div>
            ) : sponsorships.map(s => (
              <div key={s.sponsorship_id}
                style={{ background:'#fff', borderRadius:12, border:'1.5px solid var(--border)',
                  padding:'16px 18px', display:'flex', alignItems:'center',
                  justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:13 }}>
                  <div style={{ width:40, height:40,
                    background:'linear-gradient(135deg,#0F2854,#C47A96)',
                    borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Heart size={17} color="white" fill="white"/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14,
                      fontWeight:600, color:'#1C1C2E', marginBottom:3 }}>
                      {s.orphanage_name}
                    </div>
                    <div style={{ display:'flex', gap:7, alignItems:'center' }}>
                      <span style={{ background:'rgba(155,58,90,0.08)', color:'#0F2854',
                        borderRadius:6, padding:'2px 9px', fontSize:11, fontWeight:700,
                        textTransform:'capitalize', fontFamily:"'DM Sans',sans-serif" }}>
                        {s.category}
                      </span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif",
                        fontSize:12, color:'#B8B4AF' }}>
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  {s.amount && (
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16,
                      fontWeight:700, color:'#1C1C2E', marginBottom:3 }}>
                      LKR {parseFloat(s.amount).toLocaleString()}
                    </div>
                  )}
                  <span style={{
                    background: s.status==='delivered'?'#F0FDF4':s.status==='confirmed'?'#FFFBEB':'#F5F2EC',
                    color:      s.status==='delivered'?'#15803D':s.status==='confirmed'?'#92400E':'#8A8799',
                    borderRadius:6, padding:'3px 10px', fontSize:11, fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif" }}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Main export — route each userType ───────────────────────
export default function Dashboard() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  // Admin types have dedicated routes — redirect if somehow landed here
  useEffect(() => {
    if (user?.userType === 'admin')              navigate('/admin/dashboard',    { replace: true });
    if (user?.userType === 'childcare_services') navigate('/childcare/dashboard', { replace: true });
  }, [user?.userType]);

  if (isGuest)                                     return <GuestDashboard/>;
  if (user?.userType === 'orphanage')              return <OrphanageDashboard/>;
  if (['adopter','sponsor','both'].includes(user?.userType)) return <UserDashboard/>;

  // Spinner while redirecting admin types
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#FAFAF8' }}>
      <div style={{ width:40, height:40, border:'3px solid #F0EDE8',
        borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
