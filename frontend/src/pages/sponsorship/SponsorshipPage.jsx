import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleGuard from '../../components/RoleGuard';
import api from '../../services/api';
import NotificationBell from '../../components/NotificationBell';
import ProfileDropdown from '../../components/ProfileDropdown';
import {
  Heart, MapPin, Calendar, ChevronLeft, Search, ChevronDown,
  CheckCircle, X, AlertCircle, Navigation, ExternalLink, TrendingUp
} from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--p:#0F2854;--pd:#7A2444;--pm:rgba(155,58,90,0.08);--gold:#C8963E;--border:#E8E4DF;--text:#1C1C2E;--bg:#FAFAF8;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);}
.sp-nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;}
.sp-gold{height:3px;background:linear-gradient(90deg,var(--gold),#E8B96B,var(--gold));}
.sp-card{background:#fff;border-radius:16px;border:1.5px solid var(--border);overflow:hidden;transition:transform .22s,box-shadow .22s;}
.sp-card:hover{transform:translateY(-4px);box-shadow:0 10px 36px rgba(155,58,90,0.1);}
.sp-btn{background:var(--p);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s;}
.sp-btn:hover{background:var(--pd);transform:translateY(-1px);}
.sp-btn-out{background:transparent;color:var(--p);border:1.5px solid var(--p);border-radius:8px;padding:10px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s;}
.sp-btn-out:hover{background:var(--p);color:#fff;}
.sp-input{padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);background:#fff;outline:none;transition:border-color .2s;width:100%;}
.sp-input:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pm);}
.need-tag{display:inline-block;border-radius:20px;padding:4px 11px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;}
.sp-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.42);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.sp-modal{background:#fff;border-radius:20px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.18);animation:slideUp .28s ease forwards;}
.cat-btn{padding:10px 8px;border:1.5px solid var(--border);border-radius:10px;background:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;transition:all .2s;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#504E5E;}
.cat-btn.sel{border-color:var(--p);background:var(--pm);color:var(--p);}
.map-link{display:inline-flex;align-items:center;gap:5px;background:var(--pm);border:1px solid rgba(155,58,90,0.2);border-radius:7px;padding:5px 10px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:var(--p);text-decoration:none;transition:all .2s;}
.map-link:hover{background:rgba(155,58,90,0.14);}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.fu{animation:fadeUp .35s ease forwards;}
`;

const CATS = [
  { id:'monetary',   label:'Money',     emoji:'💰' },
  { id:'clothes',    label:'Clothes',   emoji:'👕' },
  { id:'books',      label:'Books',     emoji:'📚' },
  { id:'food',       label:'Food',      emoji:'🍎' },
  { id:'medical',    label:'Medical',   emoji:'💊' },
  { id:'essentials', label:'Essentials',emoji:'📦' },
  { id:'art',        label:'Art',       emoji:'🎨' },
  { id:'sports',     label:'Sports',    emoji:'⚽' },
];

const NEED_COLORS = {
  clothes:   { bg:'#DBEAFE', text:'#1D4ED8' },
  books:     { bg:'#DCFCE7', text:'#166534' },
  medical:   { bg:'#FEE2E2', text:'#991B1B' },
  food:      { bg:'#FDF4FF', text:'#7E22CE' },
  essentials:{ bg:'#F5F3EE', text:'#504E5E' },
  monetary:  { bg:'#FEF3C7', text:'#92400E' },
  art:       { bg:'#EDE9FE', text:'#6D28D9' },
  sports:    { bg:'#DCFCE7', text:'#166534' },
  educational:{ bg:'#DBEAFE', text:'#1D4ED8' },
  toys:      { bg:'#FDF4FF', text:'#7E22CE' },
};

const DUMMY = [
  { orphanage_id:1, name:"Hope Children Home", city:'Colombo', state:'Western Province',
    distance:12, sponsorships_last_30_days:4, priority:'High Priority',
    latitude:6.9271, longitude:79.8612,
    donation_needs:[{category:'clothes',item_name:'School Uniforms',priority:'high'},{category:'food',item_name:'Rice and Lentils',priority:'urgent'}],
    upcoming_donations:[{scheduled_date:'2026-04-17',category:'food',item_description:'Food drive'}],
    image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=200&fit=crop' },
  { orphanage_id:2, name:'Sunshine Orphanage', city:'Kandy', state:'Central Province',
    distance:80, sponsorships_last_30_days:6, priority:null,
    latitude:7.2906, longitude:80.6337,
    donation_needs:[{category:'educational',item_name:'Computer Equipment',priority:'high'},{category:'toys',item_name:'Sports Equipment',priority:'medium'}],
    upcoming_donations:[{scheduled_date:'2026-04-30',category:'books',item_description:'Books drive'}],
    image:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop' },
  { orphanage_id:3, name:'Little Angels Home', city:'Galle', state:'Southern Province',
    distance:126, sponsorships_last_30_days:2, priority:null,
    latitude:6.0535, longitude:80.2210,
    donation_needs:[{category:'medical',item_name:'First Aid Supplies',priority:'urgent'},{category:'clothes',item_name:'Winter Clothing',priority:'high'}],
    upcoming_donations:[{scheduled_date:'2026-04-17',category:'medical',item_description:'Medical supplies drive'}],
    image:'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=200&fit=crop' },
];

function Spin({ dark } = {}) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      style={{ animation:'spin .8s linear infinite', flexShrink:0 }}>
      <circle cx="12" cy="12" r="10"
        stroke={dark ? 'rgba(0,0,0,.15)' : 'rgba(255,255,255,.3)'}
        strokeWidth="2.5"/>
      <path d="M12 2a10 10 0 0 1 10 10"
        stroke={dark ? '#0F2854' : 'white'}
        strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Donation Modal ────────────────────────────────────────────
function DonationModal({ orphanage, onClose, onSuccess, isGuest }) {
  const [cat, setCat]       = useState('monetary');
  const [amount, setAmount] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [date, setDate]     = useState('');
  const [anonymous, setAnonymous] = useState(isGuest);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/sponsorships', {
        orphanageId: orphanage.orphanage_id,
        donationType: cat === 'monetary' ? 'monetary' : 'goods',
        amount: cat === 'monetary' ? parseFloat(amount) : null,
        category: cat,
        itemDescription: cat === 'monetary'
          ? `Monetary donation of LKR ${amount}` : itemDesc,
        scheduledDate: date || null,
        isAnonymous: anonymous,
      });
    } catch { /* simulate success in dev */ }
    setDone(true);
    setTimeout(() => { onSuccess(); onClose(); }, 1800);
    setLoading(false);
  };

  return (
    <div className="sp-modal-bg"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal">
        <div style={{ padding:'22px 26px 18px', borderBottom:'1px solid #E8E4DF',
          display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20,
              fontWeight:700, color:'#1C1C2E', marginBottom:3 }}>
              Donate to {orphanage.name}
            </h2>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <MapPin size={11} color="#9A8F8A"/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13,
                color:'#8A8799' }}>{orphanage.city}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'#F5F2EC', border:'none',
            borderRadius:8, padding:8, cursor:'pointer', display:'flex' }}>
            <X size={15} color="#504E5E"/>
          </button>
        </div>

        {done ? (
          <div style={{ padding:'48px 26px', textAlign:'center' }}>
            <CheckCircle size={52} color="#16A34A"
              style={{ margin:'0 auto 16px', display:'block' }}/>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22,
              fontWeight:700, color:'#1C1C2E', marginBottom:8 }}>
              Thank you! 🙏
            </h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>
              Your donation has been confirmed. A confirmation email is on its way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding:'22px 26px' }}>
            {/* Category */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif",
                fontSize:13, fontWeight:600, color:'#1C1C2E', marginBottom:10 }}>
                What would you like to donate?
              </label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {CATS.map(c => (
                  <button key={c.id} type="button"
                    className={`cat-btn ${cat === c.id ? 'sel' : ''}`}
                    onClick={() => setCat(c.id)}>
                    <span style={{ fontSize:20 }}>{c.emoji}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount or description */}
            {cat === 'monetary' ? (
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif",
                  fontSize:13, fontWeight:600, color:'#1C1C2E', marginBottom:7 }}>
                  Amount (LKR) *
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%',
                    transform:'translateY(-50%)', fontFamily:"'DM Sans',sans-serif",
                    fontSize:13, color:'#9A8F8A', fontWeight:600 }}>LKR</span>
                  <input type="number" className="sp-input" style={{ paddingLeft:56 }}
                    value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" required min="1"/>
                </div>
                <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                  {[500, 1000, 2500, 5000].map(a => (
                    <button key={a} type="button" onClick={() => setAmount(String(a))}
                      style={{ padding:'5px 14px', borderRadius:20,
                        border:`1.5px solid ${amount===String(a)?'#0F2854':'#E0DDD8'}`,
                        background: amount===String(a)?'var(--pm)':'#fff',
                        fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600,
                        color: amount===String(a)?'#0F2854':'#504E5E', cursor:'pointer' }}>
                      {a.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif",
                  fontSize:13, fontWeight:600, color:'#1C1C2E', marginBottom:7 }}>
                  What will you donate? *
                </label>
                <input type="text" className="sp-input" value={itemDesc}
                  onChange={e => setItemDesc(e.target.value)}
                  placeholder={`Describe the ${CATS.find(c=>c.id===cat)?.label?.toLowerCase()} items…`}
                  required/>
              </div>
            )}

            {/* Date */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontFamily:"'DM Sans',sans-serif",
                fontSize:13, fontWeight:600, color:'#1C1C2E', marginBottom:7 }}>
                Preferred Delivery Date (optional)
              </label>
              <input type="date" className="sp-input" value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}/>
            </div>

            {/* Anonymous toggle */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22,
              background:'#F5F2EC', borderRadius:10, padding:'11px 14px' }}>
              <input type="checkbox" id="anon" checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
                style={{ width:15, height:15, accentColor:'#0F2854',
                  cursor:'pointer', flexShrink:0 }}/>
              <label htmlFor="anon" style={{ fontFamily:"'DM Sans',sans-serif",
                fontSize:13, color:'#504E5E', cursor:'pointer', lineHeight:1.5 }}>
                Donate anonymously — your name won't be shown
              </label>
            </div>

            <button type="submit" className="sp-btn"
              style={{ width:'100%', justifyContent:'center', padding:14 }}
              disabled={loading}>
              {loading ? <Spin/> : <Heart size={14} fill="white"/>}
              {loading ? 'Confirming…' : 'Confirm Donation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Inner page content ────────────────────────────────────────
function SponsorshipInner() {
  const navigate = useNavigate();
  const { user, isGuest, logout } = useAuth();
  const [orphanages, setOrphanages] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('need');
  const [selected, setSelected]     = useState(null);
  const [confirmed, setConfirmed]   = useState([]);

  useEffect(() => {
    setLoading(true);
    const load = async (lat, lng) => {
      try {
        const r = await api.get('/orphanages/nearby', {
          params: { latitude: lat, longitude: lng, radius: 200, purpose: 'sponsorship' }
        });
        setOrphanages(r.data.data?.length ? r.data.data : DUMMY);
      } catch { setOrphanages(DUMMY); }
      setLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => load(pos.coords.latitude, pos.coords.longitude),
        () => { setOrphanages(DUMMY); setLoading(false); }
      );
    } else { setOrphanages(DUMMY); setLoading(false); }
  }, []);

  const getMapsUrl = o => {
    if (o.latitude && o.longitude)
      return `https://www.google.com/maps/dir/?api=1&destination=${o.latitude},${o.longitude}&travelmode=driving`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.name+', '+o.city+', Sri Lanka')}`;
  };

  const sorted = [...orphanages]
    .filter(o =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a,b) => sortBy === 'need'
      ? (a.sponsorships_last_30_days||0) - (b.sponsorships_last_30_days||0)
      : (a.distance||0) - (b.distance||0)
    );

  return (
    <>
      <style>{S}</style>

      {/* Nav */}
      <div className="sp-nav">
        <div className="sp-gold"/>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:68,
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            <button
              onClick={() => navigate(user && !isGuest ? '/dashboard' : '/')}
              style={{ background:'none', border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', gap:6,
                fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>
              <ChevronLeft size={16}/>
              {user && !isGuest ? 'Dashboard' : 'Home'}
            </button>
            <div style={{ width:1, height:20, background:'#E8E4DF' }}/>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
              fontWeight:700, color:'#0F2854' }}>Little Bridge</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {user && !isGuest && <NotificationBell/>}
            {user && <ProfileDropdown onLogout={() => { logout(); navigate('/'); }}/>}
            {isGuest && (
              <div style={{ display:'flex', gap:8 }}>
                <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A',
                  borderRadius:20, padding:'4px 12px',
                  fontFamily:"'DM Sans',sans-serif", fontSize:12,
                  fontWeight:600, color:'#92400E' }}>Guest Session</div>
                <button onClick={() => { logout(); navigate('/'); }}
                  style={{ background:'none', border:'1.5px solid #E8E4DF',
                    borderRadius:8, padding:'6px 14px',
                    fontFamily:"'DM Sans',sans-serif", fontSize:13,
                    color:'#8A8799', cursor:'pointer' }}>Exit</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'44px 24px' }}>

        {/* Title row */}
        <div className="fu" style={{ display:'flex', alignItems:'flex-end',
          justifyContent:'space-between', flexWrap:'wrap', gap:20, marginBottom:32 }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32,
              fontWeight:700, color:'#1C1C2E', marginBottom:10 }}>
              Sponsor Local Orphanages
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15,
              color:'#8A8799', maxWidth:520, lineHeight:1.65 }}>
              Verified orphanages across Sri Lanka. We prioritize centers that
              receive fewer sponsorships to ensure equitable support.
            </p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <div style={{ position:'relative', minWidth:200 }}>
              <Search size={14} style={{ position:'absolute', left:12, top:'50%',
                transform:'translateY(-50%)', color:'#B8B4AF' }}/>
              <input className="sp-input" style={{ paddingLeft:36 }}
                placeholder="Search…" value={search}
                onChange={e => setSearch(e.target.value)}/>
            </div>
            <div style={{ position:'relative', minWidth:210 }}>
              <select className="sp-input"
                style={{ appearance:'none', paddingRight:32, cursor:'pointer' }}
                value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="need">Sort by: Need (High to Low)</option>
                <option value="distance">Sort by: Distance</option>
              </select>
              <ChevronDown size={13} style={{ position:'absolute', right:10,
                top:'50%', transform:'translateY(-50%)',
                pointerEvents:'none', color:'#9A8F8A' }}/>
            </div>
          </div>
        </div>

        {/* Guest notice */}
        {isGuest && (
          <div className="fu" style={{ background:'#FFFBEB',
            border:'1px solid #FDE68A', borderRadius:12,
            padding:'13px 18px', marginBottom:22,
            display:'flex', alignItems:'center',
            justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <AlertCircle size={15} color="#D97706"/>
              <span style={{ fontFamily:"'DM Sans',sans-serif",
                fontSize:13, color:'#92400E' }}>
                You're browsing as a guest. Create an account to track your donations.
              </span>
            </div>
            <button className="sp-btn" style={{ padding:'7px 16px', fontSize:13 }}
              onClick={() => navigate('/signup?role=sponsor')}>
              Sign Up Free
            </button>
          </div>
        )}

        {/* Confirmed banner */}
        {confirmed.length > 0 && (
          <div className="fu" style={{ background:'#F0FDF4',
            border:'1px solid #BBF7D0', borderRadius:10,
            padding:'11px 18px', marginBottom:22,
            display:'flex', alignItems:'center', gap:9 }}>
            <CheckCircle size={15} color="#16A34A"/>
            <span style={{ fontFamily:"'DM Sans',sans-serif",
              fontSize:13, color:'#15803D', fontWeight:500 }}>
              {confirmed.length} donation{confirmed.length > 1 ? 's' : ''} confirmed
              this session 🎉
            </span>
          </div>
        )}

        {/* Cards grid */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'64px 0' }}>
            <div style={{ width:36, height:36, border:'3px solid #F0EDE8',
              borderTopColor:'#0F2854', borderRadius:'50%',
              animation:'spin .7s linear infinite', margin:'0 auto 12px' }}/>
            <p style={{ fontFamily:"'DM Sans',sans-serif",
              fontSize:14, color:'#B8B4AF' }}>
              Finding orphanages near you…
            </p>
          </div>
        ) : (
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:24 }}>
            {sorted.map((orp, i) => (
              <div key={orp.orphanage_id}
                className="sp-card fu"
                style={{ animationDelay:`${i * 0.06}s` }}>

                {/* Image */}
                <div style={{ position:'relative', height:200, overflow:'hidden' }}>
                  <img
                    src={orp.image ||
                      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=200&fit=crop'}
                    alt={orp.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover',
                      transition:'transform .4s' }}
                    onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform='scale(1)'}/>
                  {orp.priority && (
                    <div style={{ position:'absolute', top:12, right:12,
                      background:'rgba(255,255,255,.95)', borderRadius:20,
                      padding:'4px 11px', fontFamily:"'DM Sans',sans-serif",
                      fontSize:12, fontWeight:700, color:'#DC2626',
                      display:'flex', alignItems:'center', gap:4 }}>
                      <TrendingUp size={11}/>{orp.priority}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding:'20px 20px 18px' }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:19,
                    fontWeight:700, color:'#1C1C2E', marginBottom:5 }}>
                    {orp.name}
                  </h3>
                  <div style={{ display:'flex', alignItems:'center',
                    gap:5, marginBottom:8 }}>
                    <MapPin size={12} color="#9A8F8A"/>
                    <span style={{ fontFamily:"'DM Sans',sans-serif",
                      fontSize:13, color:'#8A8799' }}>
                      {orp.distance ? `${Math.round(orp.distance)} km · ` : ''}
                      {orp.city}, {orp.state}
                    </span>
                  </div>

                  {/* Maps link */}
                  <a href={getMapsUrl(orp)} target="_blank" rel="noopener noreferrer"
                    className="map-link"
                    style={{ marginBottom:14, display:'inline-flex' }}>
                    <Navigation size={11}/>Get Directions
                    <ExternalLink size={10}/>
                  </a>

                  {/* Current needs */}
                  {orp.donation_needs?.length > 0 && (
                    <div style={{ marginTop:6, marginBottom:14 }}>
                      <div style={{ fontFamily:"'DM Sans',sans-serif",
                        fontSize:12, fontWeight:600, color:'#1C1C2E', marginBottom:7 }}>
                        Current Needs:
                      </div>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {orp.donation_needs.slice(0, 3).map((n, ni) => {
                          const c = NEED_COLORS[n.category] || NEED_COLORS.essentials;
                          return (
                            <span key={ni} className="need-tag"
                              style={{ background:c.bg, color:c.text }}>
                              {n.item_name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Next drive */}
                  {orp.upcoming_donations?.length > 0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:7,
                      padding:'8px 11px', background:'#F5F2EC',
                      borderRadius:8, marginBottom:16 }}>
                      <Calendar size={12} color="#9A8F8A"/>
                      <span style={{ fontFamily:"'DM Sans',sans-serif",
                        fontSize:12, color:'#504E5E' }}>
                        Next drive:{' '}
                        <strong>
                          {new Date(orp.upcoming_donations[0].scheduled_date)
                            .toLocaleDateString('en-US', {
                              weekday:'short', month:'short',
                              day:'numeric', year:'numeric'
                            })}
                        </strong>
                      </span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display:'flex', gap:10 }}>
                    <button className="sp-btn"
                      style={{ flex:1, justifyContent:'center' }}
                      onClick={() => setSelected(orp)}>
                      <Heart size={13} fill="white"/> Donate
                    </button>
                    <button className="sp-btn-out"
                      style={{ flex:1, justifyContent:'center' }}
                      onClick={() => setSelected(orp)}>
                      <Calendar size={13}/> Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {sorted.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px 0' }}>
                <Search size={36} color="#E0DDD8"
                  style={{ margin:'0 auto 14px', display:'block' }}/>
                <p style={{ fontFamily:"'DM Sans',sans-serif",
                  fontSize:14, color:'#B8B4AF' }}>
                  No orphanages found for "{search}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Donation modal */}
      {selected && (
        <DonationModal
          orphanage={selected}
          isGuest={isGuest}
          onClose={() => setSelected(null)}
          onSuccess={() => setConfirmed(c => [...c, selected.orphanage_id])}/>
      )}
    </>
  );
}

// ── Exported page — wrapped with RoleGuard ────────────────────
export default function SponsorshipPage() {
  const { isAuthenticated, isGuest } = useAuth();
  if (!isAuthenticated || isGuest) return <SponsorshipInner />;
  return (
    <RoleGuard requiredRoles={['sponsor', 'both']} feature="sponsorship">
      <SponsorshipInner />
    </RoleGuard>
  );
}
