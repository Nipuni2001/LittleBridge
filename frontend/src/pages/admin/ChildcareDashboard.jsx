import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import NotificationBell from '../../components/NotificationBell';
import ProfileDropdown from '../../components/ProfileDropdown';
import {
  Shield, FileText, Building2, Check, X, Eye,
  CheckCircle, ExternalLink
} from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--p:#0F2854;--pm:#1C4D8D;--hover:#4988C4;--light:#BDE8F5;--gold:#C8963E;--border:#C8D8EC;--bg:#F0F6FF;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);}
.cc-page{min-height:100vh;background:var(--bg);}
.cc-nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;}
.cc-gold{height:3px;background:linear-gradient(90deg,var(--gold),#E8B96B,var(--gold));}
.stat-card{background:#fff;border-radius:14px;border:1.5px solid var(--border);padding:20px;}
.tab-btn{flex:1;padding:10px 14px;border-radius:9px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;transition:all .2s;position:relative;}
.tab-active{background:var(--p);color:#fff;}
.tab-idle{background:transparent;color:#8A9AB5;}
.tab-idle:hover{background:var(--light);}
.cc-btn{background:var(--p);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s;}
.cc-btn:hover{background:var(--hover);}
.cc-btn.green{background:#059669;}.cc-btn.green:hover{background:#047857;}
.cc-btn.red{background:#DC2626;}.cc-btn.red:hover{background:#B91C1C;}
.cc-btn.gray{background:#fff;color:#4A5A78;border:1.5px solid var(--border);}.cc-btn.gray:hover{border-color:var(--p);color:var(--p);}
.item-card{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:20px;margin-bottom:12px;}
.item-card.pending-l{border-left:4px solid #F59E0B;}
.item-card.pending-doc{border-left:4px solid #6366F1;}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .3s ease forwards;}
`;

function Spin() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .8s linear infinite', flexShrink:0 }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
}

function buildFileUrl(p) {
  if (!p) return null;
  const c = p.replace(/\\/g, '/');
  if (c.startsWith('http')) return c;
  return `http://localhost:5000/${c.startsWith('/') ? c.slice(1) : c}`;
}

export default function ChildcareDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab]     = useState('orphanages');
  const [pendingOrph, setPendingOrph] = useState([]);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [fetchingOrph, setFO]         = useState(true);
  const [fetchingDocs, setFD]         = useState(true);
  const [actLoad, setActLoad]         = useState(null);
  const [toast, setToast]             = useState(null);
  const [docNotes, setDocNotes]       = useState({});

  useEffect(() => {
    fetchPending();
    fetchDocs();
  }, []);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /**
   * FIXED: Always set state from API.
   * Old: if (r.data.data?.length) setPendingOrph(...) ← kept mock when API returned []
   * New: setPendingOrph(r.data.data || [])            ← always reflects reality
   */
  const fetchPending = async () => {
    setFO(true);
    try {
      const r = await api.get('/orphanages/pending');
      setPendingOrph(r.data.data || []);
    } catch (err) {
      console.error('fetchPending:', err.message);
      setPendingOrph([]);
    }
    setFO(false);
  };

  const fetchDocs = async () => {
    setFD(true);
    try {
      const r = await api.get('/orphanages/documents/pending');
      setPendingDocs(r.data.data || []);
    } catch (err) {
      console.error('fetchDocs:', err.message);
      setPendingDocs([]);
    }
    setFD(false);
  };

  const approveOrph = async (id, name) => {
    setActLoad(`orph-${id}`);
    try {
      await api.put(`/orphanages/${id}/approve`);
      setPendingOrph(prev => prev.filter(o => o.orphanage_id !== id));
      showToast(`${name} approved ✓`);
    } catch (e) { showToast(e.response?.data?.message || 'Failed', 'error'); }
    setActLoad(null);
  };

  const rejectOrph = async (id, name) => {
    const reason = window.prompt('Rejection reason:');
    if (reason === null) return;
    setActLoad(`orph-${id}`);
    try {
      await api.put(`/orphanages/${id}/reject`, { reason });
      setPendingOrph(prev => prev.filter(o => o.orphanage_id !== id));
      showToast('Rejection sent');
    } catch { showToast('Failed', 'error'); }
    setActLoad(null);
  };

  const reviewDoc = async (uploadId, action) => {
    setActLoad(`doc-${uploadId}`);
    try {
      await api.put(`/orphanages/documents/${uploadId}/review`, {
        action,
        notes: docNotes[uploadId] || '',
      });
      setPendingDocs(prev => prev.filter(d => d.upload_id !== uploadId));
      showToast(`Document ${action === 'approve' ? 'approved' : 'returned'} ✓`);
    } catch { showToast('Failed', 'error'); }
    setActLoad(null);
  };

  const openDoc = (filePath) => {
    const url = buildFileUrl(filePath);
    if (url) window.open(url, '_blank', 'noopener');
    else alert('File not found');
  };

  function Loader() {
    return (
      <div style={{ textAlign:'center', padding:'48px' }}>
        <div style={{ width:36, height:36, border:'3px solid #C8D8EC', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }}/>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5' }}>Loading…</p>
      </div>
    );
  }

  return (
    <>
      <style>{S}</style>
      <div className="cc-page">

        <div className="cc-nav">
          <div className="cc-gold"/>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, background:`linear-gradient(135deg,#0F2854,#1C4D8D)`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Shield size={17} color="white"/>
              </div>
              <div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0F2854' }}>Little Bridge</span>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#8A9AB5', fontWeight:700, letterSpacing:.8, textTransform:'uppercase' }}>Childcare Services</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <NotificationBell/>
              <ProfileDropdown onLogout={() => { logout(); navigate('/'); }}/>
            </div>
          </div>
        </div>

        {toast && (
          <div style={{ position:'fixed', top:80, right:24, zIndex:9999,
            background: toast.type==='error' ? '#DC2626' : '#059669',
            color:'#fff', borderRadius:10, padding:'12px 20px',
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
            boxShadow:'0 8px 24px rgba(0,0,0,0.15)', display:'flex', alignItems:'center', gap:8 }}>
            <CheckCircle size={15}/>{toast.msg}
          </div>
        )}

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 24px' }}>

          {/* Banner */}
          <div className="fu" style={{ background:`linear-gradient(135deg,#0F2854,#1C4D8D)`, borderRadius:20, padding:'30px 34px', color:'#fff', marginBottom:24, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, background:'rgba(189,232,245,0.12)', borderRadius:'50%' }}/>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, marginBottom:5 }}>Probation & Child Care Services</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.55)' }}>Review orphanage registrations and verify adoption documents</p>
          </div>

          {/* Stats */}
          <div className="fu" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
            {[
              { label:'Pending Orphanages', value:fetchingOrph?'…':pendingOrph.length, icon:<Building2 size={18} color="white"/>, bg:'linear-gradient(135deg,#F59E0B,#D97706)', badge: !fetchingOrph && pendingOrph.length > 0 },
              { label:'Pending Documents',  value:fetchingDocs?'…':pendingDocs.length,  icon:<FileText size={18} color="white"/>,  bg:'linear-gradient(135deg,#6366F1,#4F46E5)', badge: !fetchingDocs && pendingDocs.length > 0 },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div style={{ width:40, height:40, background:s.bg, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.icon}</div>
                  {s.badge && <span style={{ background:'#FEE2E2', color:'#991B1B', borderRadius:6, padding:'2px 8px', fontSize:10, fontWeight:700 }}>Review needed</span>}
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'#1A2744', marginBottom:2 }}>{s.value}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A9AB5' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="fu" style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:12, padding:4, display:'flex', gap:4, marginBottom:22 }}>
            {[
              { id:'orphanages', label:'Orphanage Approvals', count: pendingOrph.length },
              { id:'documents',  label:'Document Verification', count: pendingDocs.length },
            ].map(t => (
              <button key={t.id} className={`tab-btn ${activeTab===t.id?'tab-active':'tab-idle'}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
                {t.count > 0 && !fetchingOrph && !fetchingDocs && (
                  <span style={{ position:'absolute', top:-3, right:-3, width:17, height:17, background:'#DC2626', color:'#fff', borderRadius:'50%', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── ORPHANAGE APPROVALS ── */}
          {activeTab === 'orphanages' && (
            <div className="fu">
              {fetchingOrph ? <Loader/> : pendingOrph.length === 0 ? (
                <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <CheckCircle size={40} color="#16A34A" style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1A2744', marginBottom:8 }}>All caught up!</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5' }}>No orphanages pending review.</p>
                </div>
              ) : pendingOrph.map((orp, i) => (
                <div key={orp.orphanage_id} className="item-card pending-l fu" style={{ animationDelay:`${i*.06}s` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                    <div>
                      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#1A2744', marginBottom:6 }}>{orp.name}</h3>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A9AB5' }}>
                        <span>📋 {orp.registration_number}</span>
                        <span>📧 {orp.email}</span>
                        {orp.phone && <span>📞 {orp.phone}</span>}
                        <span>📍 {orp.city}, {orp.state}</span>
                        {orp.capacity && <span>👥 Capacity: {orp.capacity}</span>}
                        <span>🗓️ {orp.submitted_at ? new Date(orp.submitted_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                    <span style={{ background:'#FEF3C7', color:'#92400E', borderRadius:8, padding:'4px 12px', fontSize:11, fontWeight:700 }}>Pending</span>
                  </div>

                  {orp.description && (
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#4A5A78', lineHeight:1.65, marginBottom:12, background:'#F0F6FF', borderRadius:8, padding:'9px 13px' }}>{orp.description}</p>
                  )}

                  {orp.latitude && orp.longitude && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${orp.latitude},${orp.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display:'inline-flex', alignItems:'center', gap:5, marginBottom:12, color:'#0F2854', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, textDecoration:'none' }}>
                      📍 View on Maps <ExternalLink size={11}/>
                    </a>
                  )}

                  <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid #EFF4FF' }}>
                    <button className="cc-btn green" onClick={() => approveOrph(orp.orphanage_id, orp.name)} disabled={actLoad===`orph-${orp.orphanage_id}`}>
                      {actLoad===`orph-${orp.orphanage_id}` ? <Spin/> : <Check size={13}/>}
                      {actLoad===`orph-${orp.orphanage_id}` ? 'Processing…' : 'Approve & Notify'}
                    </button>
                    <button className="cc-btn red" onClick={() => rejectOrph(orp.orphanage_id, orp.name)} disabled={actLoad===`orph-${orp.orphanage_id}`}>
                      <X size={13}/>Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DOCUMENT VERIFICATION ── */}
          {activeTab === 'documents' && (
            <div className="fu">
              {fetchingDocs ? <Loader/> : pendingDocs.length === 0 ? (
                <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <CheckCircle size={40} color="#16A34A" style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1A2744', marginBottom:8 }}>All documents reviewed!</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5' }}>No documents pending verification.</p>
                </div>
              ) : pendingDocs.map((doc, i) => (
                <div key={doc.upload_id} className="item-card pending-doc fu" style={{ animationDelay:`${i*.06}s` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                        <span style={{ background:'rgba(99,102,241,0.1)', color:'#6366F1', borderRadius:7, padding:'3px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700 }}>{doc.document_name}</span>
                        <span style={{ background:'#FEF3C7', color:'#92400E', borderRadius:7, padding:'3px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700 }}>Pending</span>
                      </div>
                      <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:'#1A2744', marginBottom:3 }}>
                        {doc.first_name} {doc.last_name}
                      </h3>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A9AB5' }}>
                        {doc.user_email} · {doc.orphanage_name} · {doc.file_name} · {new Date(doc.upload_date).toLocaleDateString()}
                      </div>
                    </div>
                    <button className="cc-btn gray" onClick={() => openDoc(doc.file_path)}>
                      <Eye size={12}/>View Document
                    </button>
                  </div>

                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#8A9AB5', marginBottom:5 }}>
                      Notes for applicant (optional)
                    </label>
                    <input type="text" placeholder="e.g. Certified copy required…"
                      value={docNotes[doc.upload_id]||''}
                      onChange={e => setDocNotes(prev => ({ ...prev, [doc.upload_id]: e.target.value }))}
                      style={{ width:'100%', padding:'9px 13px', border:'1.5px solid #C8D8EC', borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#1A2744', outline:'none' }}/>
                  </div>

                  <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid #EFF4FF' }}>
                    <button className="cc-btn green" onClick={() => reviewDoc(doc.upload_id, 'approve')} disabled={actLoad===`doc-${doc.upload_id}`}>
                      {actLoad===`doc-${doc.upload_id}` ? <Spin/> : <Check size={13}/>}
                      {actLoad===`doc-${doc.upload_id}` ? 'Processing…' : 'Verify & Approve'}
                    </button>
                    <button className="cc-btn red" onClick={() => reviewDoc(doc.upload_id, 'reject')} disabled={actLoad===`doc-${doc.upload_id}`}>
                      <X size={13}/>Return to Applicant
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
