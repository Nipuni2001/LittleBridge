import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';
import {
  Shield, Building2, FileText, Users, Check, X,
  Eye, CheckCircle, Clock, ExternalLink, AlertCircle, ChevronDown
} from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--p:#0F2854;--pd:#7A2444;--gold:#C8963E;--border:#E8E4DF;--bg:#FAFAF8;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);}
.ad-page{min-height:100vh;background:var(--bg);}
.ad-nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;}
.ad-gold{height:3px;background:linear-gradient(90deg,var(--gold),#E8B96B,var(--gold));}
.stat-card{background:#fff;border-radius:14px;border:1.5px solid var(--border);padding:20px;}
.tabs{display:flex;gap:4px;background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:4px;margin-bottom:22px;flex-wrap:wrap;}
.tab-btn{padding:9px 16px;border-radius:8px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s;position:relative;white-space:nowrap;}
.tab-active{background:#1C1C2E;color:#fff;}
.tab-idle{background:transparent;color:#8A8799;}
.tab-idle:hover{background:#F5F2EC;}
.item-card{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:12px;}
.item-card.orph{border-left:4px solid #F59E0B;}
.item-card.doc{border-left:4px solid #6366F1;}
.ab{background:var(--p);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s;}
.ab:hover{background:var(--pd);}
.ab.green{background:#059669;}.ab.green:hover{background:#047857;}
.ab.red{background:#DC2626;}.ab.red:hover{background:#B91C1C;}
.ab.gray{background:#fff;color:#504E5E;border:1.5px solid var(--border);}.ab.gray:hover{border-color:var(--p);color:var(--p);}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .3s ease forwards;}
`;

function buildFileUrl(p) {
  if (!p) return null;
  const c = p.replace(/\\/g, '/');
  if (c.startsWith('http')) return c;
  return `http://localhost:5000/${c.startsWith('/') ? c.slice(1) : c}`;
}

function Spin() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .8s linear infinite', flexShrink:0 }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [actLoad, setActLoad] = useState(null);

  // Data state
  const [stats, setStats] = useState({ users: 0, apps: 0, donations: 0 });
  const [pendingOrph, setPendingOrph] = useState([]);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [applications, setApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [docNotes, setDocNotes] = useState({});

  // Loading flags
  const [loadingOrph, setLO] = useState(true);
  const [loadingDocs, setLD] = useState(true);
  const [loadingApps, setLA] = useState(false);
  const [loadingUsers, setLU] = useState(false);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchStats();
    fetchPendingOrph();
    fetchPendingDocs();
  }, []);

  useEffect(() => {
    if (tab === 'applications' && applications.length === 0) fetchApps();
    if (tab === 'users' && users.length === 0) fetchUsers();
  }, [tab]);

  const fetchStats = async () => {
    try {
      const [u, a, d] = await Promise.all([
        api.get('/admin/stats/users'),
        api.get('/admin/stats/applications'),
        api.get('/admin/stats/donations'),
      ]);
      setStats({ users: u.data.count, apps: a.data.count, donations: d.data.count });
    } catch {}
  };

  const fetchPendingOrph = async () => {
    setLO(true);
    try {
      const { data } = await api.get('/orphanages/pending');
      setPendingOrph(data.data || []);
    } catch { setPendingOrph([]); }
    setLO(false);
  };

  const fetchPendingDocs = async () => {
    setLD(true);
    try {
      const { data } = await api.get('/orphanages/documents/pending');
      setPendingDocs(data.data || []);
    } catch { setPendingDocs([]); }
    setLD(false);
  };

  const fetchApps = async () => {
    setLA(true);
    try {
      const { data } = await api.get('/admin/applications');
      setApps(data.data || []);
    } catch { setApps([]); }
    setLA(false);
  };

  const fetchUsers = async () => {
    setLU(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data || []);
    } catch { setUsers([]); }
    setLU(false);
  };

  // ── Orphanage approve / reject ────────────────────────────
  const approveOrph = async (id, name) => {
    setActLoad(`orph-${id}`);
    try {
      await api.put(`/orphanages/${id}/approve`);
      setPendingOrph(p => p.filter(o => o.orphanage_id !== id));
      setStats(s => ({ ...s }));
      showToast(`${name} approved ✓`);
    } catch (e) { showToast(e.response?.data?.message || 'Failed', 'error'); }
    setActLoad(null);
  };

  const rejectOrph = async (id, name) => {
    const reason = window.prompt('Rejection reason (sent to orphanage by email):');
    if (reason === null) return;
    setActLoad(`orph-${id}`);
    try {
      await api.put(`/orphanages/${id}/reject`, { reason });
      setPendingOrph(p => p.filter(o => o.orphanage_id !== id));
      showToast('Rejection sent');
    } catch { showToast('Failed', 'error'); }
    setActLoad(null);
  };

  // ── Document review ───────────────────────────────────────
  const reviewDoc = async (uploadId, action) => {
    setActLoad(`doc-${uploadId}`);
    try {
      await api.put(`/orphanages/documents/${uploadId}/review`, {
        action,
        notes: docNotes[uploadId] || '',
      });
      setPendingDocs(p => p.filter(d => d.upload_id !== uploadId));
      showToast(`Document ${action === 'approve' ? 'approved' : 'returned'} — user notified ✓`);
    } catch { showToast('Failed', 'error'); }
    setActLoad(null);
  };

  // ── User suspend / activate ───────────────────────────────
  const toggleUser = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate';
    try {
      await api.put(`/admin/users/${userId}/${action}`);
      setUsers(p => p.map(u => u.user_id === userId
        ? { ...u, status: action === 'suspend' ? 'suspended' : 'active' }
        : u
      ));
      showToast(`User ${action}d`);
    } catch { showToast('Failed', 'error'); }
  };

  const ROLE_LABEL = {
    adopter:'Adopter', sponsor:'Sponsor', both:'Adopter & Sponsor',
    orphanage:'Orphanage', admin:'Admin', childcare_services:'Childcare',
  };

  const TABS = [
    { id:'overview',    label:'Overview' },
    { id:'orphanages',  label:'Orphanage Approvals', badge: pendingOrph.length },
    { id:'documents',   label:'Document Review',     badge: pendingDocs.length },
    { id:'applications',label:'Applications' },
    { id:'users',       label:'Users' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className="ad-page">

        {/* Nav */}
        <div className="ad-nav">
          <div className="ad-gold"/>
          <div style={{ maxWidth:1300, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, background:'linear-gradient(135deg,#1C1C2E,#2D2D4E)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Shield size={17} color="white"/>
              </div>
              <div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0F2854' }}>Little Bridge</span>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#8A8799', fontWeight:700, letterSpacing:.8, textTransform:'uppercase' }}>
                  {user?.userType === 'super_admin' ? 'Super Admin' : 'Administrator'}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <NotificationBell/>
              <ProfileDropdown onLogout={() => { logout(); navigate('/'); }}/>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ position:'fixed', top:80, right:24, zIndex:9999,
            background: toast.type==='error'?'#DC2626':'#059669',
            color:'#fff', borderRadius:10, padding:'12px 20px',
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
            boxShadow:'0 8px 24px rgba(0,0,0,0.15)', display:'flex', alignItems:'center', gap:8 }}>
            <CheckCircle size={15}/>{toast.msg}
          </div>
        )}

        <div style={{ maxWidth:1300, margin:'0 auto', padding:'40px 24px' }}>

          {/* Banner */}
          <div className="fu" style={{ background:'linear-gradient(135deg,#1C1C2E,#2D2D4E)', borderRadius:20, padding:'28px 34px', color:'#fff', marginBottom:24, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, background:'rgba(155,58,90,0.15)', borderRadius:'50%' }}/>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, marginBottom:5 }}>Admin Dashboard</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.5)' }}>
              Manage all platform data — orphanages, documents, applications, users
            </p>
          </div>

          {/* Stats */}
          <div className="fu" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:14, marginBottom:24 }}>
            {[
              { label:'Total Users',      value: stats.users,     icon:<Users size={18} color="white"/>,    bg:'linear-gradient(135deg,#4F46E5,#7C3AED)' },
              { label:'Applications',     value: stats.apps,      icon:<FileText size={18} color="white"/>, bg:'linear-gradient(135deg,#C8963E,#A07030)' },
              { label:'Donations',        value: stats.donations,  icon:<CheckCircle size={18} color="white"/>, bg:'linear-gradient(135deg,#059669,#047857)' },
              { label:'Pending Orphanages',value:pendingOrph.length, icon:<Building2 size={18} color="white"/>, bg:'linear-gradient(135deg,#F59E0B,#D97706)', badge:pendingOrph.length>0 },
              { label:'Pending Docs',     value: pendingDocs.length, icon:<FileText size={18} color="white"/>, bg:'linear-gradient(135deg,#6366F1,#4F46E5)', badge:pendingDocs.length>0 },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ width:38, height:38, background:s.bg, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.icon}</div>
                  {s.badge && <span style={{ background:'#FEE2E2', color:'#991B1B', borderRadius:6, padding:'2px 8px', fontSize:10, fontWeight:700 }}>Review</span>}
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'#1C1C2E', marginBottom:2 }}>{s.value}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs fu">
            {TABS.map(t => (
              <button key={t.id} className={`tab-btn ${tab===t.id?'tab-active':'tab-idle'}`} onClick={() => setTab(t.id)}>
                {t.label}
                {t.badge > 0 && (
                  <span style={{ position:'absolute', top:-3, right:-3, width:16, height:16, background:'#DC2626', color:'#fff', borderRadius:'50%', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{t.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="fu" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
              {[
                { title:'Orphanage Approvals', count:pendingOrph.length, desc:'Registrations awaiting review', color:'#F59E0B', onClick:()=>setTab('orphanages') },
                { title:'Document Verification', count:pendingDocs.length, desc:'Adoption documents pending review', color:'#6366F1', onClick:()=>setTab('documents') },
                { title:'All Applications', count:stats.apps, desc:'Total adoption applications', color:'#0F2854', onClick:()=>setTab('applications') },
                { title:'Platform Users', count:stats.users, desc:'Registered users (non-guest)', color:'#059669', onClick:()=>setTab('users') },
              ].map(c => (
                <div key={c.title} onClick={c.onClick}
                  style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:22, cursor:'pointer', transition:'transform .2s,box-shadow .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:c.color, marginBottom:6 }}>{c.count}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:'#1C1C2E', marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── ORPHANAGE APPROVALS ── */}
          {tab === 'orphanages' && (
            <div className="fu">
              {loadingOrph ? (
                <div style={{ textAlign:'center', padding:'48px' }}>
                  <div style={{ width:36, height:36, border:'3px solid #F0EDE8', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }}/>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#B8B4AF' }}>Loading orphanages…</p>
                </div>
              ) : pendingOrph.length === 0 ? (
                <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <CheckCircle size={40} color="#16A34A" style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1C1C2E', marginBottom:8 }}>All caught up!</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>No orphanages pending review.</p>
                </div>
              ) : pendingOrph.map((o, i) => (
                <div key={o.orphanage_id} className="item-card orph fu" style={{ animationDelay:`${i*.06}s` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                    <div>
                      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, color:'#1C1C2E', marginBottom:5 }}>{o.name}</h3>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799' }}>
                        <span>📋 {o.registration_number}</span>
                        <span>📧 {o.email}</span>
                        {o.phone && <span>📞 {o.phone}</span>}
                        <span>📍 {o.city}, {o.state}</span>
                        {o.capacity && <span>👥 Capacity: {o.capacity}</span>}
                        <span>🗓️ {o.submitted_at ? new Date(o.submitted_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                    <span style={{ background:'#FEF3C7', color:'#92400E', borderRadius:8, padding:'4px 12px', fontSize:11, fontWeight:700 }}>Pending</span>
                  </div>

                  {o.description && (
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#504E5E', lineHeight:1.65, marginBottom:12, background:'#F5F2EC', borderRadius:8, padding:'9px 13px' }}>{o.description}</p>
                  )}

                  {o.latitude && o.longitude && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${o.latitude},${o.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display:'inline-flex', alignItems:'center', gap:5, marginBottom:12, color:'#0F2854', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, textDecoration:'none' }}>
                      📍 View on Maps <ExternalLink size={11}/>
                    </a>
                  )}

                  <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid #F0EDE8' }}>
                    <button className="ab green" onClick={() => approveOrph(o.orphanage_id, o.name)} disabled={actLoad===`orph-${o.orphanage_id}`}>
                      {actLoad===`orph-${o.orphanage_id}` ? <Spin/> : <Check size={13}/>}
                      {actLoad===`orph-${o.orphanage_id}` ? 'Processing…' : 'Approve & Notify'}
                    </button>
                    <button className="ab red" onClick={() => rejectOrph(o.orphanage_id, o.name)} disabled={actLoad===`orph-${o.orphanage_id}`}>
                      <X size={13}/>Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DOCUMENT REVIEW ── */}
          {tab === 'documents' && (
            <div className="fu">
              {loadingDocs ? (
                <div style={{ textAlign:'center', padding:'48px' }}>
                  <div style={{ width:36, height:36, border:'3px solid #F0EDE8', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }}/>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#B8B4AF' }}>Loading documents…</p>
                </div>
              ) : pendingDocs.length === 0 ? (
                <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <CheckCircle size={40} color="#16A34A" style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1C1C2E', marginBottom:8 }}>All documents reviewed!</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>No documents pending verification.</p>
                </div>
              ) : pendingDocs.map((doc, i) => (
                <div key={doc.upload_id} className="item-card doc fu" style={{ animationDelay:`${i*.06}s` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:12 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:5 }}>
                        <span style={{ background:'rgba(99,102,241,0.1)', color:'#6366F1', borderRadius:7, padding:'3px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700 }}>{doc.document_name}</span>
                        <span style={{ background:'#FEF3C7', color:'#92400E', borderRadius:7, padding:'3px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700 }}>Pending</span>
                      </div>
                      <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:'#1C1C2E', marginBottom:3 }}>
                        {doc.first_name} {doc.last_name}
                      </h3>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799' }}>
                        {doc.user_email} · {doc.orphanage_name} · {doc.file_name} · {new Date(doc.upload_date).toLocaleDateString()}
                      </div>
                    </div>
                    <button className="ab gray" onClick={() => { const url = buildFileUrl(doc.file_path); if (url) window.open(url,'_blank','noopener'); }}>
                      <Eye size={12}/>View
                    </button>
                  </div>

                  <div style={{ marginBottom:12 }}>
                    <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#8A8799', marginBottom:5 }}>
                      Notes for applicant (optional)
                    </label>
                    <input type="text" value={docNotes[doc.upload_id]||''}
                      onChange={e => setDocNotes(p => ({ ...p, [doc.upload_id]: e.target.value }))}
                      placeholder="e.g. Certified copy required…"
                      style={{ width:'100%', padding:'9px 13px', border:'1.5px solid #E8E4DF', borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#1C1C2E', outline:'none' }}/>
                  </div>

                  <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid #F0EDE8' }}>
                    <button className="ab green" onClick={() => reviewDoc(doc.upload_id, 'approve')} disabled={actLoad===`doc-${doc.upload_id}`}>
                      {actLoad===`doc-${doc.upload_id}` ? <Spin/> : <Check size={13}/>}
                      {actLoad===`doc-${doc.upload_id}` ? 'Processing…' : 'Verify & Approve'}
                    </button>
                    <button className="ab red" onClick={() => reviewDoc(doc.upload_id, 'reject')} disabled={actLoad===`doc-${doc.upload_id}`}>
                      <X size={13}/>Return
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── APPLICATIONS ── */}
          {tab === 'applications' && (
            <div className="fu">
              {loadingApps ? (
                <div style={{ textAlign:'center', padding:'48px' }}>
                  <div style={{ width:36, height:36, border:'3px solid #F0EDE8', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto' }}/>
                </div>
              ) : applications.length === 0 ? (
                <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <FileText size={36} color="#E0DDD8" style={{ margin:'0 auto 12px', display:'block' }}/>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#B8B4AF' }}>No applications yet.</p>
                </div>
              ) : applications.map((app, i) => {
                const pct = Math.round(((app.completed_stages||0)/(app.total_stages||7))*100);
                return (
                  <div key={app.application_id} className="item-card fu" style={{ animationDelay:`${i*.04}s` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:12 }}>
                      <div>
                        <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:'#1C1C2E', marginBottom:3 }}>
                          {app.first_name} {app.last_name}
                        </h3>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799' }}>
                          {app.user_email} → <strong>{app.orphanage_name}</strong> · {app.current_stage}
                        </div>
                      </div>
                      <span style={{ background:'rgba(155,58,90,0.08)', color:'#0F2854', borderRadius:7, padding:'3px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700 }}>
                        {app.application_status}
                      </span>
                    </div>
                    <div style={{ background:'#F0EDE8', borderRadius:4, height:7, overflow:'hidden', marginBottom:5 }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:'#0F2854', borderRadius:4 }}/>
                    </div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#B8B4AF' }}>
                      Stage {app.completed_stages||0}/{app.total_stages||7} · {pct}% · Started {new Date(app.initiated_date).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className="fu">
              {loadingUsers ? (
                <div style={{ textAlign:'center', padding:'48px' }}>
                  <div style={{ width:36, height:36, border:'3px solid #F0EDE8', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto' }}/>
                </div>
              ) : users.length === 0 ? (
                <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <Users size={36} color="#E0DDD8" style={{ margin:'0 auto 12px', display:'block' }}/>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#B8B4AF' }}>No users yet.</p>
                </div>
              ) : users.map((u, i) => (
                <div key={u.user_id} className="item-card fu" style={{ animationDelay:`${i*.03}s`, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:'#1C1C2E', marginBottom:3 }}>
                      {u.first_name} {u.last_name}
                    </div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799' }}>
                      {u.email} · {ROLE_LABEL[u.user_type]||u.user_type} {u.city ? `· ${u.city}` : ''} · Joined {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{
                      background: u.status==='active' ? '#F0FDF4' : '#FEF2F2',
                      color:      u.status==='active' ? '#15803D' : '#DC2626',
                      borderRadius:6, padding:'3px 10px', fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif"
                    }}>{u.status}</span>
                    <button className={`ab ${u.status==='active'?'red':'green'}`}
                      onClick={() => toggleUser(u.user_id, u.status)}
                      style={{ padding:'6px 14px', fontSize:12 }}>
                      {u.status==='active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
