import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, Heart, Eye, Zap, Shield, MapPin, Mail, Phone, Calendar,
  ArrowRight, CheckCircle, TrendingUp, Menu, X, ChevronDown
} from 'lucide-react';
import api from '../services/api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sortBy, setSortBy] = useState('Need (High to Low)');

  // ── Contact form state ─────────────────────────────────────
  const [contactForm, setContactForm] = useState({
    firstName: '', lastName: '', email: '', interest: 'Adoption Process', message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactDone, setContactDone] = useState(false);
  const [contactError, setContactError] = useState('');

  const setField = (k, v) => {
    setContactForm(p => ({ ...p, [k]: v }));
    setContactError('');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.firstName || !contactForm.email || !contactForm.message) {
      setContactError('Please fill in all required fields.');
      return;
    }
    setContactLoading(true);
    setContactError('');
    try {
      await api.post('/contact', {
        firstName: contactForm.firstName,
        lastName:  contactForm.lastName,
        email:     contactForm.email,
        interest:  contactForm.interest,
        message:   contactForm.message,
      });
      setContactDone(true);
    } catch (err) {
      setContactError(err.response?.data?.message || 'Failed to send. Please try again.');
    }
    setContactLoading(false);
  };
  // ──────────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── mock orphanage data ──
  const orphanages = [
    {
      id: 1,
      name: "Samanala Children's Home",
      distance: '12 km away',
      city: 'Kandy, Central Province',
      needs: ['Winter Clothes', 'School Books'],
      needColors: ['#DBEAFE', '#DCFCE7'],
      needTextColors: ['#1D4ED8', '#166534'],
      nextDrive: 'Friday, Jan 16, 2026',
      priority: 'High Priority',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=250&fit=crop',
    },
    {
      id: 2,
      name: 'Piyasa Care Center',
      distance: '25 km away',
      city: 'Colombo, Western Province',
      needs: ['Essential Medicines', 'Bedding'],
      needColors: ['#FEE2E2', '#FEF3C7'],
      needTextColors: ['#991B1B', '#92400E'],
      nextDrive: 'Monday, Jan 19, 2026',
      priority: null,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
    },
    {
      id: 3,
      name: 'Arunalu Youth Haven',
      distance: '40 km away',
      city: 'Galle, Southern Province',
      needs: ['Art Supplies', 'Sports Equipment'],
      needColors: ['#FEF9C3', '#DCFCE7'],
      needTextColors: ['#713F12', '#166534'],
      nextDrive: 'Wed, Jan 21, 2026',
      priority: null,
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop',
    },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", backgroundColor: '#FFFFFF', color: '#1A1A2E' }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }

        .lb-nav-link { font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500; color: #1A1A2E; text-decoration: none; transition: color 0.2s; }
        .lb-nav-link:hover { color: #1C4D8D; }

        .lb-btn-primary { background: #1C4D8D; color: #fff; border: none; border-radius: 6px; padding: 10px 24px; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; display: inline-flex; align-items: center; gap: 8px; }
        .lb-btn-primary:hover { background: #5E1529; transform: translateY(-1px); }

        .lb-btn-outline { background: transparent; color: #1C4D8D; border: 2px solid #1C4D8D; border-radius: 6px; padding: 10px 24px; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .lb-btn-outline:hover { background: #1C4D8D; color: #fff; transform: translateY(-1px); }

        .lb-btn-login { background: transparent; color: #1C4D8D; border: none; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; padding: 10px 16px; transition: color 0.2s; }
        .lb-btn-login:hover { color: #5E1529; }

        .dot-pattern { background-image: radial-gradient(circle, #D1C9C0 1px, transparent 1px); background-size: 24px 24px; }

        .feature-card { background: #F5F3EE; border-radius: 16px; padding: 40px 32px; text-align: center; transition: transform 0.25s, box-shadow 0.25s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }

        .timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #f5c6d0, #e8a0b0); transform: translateX(-50%); }
        .timeline-dot { width: 40px; height: 40px; background: #1C4D8D; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 16px; position: absolute; left: 50%; transform: translateX(-50%); z-index: 2; box-shadow: 0 0 0 4px #fff, 0 0 0 6px #f5c6d0; }
        .timeline-card { background: #fff; border-radius: 12px; padding: 28px 24px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); width: calc(50% - 60px); }

        .orphanage-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); transition: transform 0.25s, box-shadow 0.25s; }
        .orphanage-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(123,29,58,0.12); }

        .need-tag { display: inline-block; border-radius: 20px; padding: 4px 12px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; }

        .contact-icon-wrap { width: 44px; height: 44px; background: #F5F3EE; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .lb-form-input { width: 100%; padding: 12px 16px; border: 1.5px solid #E0DDD8; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; color: #1A1A2E; background: #FAFAF9; outline: none; transition: border-color 0.2s; }
        .lb-form-input:focus { border-color: #1C4D8D; background: #fff; }
        .lb-form-input::placeholder { color: #B0ADA8; }

        .lb-footer-link { font-family: 'Inter', sans-serif; font-size: 14px; color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s; display: block; margin-bottom: 10px; }
        .lb-footer-link:hover { color: #C8963E; }

        @media (max-width: 768px) {
          .timeline-line { left: 32px; }
          .timeline-dot { left: 32px; }
          .timeline-card { width: calc(100% - 80px); margin-left: 70px !important; margin-right: 0 !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .orphanages-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #EDEAE4', boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none', transition: 'box-shadow 0.3s' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #C8963E, #E8B96B, #C8963E)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 40, height: 40, background: '#1C4D8D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 4 15 4 9C4 6.79 5.79 5 8 5C9.5 5 10.8 5.8 11.5 7C12.2 5.8 13.5 5 15 5C17.21 5 19 6.79 19 9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M7 16C7 16 9 18 12 21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="17" cy="15" r="4" stroke="white" strokeWidth="1.8"/>
                <path d="M15.5 15L16.5 16L18.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1C4D8D', letterSpacing: '-0.3px' }}>
              Little Bridge
            </span>
          </div>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            <a href="#home" className="lb-nav-link">Home</a>
            <a href="#mission" className="lb-nav-link">Our Mission</a>
            <a href="#how-it-works" className="lb-nav-link">How it Works</a>
            <a href="#orphanages" className="lb-nav-link">Orphanages</a>
          </div>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="lb-btn-login" onClick={() => navigate('/login')}>Login</button>
            <button className="lb-btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>

          <button className="mobile-menu-btn" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} color="#1C4D8D" /> : <Menu size={24} color="#1C4D8D" />}
          </button>
        </div>

        {mobileOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #EDEAE4', padding: '16px 24px 24px' }}>
            {['#home', '#mission', '#how-it-works', '#orphanages'].map((href, i) => (
              <a key={href} href={href} className="lb-nav-link" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #F0EDE8' }} onClick={() => setMobileOpen(false)}>
                {['Home', 'Our Mission', 'How it Works', 'Orphanages'][i]}
              </a>
            ))}
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button className="lb-btn-login" onClick={() => navigate('/login')}>Login</button>
              <button className="lb-btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section id="home" className="dot-pattern" style={{ padding: '80px 24px 100px', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(200,150,62,0.12)', border: '1px solid rgba(200,150,62,0.3)', borderRadius: 20, padding: '6px 16px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8B6914', fontStyle: 'italic', marginBottom: 24 }}>
                Digitalizing the Adoption Journey in Sri Lanka
              </div>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 5vw, 62px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1A2E', marginBottom: 24, letterSpacing: '-0.5px' }}>
                Every Child<br />Deserves a{' '}
                <span style={{ color: '#1C4D8D', fontStyle: 'italic' }}>Loving<br />Home.</span>
              </h1>

              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: '#555566', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                We streamline the adoption and sponsorship process, connecting loving parents and generous sponsors with orphanages. Track your journey with transparency and ease.
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                <button className="lb-btn-primary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/signup?role=adopter')}>
                  <Home size={18} />Start Adoption
                </button>
                <button className="lb-btn-outline" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/signup?role=sponsor')}>
                  <Heart size={18} />Sponsor a Child
                </button>
              </div>

              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8A8799', fontStyle: 'italic' }}>
                Sponsors can proceed as guests or sign up for tracking.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, bottom: -20, left: 20, background: 'rgba(200,150,62,0.08)', borderRadius: 20, border: '2px dashed rgba(200,150,62,0.25)' }} />
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 60px rgba(123,29,58,0.15)', border: '4px solid #fff' }}>
                <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=600&h=480&fit=crop&crop=faces" alt="Happy family" style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(123,29,58,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={20} color="#1C4D8D" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#8A8799', marginBottom: 2 }}>Verified Orphanages</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1A1A2E' }}>150+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ MISSION ══════════════════════════════════ */}
      <section id="mission" style={{ background: '#FFFFFF', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#1C4D8D', textTransform: 'uppercase' }}>WHY WE EXIST</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, textAlign: 'center', color: '#1A1A2E', lineHeight: 1.2, maxWidth: 700, margin: '0 auto 16px' }}>
            Technology Should Support Connection — Not Slow It Down.
          </h2>
          <div style={{ width: 60, height: 3, background: '#C8963E', margin: '0 auto 32px', borderRadius: 2 }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: '#555566', textAlign: 'center', lineHeight: 1.75, maxWidth: 640, margin: '0 auto 72px' }}>
            At Little Bridge, we cut through the red tape of traditional adoption and sponsorship in Sri Lanka. We provide clarity, speed, and accountability, ensuring every child finds support faster.
          </p>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: <Eye size={28} color="#1C4D8D" />, title: 'Transparency', desc: 'Clear timelines, realistic expectations, and zero hidden processes. Track every step of your adoption journey.' },
              { icon: <Zap size={28} color="#1C4D8D" />, title: 'Efficiency', desc: "Digital document handling and automated tracking so decisions don't stall and children don't wait." },
              { icon: <Shield size={28} color="#1C4D8D" />, title: 'Security-Driven', desc: 'State-of-the-art encryption ensures all sensitive family and child data is protected throughout the process.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div style={{ width: 64, height: 64, background: 'rgba(200,150,62,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  {icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>{title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#555566', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ HOW IT WORKS ══════════════════════════════════ */}
      <section id="how-it-works" style={{ background: '#F5F3EE', padding: '96px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ display: 'inline-block', background: 'rgba(200,150,62,0.15)', border: '1px solid rgba(200,150,62,0.3)', borderRadius: 20, padding: '5px 18px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#7B5A14', fontWeight: 500 }}>The Journey</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, textAlign: 'center', color: '#1A1A2E', marginBottom: 12 }}>Your Path to Parenthood</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#555566', textAlign: 'center', marginBottom: 72 }}>We provide a clear, trackable timeline for the entire adoption process.</p>

          <div style={{ position: 'relative', paddingBottom: 40 }}>
            <div className="timeline-line" />
            {/* Step 1 */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 64, position: 'relative', paddingTop: 20 }}>
              <div className="timeline-dot" style={{ top: 20 }}>1</div>
              <div className="timeline-card" style={{ marginRight: 'auto' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 10 }}>Registration &amp; Geolocation</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555566', lineHeight: 1.7, marginBottom: 16 }}>Sign up and allow location access to discover verified orphanages near you.</p>
                <div style={{ background: '#F5F3EE', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={16} color="#1C4D8D" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555566' }}>Find nearest centers</span>
                </div>
              </div>
            </div>
            {/* Step 2 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 64, position: 'relative', paddingTop: 20 }}>
              <div className="timeline-dot" style={{ top: 20 }}>2</div>
              <div className="timeline-card" style={{ marginLeft: 'auto' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 10 }}>Document Preparation</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555566', lineHeight: 1.7, marginBottom: 16 }}>Review the required documentation checklist specific to your region and selected orphanage.</p>
                {['Identity Proof', 'Financial Statements', 'Background Checks'].map(doc => (
                  <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <CheckCircle size={14} color="#16A34A" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555566' }}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Step 3 */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', position: 'relative', paddingTop: 20 }}>
              <div className="timeline-dot" style={{ top: 20 }}>3</div>
              <div className="timeline-card" style={{ marginRight: 'auto' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 10 }}>System Tracking</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555566', lineHeight: 1.7, marginBottom: 16 }}>Once documents are submitted, our system automatically tracks the duration and updates your timeline.</p>
                <div style={{ background: '#E8E4DE', borderRadius: 4, height: 8, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: '55%', height: '100%', background: '#1C4D8D', borderRadius: 4 }} />
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#8A8799', textAlign: 'right' }}>Estimated Time: 6–8 Months</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <button className="lb-btn-primary" style={{ fontSize: 16, padding: '14px 36px' }} onClick={() => navigate('/signup?role=adopter')}>
              View Detailed Documentation Guide
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ ORPHANAGES ══════════════════════════════════ */}
      <section id="orphanages" className="dot-pattern" style={{ background: '#FAFAF9', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>Sponsor Local Orphanages</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#555566', lineHeight: 1.7, maxWidth: 520 }}>Discover verified orphanages across Sri Lanka. We prioritize centers that receive fewer sponsorships to ensure equitable support.</p>
            </div>
            <div style={{ position: 'relative' }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ appearance: 'none', background: '#fff', border: '1.5px solid #E0DDD8', borderRadius: 8, padding: '10px 40px 10px 16px', fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#1A1A2E', cursor: 'pointer', width: 'auto' }}>
                <option>Sort by: Need (High to Low)</option>
                <option>Sort by: Distance</option>
                <option>Sort by: Last Sponsored</option>
              </select>
              <ChevronDown size={16} color="#8A8799" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div className="orphanages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginBottom: 48 }}>
            {orphanages.map((orp) => (
              <div key={orp.id} className="orphanage-card">
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <img src={orp.image} alt={orp.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  {orp.priority && (
                    <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: '#DC2626' }}>
                      <TrendingUp size={12} />{orp.priority}
                    </div>
                  )}
                </div>
                <div style={{ padding: '24px 20px 20px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{orp.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20 }}>
                    <MapPin size={13} color="#1C4D8D" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8A8799' }}>{orp.distance} • {orp.city}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 8 }}>Current Needs:</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {orp.needs.map((need, i) => (
                        <span key={need} className="need-tag" style={{ background: orp.needColors[i], color: orp.needTextColors[i] }}>{need}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#F5F3EE', borderRadius: 8, marginBottom: 20 }}>
                    <Calendar size={13} color="#8A8799" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#555566' }}>
                      Next donation drive: <strong>{orp.nextDrive}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="lb-btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }} onClick={() => navigate('/sponsorship')}>Donate</button>
                    <button className="lb-btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '10px' }} onClick={() => navigate('/sponsorship')}>Book Visit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/orphanages')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C4D8D', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'gap 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.gap = '12px'}
              onMouseLeave={e => e.currentTarget.style.gap = '8px'}>
              View All Locations <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ LEADERSHIP QUOTE ══════════════════════════════════ */}
      <section style={{ background: '#F5F3EE', padding: '96px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(200,150,62,0.15)', border: '1px solid rgba(200,150,62,0.3)', borderRadius: 20, padding: '5px 18px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#7B5A14', fontWeight: 500, marginBottom: 28 }}>Leadership</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 16, lineHeight: 1.2 }}>Built for Families. Designed for Care.</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#555566', lineHeight: 1.75, marginBottom: 48 }}>
            Little Bridge was created to eliminate the common pain points of adoption and sponsorship in Sri Lanka—slow follow-up, inconsistent communication, and unclear next steps.
          </p>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <img src="/nipuni.png"
     alt="Nipuni Niwarthana - Founder"
     style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontStyle: 'italic', color: '#1A1A2E', lineHeight: 1.8, marginBottom: 20 }}>
            "Connecting a child with a loving family or a generous sponsor should feel straightforward, responsive, and culturally grounded — not bureaucratic."
          </blockquote>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555566' }}>
            — <strong style={{ color: '#1C4D8D' }}>Nipuni Niwarthana,</strong> Founder & CEO, LittleBridge
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════ CONTACT ══════════════════════════════════ */}
      <section id="contact" style={{ background: '#FFFFFF', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 16, lineHeight: 1.2 }}>Have questions?</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#555566', lineHeight: 1.75, marginBottom: 40 }}>
                Whether you're exploring adoption, looking to sponsor, or an orphanage wanting to register, we're here to help.
              </p>
              {[
                { icon: <Mail size={18} color="#1C4D8D" />, label: 'Email Us', value: 'lttlbrdg@gmail.com' },
                { icon: <Phone size={18} color="#1C4D8D" />, label: 'Call Us', value: '+94 11 265 6163' },
                { icon: <Calendar size={18} color="#1C4D8D" />, label: 'Schedule a Consultation', value: 'Book a calendar slot with our advisors.' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
                  <div className="contact-icon-wrap">{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#555566' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── CONTACT FORM (FIXED: has onSubmit + type="submit") ── */}
            <div style={{ background: '#FAFAF9', border: '1.5px solid #EDEAE4', borderRadius: 16, padding: '40px 36px' }}>

              {contactDone ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <CheckCircle size={52} color="#16A34A" style={{ margin: '0 auto 16px', display: 'block' }}/>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8A8799' }}>We'll get back to you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} noValidate>
                  {contactError && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#DC2626' }}>
                      {contactError}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>First Name *</label>
                      <input type="text" className="lb-form-input" placeholder="John"
                        value={contactForm.firstName} onChange={e => setField('firstName', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>Last Name</label>
                      <input type="text" className="lb-form-input" placeholder="Doe"
                        value={contactForm.lastName} onChange={e => setField('lastName', e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>Email *</label>
                      <input type="email" className="lb-form-input" placeholder="john@example.com"
                        value={contactForm.email} onChange={e => setField('email', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>I am interested in:</label>
                      <select className="lb-form-input" value={contactForm.interest} onChange={e => setField('interest', e.target.value)}>
                        <option>Adoption Process</option>
                        <option>Sponsorship</option>
                        <option>Orphanage Registration</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>How can we help? *</label>
                    <textarea rows={5} className="lb-form-input" placeholder="Tell us about your needs..."
                      style={{ resize: 'vertical' }}
                      value={contactForm.message} onChange={e => setField('message', e.target.value)} />
                  </div>

                  {/* ← type="submit" inside <form onSubmit={...}> — this is the fix */}
                  <button type="submit" className="lb-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
                    disabled={contactLoading}>
                    {contactLoading ? 'Sending…' : 'Start the Conversation'}
                  </button>

                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#8A8799', textAlign: 'center', marginTop: 14, fontStyle: 'italic' }}>
                    Expect a response within one business day. Clear guidance, no pressure.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ FOOTER ══════════════════════════════════ */}
      <footer style={{ background: '#1A1A2E', color: '#fff', padding: '60px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>

            {/* Brand */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: '#1C4D8D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={16} color="white" fill="white" />
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#fff' }}>Little Bridge</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 280 }}>
                Connecting hearts, building families, and supporting communities through transparent technology.
              </p>
            </div>

            {/* Platform — React Router Link (no page reload) */}
            <div>
              <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Platform</h4>
              <Link to="/about" className="lb-footer-link">About Us</Link>
              <Link to="/orphanages" className="lb-footer-link">Find Orphanages</Link>
              <Link to="/sponsorship" className="lb-footer-link">Sponsor a Child</Link>
              <Link to="/signup?role=adopter" className="lb-footer-link">Start Adoption</Link>
            </div>

            {/* Legal — React Router Link */}
            <div>
              <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Legal</h4>
              <Link to="/privacy" className="lb-footer-link">Privacy Policy</Link>
              <Link to="/terms" className="lb-footer-link">Terms of Service</Link>
              <Link to="/cookies" className="lb-footer-link">Cookie Policy</Link>
            </div>

          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              © {new Date().getFullYear()} LittleBridge. All rights reserved. Built with ❤️ for a better tomorrow.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Colombo, Sri Lanka</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
