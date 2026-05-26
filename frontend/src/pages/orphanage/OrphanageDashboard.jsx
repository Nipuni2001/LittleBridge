import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import NotificationBell from '../../components/NotificationBell';
import ProfileDropdown from '../../components/ProfileDropdown';
import {
  Building2, Heart, Package, Plus, Edit2, Trash2, Save, X,
  CheckCircle, Clock, XCircle, MapPin, Phone, Mail,
  ExternalLink, LogOut
} from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--p:#0F2854;--pm:#1C4D8D;--hover:#4988C4;--light:#BDE8F5;--gold:#C8963E;--border:#C8D8EC;--bg:#F0F6FF;--text:#1A2744;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);}
.od-page{min-height:100vh;background:var(--bg);}
.od-nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;}
.od-gold{height:3px;background:linear-gradient(90deg,var(--gold),#E8B96B,var(--gold));}
.tab-wrap{display:flex;background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:4px;gap:4px;margin-bottom:22px;flex-wrap:wrap;}
.tab-btn{flex:1;padding:9px 14px;border-radius:8px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s;white-space:nowrap;position:relative;}
.tab-active{background:var(--p);color:#fff;}
.tab-idle{background:transparent;color:#8A9AB5;}
.tab-idle:hover{background:var(--light);}
.card{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:20px;margin-bottom:12px;}
.card.pledged{border-left:4px solid #F59E0B;}
.card.pending{border-left:4px solid #F59E0B;}
.card.confirmed{border-left:4px solid #10B981;}
.card.cancelled{border-left:4px solid #EF4444;}
.card.declined{border-left:4px solid #EF4444;}
.btn-g{background:#059669;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s;}
.btn-g:hover{background:#047857;}.btn-g:disabled{opacity:.5;cursor:not-allowed;}
.btn-r{background:#DC2626;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s;}
.btn-r:hover{background:#B91C1C;}.btn-r:disabled{opacity:.5;cursor:not-allowed;}
.btn-gray{background:#fff;color:var(--text);border:1.5px solid var(--border);border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s;}
.btn-gray:hover{border-color:var(--p);color:var(--p);}
.need-row{background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:8px;transition:border-color .2s;}
.need-row:hover{border-color:var(--hover);}
.inp{padding:10px 13px;border:1.5px solid var(--border);border-radius:9px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);outline:none;background:#fff;transition:border-color .2s;}
.inp:focus{border-color:var(--p);box-shadow:0 0 0 3px rgba(15,40,84,0.07);}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fu .3s ease forwards;}
`;

const NEED_CATEGORIES = [
  { value:'monetary',    label:'💰 Money' },
  { value:'clothes',     label:'👕 Clothes' },
  { value:'books',       label:'📚 Books' },
  { value:'food',        label:'🍎 Food' },
  { value:'medical',     label:'💊 Medical' },
  { value:'essentials',  label:'📦 Essentials' },
  { value:'art',         label:'🎨 Art Supplies' },
  { value:'sports',      label:'⚽ Sports Equipment' },
  { value:'educational', label:'🖥️ Educational Equipment' },
  { value:'toys',        label:'🧸 Toys' },
];

const PRIORITY_COLORS = {
  urgent: { bg:'#FEE2E2', text:'#991B1B' },
  high:   { bg:'#FEF3C7', text:'#92400E' },
  medium: { bg:'#DBEAFE', text:'#1D4ED8' },
  low:    { bg:'#F5F2EC', text:'#504E5E' },
};

function Spin() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .8s linear infinite', flexShrink:0 }}>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
}

/** Returns true for any "needs action" state including old '' records and new 'pledged' */
function isPendingStatus(status) {
  return !status || status === '' || status === 'pledged' || status === 'pending';
}

export default function OrphanageDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('requests');
  const [orphanage, setOrphanage] = useState(null);
  const [requests, setRequests]   = useState([]);
  const [needs, setNeeds]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actLoad, setActLoad]     = useState(null);
  const [toast, setToast]         = useState(null);

  const [showAddNeed, setShowAddNeed] = useState(false);
  const [newNeed, setNewNeed] = useState({ category:'clothes', item_name:'', description:'', priority:'medium', quantity_needed:'' });
  const [savingNeed, setSavingNeed] = useState(false);
  const [editingNeedId, setEditingNeedId] = useState(null);
  const [editNeed, setEditNeed] = useState({});

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchOrphanage(); }, []);
  useEffect(() => {
    if (orphanage?.orphanage_id) {
      fetchRequests();
      fetchNeeds();
    }
  }, [orphanage?.orphanage_id]);

  const fetchOrphanage = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orphanages/my-orphanage');
      setOrphanage(data.data || null);
    } catch { setOrphanage(null); }
    setLoading(false);
  };

  const fetchRequests = async () => {
    try {
      const { data } = await api.get(`/sponsorships/orphanage/${orphanage.orphanage_id}/requests`);
      setRequests(data.data || []);
    } catch { setRequests([]); }
  };

  const fetchNeeds = async () => {
    try {
      const { data } = await api.get(`/orphanages/${orphanage.orphanage_id}/needs`);
      setNeeds(data.data || []);
    } catch { setNeeds([]); }
  };

  const handleRequest = async (sponsorshipId, action) => {
    setActLoad(`req-${sponsorshipId}-${action}`);
    try {
      await api.put(`/sponsorships/${sponsorshipId}/${action}`);
      setRequests(prev => prev.map(r =>
        r.sponsorship_id === sponsorshipId
          ? { ...r, status: action === 'confirm' ? 'confirmed' : 'cancelled' }
          : r
      ));
      showToast(`Request ${action === 'confirm' ? 'confirmed' : 'declined'} ✓`);
    } catch (err) {
      showToast(err.response?.data?.message || `Failed to ${action}`, 'error');
    }
    setActLoad(null);
  };

  const handleAddNeed = async () => {
    if (!newNeed.item_name.trim()) { showToast('Please enter an item name', 'error'); return; }
    setSavingNeed(true);
    try {
      const { data } = await api.post(`/orphanages/${orphanage.orphanage_id}/needs`, newNeed);
      setNeeds(prev => [...prev, data.data || { ...newNeed, need_id: Date.now() }]);
      setNewNeed({ category:'clothes', item_name:'', description:'', priority:'medium', quantity_needed:'' });
      setShowAddNeed(false);
      showToast('Need added ✓');
    } catch { showToast('Failed to add need', 'error'); }
    setSavingNeed(false);
  };

  const handleSaveNeed = async (needId) => {
    try {
      await api.put(`/orphanages/${orphanage.orphanage_id}/needs/${needId}`, editNeed);
      setNeeds(prev => prev.map(n => n.need_id === needId ? { ...n, ...editNeed } : n));
      setEditingNeedId(null);
      showToast('Need updated ✓');
    } catch { showToast('Failed to update', 'error'); }
  };

  const handleDeleteNeed = async (needId) => {
    if (!window.confirm('Remove this donation need?')) return;
    try {
      await api.delete(`/orphanages/${orphanage.orphanage_id}/needs/${needId}`);
      setNeeds(prev => prev.filter(n => n.need_id !== needId));
      showToast('Need removed');
    } catch { showToast('Failed to remove', 'error'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F6FF' }}>
      <div style={{ width:40, height:40, border:'3px solid #BDE8F5', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!orphanage) return (
    <>
      <style>{S}</style>
      <div style={{ minHeight:'100vh', background:'#F0F6FF', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ background:'#fff', borderRadius:20, padding:48, maxWidth:500, width:'100%', textAlign:'center', border:'1.5px solid #C8D8EC' }}>
          <Building2 size={52} color="#0F2854" style={{ margin:'0 auto 20px', display:'block' }}/>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#1A2744', marginBottom:12 }}>
            Register Your Orphanage
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5', lineHeight:1.7, marginBottom:28 }}>
            You haven't registered an orphanage yet. Submit your registration for review by the Childcare Services Department.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <button onClick={() => navigate('/orphanage/register')}
              style={{ background:'#0F2854', color:'#fff', border:'none', borderRadius:10, padding:'13px 28px', fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:600, cursor:'pointer' }}>
              Register Orphanage →
            </button>
            <button onClick={handleLogout}
              style={{ background:'transparent', color:'#8A9AB5', border:'1.5px solid #C8D8EC', borderRadius:10, padding:'11px 24px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <LogOut size={14}/>Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (orphanage.status === 'pending') return (
    <>
      <style>{S}</style>
      <div style={{ minHeight:'100vh', background:'#F0F6FF', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ background:'#fff', borderRadius:20, padding:48, maxWidth:520, width:'100%', textAlign:'center', border:'1.5px solid #C8D8EC' }}>
          <Clock size={52} color="#C8963E" style={{ margin:'0 auto 20px', display:'block' }}/>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'#1A2744', marginBottom:12 }}>
            Registration Pending Review
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5', lineHeight:1.7, marginBottom:20 }}>
            <strong style={{ color:'#1A2744' }}>{orphanage.name}</strong> has been submitted and is awaiting review by the Childcare Services Department.
          </p>
          <div style={{ background:'#F0F6FF', border:'1px solid #C8D8EC', borderRadius:12, padding:'18px 22px', marginBottom:24, textAlign:'left' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:'#8A9AB5', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>
              What happens next
            </div>
            {[
              '1. Childcare Services reviews your registration (3–5 business days)',
              '2. You receive an email with the decision',
              '3. Once approved, your orphanage goes live on the platform',
            ].map(s => (
              <div key={s} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#4A5A78', marginBottom:8, display:'flex', alignItems:'flex-start', gap:8 }}>
                <span>→</span><span>{s}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#B0BAC8', marginBottom:16 }}>
            Need to switch accounts? Log out below.
          </p>
          <button onClick={handleLogout}
            style={{ background:'#0F2854', color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8, width:'100%', justifyContent:'center' }}>
            <LogOut size={16}/>Logout
          </button>
        </div>
      </div>
    </>
  );

  const pendingReqs   = requests.filter(r => isPendingStatus(r.status));
  const confirmedReqs = requests.filter(r => r.status === 'confirmed');
  const urgentNeeds   = needs.filter(n => n.priority === 'urgent').length;

  return (
    <>
      <style>{S}</style>
      <div className="od-page">

        <div className="od-nav">
          <div className="od-gold"/>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Building2 size={20} color="#0F2854"/>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0F2854' }}>Little Bridge</span>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#8A9AB5', fontWeight:700, letterSpacing:.8, textTransform:'uppercase' }}>Orphanage Portal</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <NotificationBell/>
              <ProfileDropdown onLogout={handleLogout}/>
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

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'36px 24px' }}>

          <div className="fu" style={{ background:`linear-gradient(135deg,#0F2854,#1C4D8D)`, borderRadius:20, padding:'28px 34px', color:'#fff', marginBottom:24, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, background:'rgba(189,232,245,0.1)', borderRadius:'50%' }}/>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, marginBottom:6 }}>{orphanage.name}</h1>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,0.7)' }}>
              {orphanage.city && <span><MapPin size={12} style={{ verticalAlign:'middle', marginRight:4 }}/>{orphanage.city}, {orphanage.state}</span>}
              {orphanage.phone && <span><Phone size={12} style={{ verticalAlign:'middle', marginRight:4 }}/>{orphanage.phone}</span>}
              {orphanage.email && <span><Mail size={12} style={{ verticalAlign:'middle', marginRight:4 }}/>{orphanage.email}</span>}
              {orphanage.latitude && orphanage.longitude && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${orphanage.latitude},${orphanage.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color:'rgba(255,255,255,0.8)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                  <ExternalLink size={12}/>View on Maps
                </a>
              )}
            </div>
          </div>

          <div className="fu" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14, marginBottom:24 }}>
            {[
              { label:'Pending Requests',    value:pendingReqs.length,   color:'#F59E0B', badge: pendingReqs.length > 0 },
              { label:'Confirmed Donations', value:confirmedReqs.length, color:'#059669' },
              { label:'Needs Listed',        value:needs.length,         color:'#0F2854' },
              { label:'Urgent Needs',        value:urgentNeeds,          color:'#DC2626', badge: urgentNeeds > 0 },
            ].map(s => (
              <div key={s.label} style={{ background:'#fff', border:'1.5px solid #C8D8EC', borderRadius:14, padding:18 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:s.color, marginBottom:4 }}>
                  {s.value}{s.badge ? ' !' : ''}
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A9AB5' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="tab-wrap">
            {[
              { id:'requests', label:'Sponsorship Requests', badge: pendingReqs.length },
              { id:'needs',    label:'Donation Needs' },
            ].map(t => (
              <button key={t.id} className={`tab-btn ${activeTab===t.id?'tab-active':'tab-idle'}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
                {t.badge > 0 && (
                  <span style={{ position:'absolute', top:-3, right:-3, width:17, height:17, background:'#DC2626', color:'#fff', borderRadius:'50%', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{t.badge}</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'requests' && (
            <div className="fu">
              {requests.length === 0 ? (
                <div style={{ background:'#fff', border:'1.5px solid #C8D8EC', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <Heart size={40} color="#C8D8EC" style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1A2744', marginBottom:8 }}>No requests yet</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5' }}>
                    Sponsorship requests will appear here when donors submit donations to your orphanage.
                  </p>
                </div>
              ) : requests.map((req, i) => {
                const isPending = isPendingStatus(req.status);
                const isConfirmed = req.status === 'confirmed';
                const isCancelled = req.status === 'cancelled' || req.status === 'declined';

                // Map to CSS class name
                const cardClass = isPending ? 'pending' : isConfirmed ? 'confirmed' : 'cancelled';

                const sc = isPending
                  ? { bg:'#FEF3C7', text:'#92400E', icon:<Clock size={13}/>, label:'Pending' }
                  : isConfirmed
                    ? { bg:'#D1FAE5', text:'#065F46', icon:<CheckCircle size={13}/>, label:'Confirmed' }
                    : { bg:'#FEE2E2', text:'#991B1B', icon:<XCircle size={13}/>, label:'Cancelled' };

                return (
                  <div key={req.sponsorship_id} className={`card ${cardClass} fu`} style={{ animationDelay:`${i*.05}s` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:'#1A2744' }}>
                            {req.donor_name || (req.is_anonymous ? 'Anonymous Donor' : req.donor_email)}
                          </span>
                          <span style={{ background:sc.bg, color:sc.text, borderRadius:6, padding:'2px 9px', fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:4 }}>
                            {sc.icon}{sc.label}
                          </span>
                        </div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A9AB5', lineHeight:1.6 }}>
                          {req.donation_type === 'monetary'
                            ? `💰 LKR ${Number(req.amount||0).toLocaleString()}`
                            : `📦 ${req.item_description||'Goods donation'}`}
                          {req.category && (
                            <span style={{ marginLeft:8, background:'rgba(15,40,84,0.08)', color:'#0F2854', borderRadius:5, padding:'1px 7px', fontSize:11, fontWeight:600 }}>{req.category}</span>
                          )}
                        </div>
                        {req.scheduled_date && (
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A9AB5', marginTop:3 }}>
                            📅 Scheduled: {new Date(req.scheduled_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    {isPending && (
                      <div style={{ display:'flex', gap:10, paddingTop:12, borderTop:'1px solid #EFF4FF' }}>
                        <button className="btn-g" onClick={() => handleRequest(req.sponsorship_id, 'confirm')} disabled={actLoad===`req-${req.sponsorship_id}-confirm`}>
                          {actLoad===`req-${req.sponsorship_id}-confirm` ? <Spin/> : <CheckCircle size={13}/>}
                          {actLoad===`req-${req.sponsorship_id}-confirm` ? 'Confirming…' : 'Confirm'}
                        </button>
                        <button className="btn-r" onClick={() => handleRequest(req.sponsorship_id, 'decline')} disabled={actLoad===`req-${req.sponsorship_id}-decline`}>
                          {actLoad===`req-${req.sponsorship_id}-decline` ? <Spin/> : <X size={13}/>}
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'needs' && (
            <div className="fu">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1A2744', marginBottom:4 }}>Donation Needs</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A9AB5' }}>These are shown to potential sponsors on the platform.</p>
                </div>
                <button onClick={() => { setShowAddNeed(true); setEditingNeedId(null); }}
                  style={{ background:'#0F2854', color:'#fff', border:'none', borderRadius:9, padding:'10px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <Plus size={14}/>Add Need
                </button>
              </div>

              {showAddNeed && (
                <div style={{ background:'#fff', border:`1.5px solid #0F2854`, borderRadius:14, padding:20, marginBottom:16 }}>
                  <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:'#1A2744', marginBottom:14 }}>Add New Donation Need</h4>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                    <div>
                      <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#1A2744', marginBottom:5 }}>Category *</label>
                      <select className="inp" style={{ width:'100%' }} value={newNeed.category} onChange={e => setNewNeed(p => ({ ...p, category: e.target.value }))}>
                        {NEED_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#1A2744', marginBottom:5 }}>Priority</label>
                      <select className="inp" style={{ width:'100%' }} value={newNeed.priority} onChange={e => setNewNeed(p => ({ ...p, priority: e.target.value }))}>
                        <option value="urgent">🔴 Urgent</option>
                        <option value="high">🟡 High</option>
                        <option value="medium">🔵 Medium</option>
                        <option value="low">⚪ Low</option>
                      </select>
                    </div>
                    <div style={{ gridColumn:'1/-1' }}>
                      <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#1A2744', marginBottom:5 }}>Item Name *</label>
                      <input className="inp" style={{ width:'100%' }} placeholder="e.g. School Uniforms, Rice & Lentils…"
                        value={newNeed.item_name} onChange={e => setNewNeed(p => ({ ...p, item_name: e.target.value }))}/>
                    </div>
                    <div>
                      <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#1A2744', marginBottom:5 }}>Quantity Needed</label>
                      <input className="inp" style={{ width:'100%' }} placeholder="e.g. 30 sets, 50 kg…"
                        value={newNeed.quantity_needed} onChange={e => setNewNeed(p => ({ ...p, quantity_needed: e.target.value }))}/>
                    </div>
                    <div>
                      <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#1A2744', marginBottom:5 }}>Description</label>
                      <input className="inp" style={{ width:'100%' }} placeholder="Any specific requirements…"
                        value={newNeed.description} onChange={e => setNewNeed(p => ({ ...p, description: e.target.value }))}/>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <button className="btn-g" onClick={handleAddNeed} disabled={savingNeed}>
                      {savingNeed ? <Spin/> : <Save size={13}/>}
                      {savingNeed ? 'Saving…' : 'Save Need'}
                    </button>
                    <button className="btn-gray" onClick={() => setShowAddNeed(false)}><X size={13}/>Cancel</button>
                  </div>
                </div>
              )}

              {needs.length === 0 && !showAddNeed ? (
                <div style={{ background:'#fff', border:'1.5px solid #C8D8EC', borderRadius:14, padding:'48px 24px', textAlign:'center' }}>
                  <Package size={40} color="#C8D8EC" style={{ margin:'0 auto 14px', display:'block' }}/>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1A2744', marginBottom:8 }}>No needs listed yet</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A9AB5', marginBottom:20 }}>
                    Add your donation needs so sponsors can see what you require.
                  </p>
                  <button onClick={() => setShowAddNeed(true)}
                    style={{ background:'#0F2854', color:'#fff', border:'none', borderRadius:9, padding:'10px 22px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
                    <Plus size={14}/>Add Your First Need
                  </button>
                </div>
              ) : needs.map((need, i) => {
                const pc = PRIORITY_COLORS[need.priority] || PRIORITY_COLORS.medium;
                const isEditing = editingNeedId === need.need_id;

                return (
                  <div key={need.need_id} className="need-row fu" style={{ animationDelay:`${i*.04}s` }}>
                    {isEditing ? (
                      <div style={{ flex:1 }}>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                          <select className="inp" value={editNeed.category} onChange={e => setEditNeed(p => ({ ...p, category: e.target.value }))}>
                            {NEED_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                          <select className="inp" value={editNeed.priority} onChange={e => setEditNeed(p => ({ ...p, priority: e.target.value }))}>
                            <option value="urgent">🔴 Urgent</option>
                            <option value="high">🟡 High</option>
                            <option value="medium">🔵 Medium</option>
                            <option value="low">⚪ Low</option>
                          </select>
                          <input className="inp" placeholder="Item name" style={{ gridColumn:'1/-1' }}
                            value={editNeed.item_name} onChange={e => setEditNeed(p => ({ ...p, item_name: e.target.value }))}/>
                          <input className="inp" placeholder="Quantity"
                            value={editNeed.quantity_needed||''} onChange={e => setEditNeed(p => ({ ...p, quantity_needed: e.target.value }))}/>
                          <input className="inp" placeholder="Description"
                            value={editNeed.description||''} onChange={e => setEditNeed(p => ({ ...p, description: e.target.value }))}/>
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          <button className="btn-g" onClick={() => handleSaveNeed(need.need_id)}><Save size={12}/>Save</button>
                          <button className="btn-gray" onClick={() => setEditingNeedId(null)}><X size={12}/>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:'#1A2744' }}>{need.item_name}</span>
                            <span style={{ background:pc.bg, color:pc.text, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{need.priority}</span>
                            <span style={{ background:'rgba(15,40,84,0.08)', color:'#0F2854', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600 }}>
                              {NEED_CATEGORIES.find(c => c.value===need.category)?.label || need.category}
                            </span>
                          </div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A9AB5' }}>
                            {need.quantity_needed && <span>Qty: {need.quantity_needed} · </span>}
                            {need.description}
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                          <button className="btn-gray" style={{ padding:'6px 12px' }}
                            onClick={() => { setEditingNeedId(need.need_id); setEditNeed({ ...need }); }}>
                            <Edit2 size={12}/>
                          </button>
                          <button className="btn-r" style={{ padding:'6px 12px' }}
                            onClick={() => handleDeleteNeed(need.need_id)}>
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}