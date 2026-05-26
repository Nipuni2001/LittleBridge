import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleGuard from '../../components/RoleGuard';
import api from '../../services/api';
import NotificationBell from '../../components/NotificationBell';
import ProfileDropdown from '../../components/ProfileDropdown';
import {
  MapPin, Search, Phone, Users, ArrowRight,
  Home, ChevronLeft, CheckCircle, Clock, FileText,
  Heart, Navigation, ExternalLink, AlertCircle
} from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.disc-page{min-height:100vh;background:#FAFAF8;font-family:'DM Sans',sans-serif;}
.disc-nav{background:#fff;border-bottom:1px solid #E8E4DF;position:sticky;top:0;z-index:50;}
.disc-gold{height:3px;background:linear-gradient(90deg,#C8963E,#E8B96B,#C8963E);}
.disc-card{background:#fff;border-radius:16px;border:1.5px solid #E8E4DF;overflow:hidden;transition:transform .22s,box-shadow .22s;}
.disc-card:hover{transform:translateY(-4px);box-shadow:0 10px 36px rgba(155,58,90,0.1);}
.disc-btn{background:#0F2854;color:#fff;border:none;border-radius:8px;padding:11px 22px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s;width:100%;justify-content:center;}
.disc-btn:hover{background:#7A2444;}
.disc-btn:disabled{opacity:.5;cursor:not-allowed;}
.disc-input{padding:12px 16px 12px 42px;border:1.5px solid #E0DDD8;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:#1C1C2E;background:#fff;outline:none;transition:border-color .2s;width:100%;}
.disc-input:focus{border-color:#0F2854;box-shadow:0 0 0 3px rgba(155,58,90,0.08);}
.map-link{display:inline-flex;align-items:center;gap:5px;background:rgba(155,58,90,0.07);border:1px solid rgba(155,58,90,0.18);border-radius:7px;padding:5px 11px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#0F2854;text-decoration:none;transition:all .2s;}
.map-link:hover{background:rgba(155,58,90,0.13);}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .35s ease forwards;}
`;

const DUMMY_ORPHANAGES = [
  { orphanage_id:1, name:"Samanala Children's Home", city:'Kandy', state:'Central Province', address:'42 Temple Road, Kandy', phone:'+94 81 234 5678', capacity:45, description:'A nurturing home for children aged 2-16, providing education and emotional support since 1998.', distance:12, latitude:7.2906, longitude:80.6337 },
  { orphanage_id:2, name:'Piyasa Care Center', city:'Colombo', state:'Western Province', address:'18 Galle Road, Colombo 3', phone:'+94 11 456 7890', capacity:30, description:'Urban care center focused on rehabilitation and educational support for vulnerable children.', distance:25, latitude:6.9271, longitude:79.8612 },
  { orphanage_id:3, name:'Arunalu Youth Haven', city:'Galle', state:'Southern Province', address:'7 Fort Street, Galle', phone:'+94 91 222 3344', capacity:60, description:'Coastal haven providing holistic development programs for children and young adults.', distance:40, latitude:6.0535, longitude:80.2210 },
  { orphanage_id:4, name:"Serenity Children's Village", city:'Negombo', state:'Western Province', address:'23 Sea Street, Negombo', phone:'+94 31 223 4455', capacity:50, description:'Family-model village concept providing a home environment for children in need.', distance:18, latitude:7.2093, longitude:79.8358 },
];

function DiscoverContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orphanages, setOrphanages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [initiating, setInitiating] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await api.get('/orphanages/nearby', {
              params: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, radius: 100, purpose: 'adoption' }
            });
            setOrphanages(res.data.data?.length ? res.data.data : DUMMY_ORPHANAGES);
          } catch { setOrphanages(DUMMY_ORPHANAGES); }
          setLoading(false);
        },
        () => { setLocError('Location access denied — showing all orphanages.'); setOrphanages(DUMMY_ORPHANAGES); setLoading(false); }
      );
    } else { setOrphanages(DUMMY_ORPHANAGES); setLoading(false); }
  }, []);

  const handleInitiate = async (orphanageId) => {
    setInitiating(orphanageId);
    try {
      const res = await api.post('/adoptions/initiate', { orphanageId });
      setSuccessId(orphanageId);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('already have')) {
        const appId = err.response?.data?.applicationId;
        if (appId) { navigate(`/adoption/details/${appId}`); return; }
        setSuccessId(orphanageId);
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } finally { setInitiating(null); }
  };

  const filtered = orphanages.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase())
  );

  const getMapsUrl = (o) => {
    if (o.latitude && o.longitude) return `https://www.google.com/maps/dir/?api=1&destination=${o.latitude},${o.longitude}&travelmode=driving`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.name + ', ' + o.city + ', Sri Lanka')}`;
  };

  return (
    <>
      <style>{S}</style>
      <div className="disc-page">
        <div className="disc-nav">
          <div className="disc-gold"/>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:18 }}>
              <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>
                <ChevronLeft size={16}/> Dashboard
              </button>
              <div style={{ width:1, height:20, background:'#E8E4DF' }}/>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0F2854' }}>Little Bridge</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <NotificationBell/>
              <ProfileDropdown onLogout={() => { logout(); navigate('/'); }}/>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'44px 24px' }}>
          <div className="fu" style={{ marginBottom:36 }}>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#1C1C2E', marginBottom:8 }}>Find an Orphanage</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>
              Verified orphanages near you — click Begin Adoption to start your journey
            </p>
            {locError && (
              <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'9px 14px', display:'flex', gap:7, alignItems:'center', marginTop:12 }}>
                <AlertCircle size={13} color="#D97706"/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#92400E' }}>{locError}</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ position:'relative', maxWidth:440, marginBottom:36 }}>
            <Search size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#B8B4AF' }}/>
            <input className="disc-input" placeholder="Search by name or city…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          {/* Process banner */}
          <div style={{ background:'linear-gradient(135deg,#0F2854,#7A2444)', borderRadius:16, padding:'22px 28px', marginBottom:36, display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:18 }}>
            {[
              { icon:<FileText size={16} color="rgba(255,255,255,.7)"/>, label:'Document Prep', sub:'2–4 weeks' },
              { icon:<CheckCircle size={16} color="rgba(255,255,255,.7)"/>, label:'Background Check', sub:'4–6 weeks' },
              { icon:<Home size={16} color="rgba(255,255,255,.7)"/>, label:'Home Study', sub:'6–8 weeks' },
              { icon:<Clock size={16} color="rgba(255,255,255,.7)"/>, label:'Legal Review', sub:'8–12 weeks' },
              { icon:<Heart size={16} color="rgba(255,255,255,.7)" fill="rgba(255,255,255,.7)"/>, label:'Placement', sub:'~6 months' },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, background:'rgba(255,255,255,.12)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#fff' }}>{label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.5)' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={{ textAlign:'center', padding:'64px 0' }}>
              <div style={{ width:36, height:36, border:'3px solid #F0EDE8', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }}/>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#B8B4AF' }}>Finding orphanages near you…</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:22 }}>
              {filtered.map((orp, i) => (
                <div key={orp.orphanage_id} className="disc-card fu" style={{ animationDelay:`${i*.06}s` }}>
                  <div style={{ background:'linear-gradient(135deg,#F5F2EC,#EDE8E0)', padding:'22px 22px 18px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div style={{ width:46, height:46, background:'#0F2854', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Home size={20} color="white"/>
                      </div>
                      {orp.distance && (
                        <span style={{ background:'#fff', borderRadius:20, padding:'3px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#0F2854', display:'flex', alignItems:'center', gap:4 }}>
                          <MapPin size={10}/> {Math.round(orp.distance)} km
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1C1C2E', marginBottom:4 }}>{orp.name}</h3>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:8 }}>
                      <MapPin size={11} color="#9A8F8A"/>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A8799' }}>{orp.city}, {orp.state}</span>
                    </div>
                    {/* Google Maps link */}
                    <a href={getMapsUrl(orp)} target="_blank" rel="noopener noreferrer" className="map-link">
                      <Navigation size={11}/>
                      Get Directions
                      <ExternalLink size={10}/>
                    </a>
                  </div>

                  <div style={{ padding:'18px 22px 20px' }}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#504E5E', lineHeight:1.7, marginBottom:16 }}>{orp.description}</p>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                      {orp.capacity && (
                        <div style={{ background:'#F5F2EC', borderRadius:8, padding:'9px 11px' }}>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#B8B4AF', marginBottom:2 }}>Capacity</div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:'#1C1C2E', display:'flex', alignItems:'center', gap:4 }}>
                            <Users size={12} color="#0F2854"/>{orp.capacity} children
                          </div>
                        </div>
                      )}
                      {orp.phone && (
                        <div style={{ background:'#F5F2EC', borderRadius:8, padding:'9px 11px' }}>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#B8B4AF', marginBottom:2 }}>Phone</div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, color:'#1C1C2E' }}>{orp.phone}</div>
                        </div>
                      )}
                    </div>

                    {successId === orp.orphanage_id ? (
                      <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, padding:'11px 14px', display:'flex', alignItems:'center', gap:8 }}>
                        <CheckCircle size={15} color="#16A34A"/>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#15803D', fontWeight:600 }}>Application started! Redirecting…</span>
                      </div>
                    ) : (
                      <button className="disc-btn" onClick={() => handleInitiate(orp.orphanage_id)} disabled={initiating === orp.orphanage_id}>
                        {initiating === orp.orphanage_id
                          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>Starting…</>
                          : <>Begin Adoption Process<ArrowRight size={13}/></>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px 0' }}>
                  <Search size={36} color="#E0DDD8" style={{ margin:'0 auto 14px', display:'block' }}/>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#B8B4AF' }}>No orphanages found for "{search}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdoptionDiscover() {
  return (
    <RoleGuard requiredRoles={['adopter', 'both']} feature="adoption">
      <DiscoverContent />
    </RoleGuard>
  );
}
