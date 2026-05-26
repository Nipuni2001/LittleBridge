import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MapPin, Search, Phone, Mail, Heart, Home, ChevronDown, ChevronLeft, Users, Calendar, ArrowRight } from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.op-page{min-height:100vh;background:#FAFAF9;font-family:'Inter',sans-serif;}
.op-header{background:#fff;border-bottom:1px solid #EDEAE4;position:sticky;top:0;z-index:50;}
.op-gold-bar{height:3px;background:linear-gradient(90deg,#C8963E,#E8B96B,#C8963E);}
.op-card{background:#fff;border-radius:16px;border:1.5px solid #EDEAE4;overflow:hidden;transition:transform .25s,box-shadow .25s;}
.op-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(123,29,58,.1);}
.op-btn{background:#1C4D8D;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px;}
.op-btn:hover{background:#5E1529;}
.op-btn-ghost{background:transparent;color:#1C4D8D;border:1.5px solid #1C4D8D;border-radius:8px;padding:10px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px;}
.op-btn-ghost:hover{background:#1C4D8D;color:#fff;}
.op-input{padding:11px 16px 11px 40px;border:1.5px solid #E0DDD8;border-radius:10px;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A2E;background:#fff;outline:none;transition:border-color .2s;width:100%;}
.op-input:focus{border-color:#1C4D8D;box-shadow:0 0 0 3px rgba(123,29,58,.08);}
.dot-pattern{background-image:radial-gradient(circle,#D1C9C0 1px,transparent 1px);background-size:24px 24px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .4s ease forwards;}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const DUMMY = [
  { orphanage_id:1, name:"Samanala Children's Home", city:'Kandy', state:'Central Province', phone:'+94 81 234 5678', email:'samanala@childrens.lk', capacity:45, description:'A nurturing home for children aged 2–16, providing education and emotional support since 1998.', image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=220&fit=crop', total_sponsorships:12 },
  { orphanage_id:2, name:'Piyasa Care Center', city:'Colombo', state:'Western Province', phone:'+94 11 456 7890', email:'info@piyasa.lk', capacity:30, description:'Urban care center focused on rehabilitation and educational support for vulnerable children.', image:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=220&fit=crop', total_sponsorships:28 },
  { orphanage_id:3, name:'Arunalu Youth Haven', city:'Galle', state:'Southern Province', phone:'+94 91 222 3344', email:'arunalu@youth.lk', capacity:60, description:'Coastal haven providing holistic development programs for children and young adults.', image:'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=220&fit=crop', total_sponsorships:7 },
  { orphanage_id:4, name:"Serenity Children's Village", city:'Negombo', state:'Western Province', phone:'+94 31 223 4455', email:'serenity@village.lk', capacity:50, description:'Family-model village concept providing a home environment for children in need.', image:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=220&fit=crop', total_sponsorships:15 },
  { orphanage_id:5, name:'Rainbow Home', city:'Matara', state:'Southern Province', phone:'+94 41 222 5566', email:'rainbow@home.lk', capacity:35, description:'Specialized in early childhood care and development for children under 10.', image:'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=220&fit=crop', total_sponsorships:4 },
  { orphanage_id:6, name:'Hope Springs Center', city:'Jaffna', state:'Northern Province', phone:'+94 21 234 6677', email:'hope@springs.lk', capacity:40, description:'Providing support and education for children affected by conflict in the Northern Province.', image:'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&h=220&fit=crop', total_sponsorships:9 },
];

export default function OrphanagesPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [orphanages, setOrphanages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => {
    api.get('/orphanages/search')
      .then(r => setOrphanages(r.data.data?.length ? r.data.data : DUMMY))
      .catch(() => setOrphanages(DUMMY))
      .finally(() => setLoading(false));
  }, []);

  const cities = ['all', ...new Set(orphanages.map(o => o.city))];

  const filtered = orphanages.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.city.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === 'all' || o.city === cityFilter;
    return matchSearch && matchCity;
  });

  return (
    <>
      <style>{S}</style>
      <div className="op-page">

        {/* Navbar */}
        <div className="op-header">
          <div className="op-gold-bar" />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#7A7585', fontFamily: "'Inter',sans-serif", fontSize: 14 }}>
                <ChevronLeft size={16} /> Home
              </button>
              <div style={{ width: 1, height: 20, background: '#EDEAE4' }} />
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#1C4D8D' }}>Little Bridge</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isAuthenticated ? (
                <>
                  <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: '1.5px solid #EDEAE4', borderRadius: 8, padding: '7px 16px', fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#555566', cursor: 'pointer' }}>
                    Dashboard
                  </button>
                  <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: '1.5px solid #EDEAE4', borderRadius: 8, padding: '7px 16px', fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#555566', cursor: 'pointer' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: '#1C4D8D', cursor: 'pointer' }}>Login</button>
                  <button className="op-btn" onClick={() => navigate('/signup')}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hero banner */}
        <div className="dot-pattern" style={{ background: '#F5F3EE', padding: '64px 24px 56px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', background: 'rgba(200,150,62,.15)', border: '1px solid rgba(200,150,62,.3)', borderRadius: 20, padding: '5px 18px', fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#7B5A14', fontWeight: 500, marginBottom: 20 }}>
              Verified Orphanages
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 14 }}>
              All Orphanages in Sri Lanka
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: '#7A7585', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
              Every orphanage listed here has been verified and approved. Browse, learn about their needs, and make a difference.
            </p>

            {/* Search + filter row */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 600, margin: '0 auto' }}>
              <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
                <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9A8F8A' }} />
                <input className="op-input" placeholder="Search by name or city…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div style={{ position: 'relative', flex: 1, minWidth: 140 }}>
                <select className="op-input" style={{ paddingLeft: 14, paddingRight: 32, appearance: 'none', cursor: 'pointer' }}
                  value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
                  {cities.map(c => <option key={c} value={c}>{c === 'all' ? 'All Cities' : c}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9A8F8A' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#7A7585' }}>
              Showing <strong style={{ color: '#1A1A2E' }}>{filtered.length}</strong> orphanage{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin .8s linear infinite', margin: '0 auto' }}>
                <circle cx="12" cy="12" r="10" stroke="#E0DDD8" strokeWidth="2.5" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#1C4D8D" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 28 }}>
              {filtered.map((orp, i) => (
                <div key={orp.orphanage_id} className="op-card fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img src={orp.image} alt={orp.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#fff', borderRadius: 20, padding: '4px 12px', fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: '#1C4D8D' }}>
                      ✓ Verified
                    </div>
                  </div>

                  <div style={{ padding: '22px 20px 20px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: '#1A1A2E', marginBottom: 5 }}>{orp.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
                      <MapPin size={12} color="#9A8F8A" />
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#7A7585' }}>{orp.city}, {orp.state}</span>
                    </div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#555566', lineHeight: 1.7, marginBottom: 16 }}>
                      {orp.description}
                    </p>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                      {orp.capacity && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Users size={13} color="#C8963E" />
                          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#7A7585' }}>{orp.capacity} children</span>
                        </div>
                      )}
                      {orp.total_sponsorships !== undefined && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Heart size={13} color="#C8963E" />
                          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#7A7585' }}>{orp.total_sponsorships} sponsorships</span>
                        </div>
                      )}
                    </div>

                    {orp.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Phone size={12} color="#9A8F8A" />
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#7A7585' }}>{orp.phone}</span>
                      </div>
                    )}
                    {orp.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
                        <Mail size={12} color="#9A8F8A" />
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#7A7585' }}>{orp.email}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="op-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/sponsorship')}>
                        <Heart size={13} fill="white" /> Donate
                      </button>
                      <button className="op-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/sponsorship')}>
                        <Calendar size={13} /> Book Visit
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0' }}>
                  <Search size={40} color="#E0DDD8" style={{ margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#9A8F8A' }}>No orphanages found for "{search}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
