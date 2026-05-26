import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Shield, Target, ArrowLeft, CheckCircle } from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--p:#0F2854;--gold:#C8963E;--text:#1C1C2E;--muted:#504E5E;--border:#E8E4DF;--bg:#FAFAF8;--cream:#F5F2EC;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);}
.au-nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;}
.au-gold{height:3px;background:linear-gradient(90deg,var(--gold),#E8B96B,var(--gold));}
.dot-bg{background-image:radial-gradient(circle,#D4CEC6 1px,transparent 1px);background-size:24px 24px;}
.value-card{background:#fff;border-radius:16px;border:1.5px solid var(--border);padding:32px;text-align:center;transition:transform .22s,box-shadow .22s;}
.value-card:hover{transform:translateY(-4px);box-shadow:0 10px 32px rgba(155,58,90,0.1);}
@keyframes fadeUp{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .5s ease forwards;}
.f1{animation-delay:.05s;opacity:0;}.f2{animation-delay:.12s;opacity:0;}.f3{animation-delay:.18s;opacity:0;}.f4{animation-delay:.24s;opacity:0;}.f5{animation-delay:.30s;opacity:0;}
`;

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <>
      <style>{S}</style>
      <div>
        {/* Nav */}
        <nav className="au-nav">
          <div className="au-gold"/>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:20 }}>
              <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799', transition:'color .2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#0F2854'} onMouseLeave={e=>e.currentTarget.style.color='#8A8799'}>
                <ArrowLeft size={15}/> Home
              </button>
              <div style={{ width:1, height:20, background:'#E8E4DF' }}/>
              <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => navigate('/')}>
                <div style={{ width:36, height:36, background:'linear-gradient(135deg,#0F2854,#7A2444)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Heart size={16} color="white" fill="white"/>
                </div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0F2854' }}>Little Bridge</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:'#0F2854', cursor:'pointer' }}>Login</button>
              <button onClick={() => navigate('/signup')} style={{ background:'#0F2854', color:'#fff', border:'none', borderRadius:8, padding:'9px 20px', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer' }}>Sign Up</button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="dot-bg" style={{ background:'#F5F2EC', padding:'80px 24px 72px' }}>
          <div style={{ maxWidth:740, margin:'0 auto', textAlign:'center' }}>
            <div className="fu f1" style={{ display:'inline-block', background:'rgba(200,150,62,0.14)', border:'1px solid rgba(200,150,62,0.3)', borderRadius:20, padding:'5px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#7B5A14', fontWeight:500, marginBottom:24 }}>
              About LittleBridge
            </div>
            <h1 className="fu f2" style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4.5vw,52px)', fontWeight:700, color:'#1C1C2E', lineHeight:1.18, marginBottom:20, letterSpacing:'-0.4px' }}>
              Who We Are
            </h1>
            <p className="fu f3" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:17, color:'#504E5E', lineHeight:1.78, marginBottom:28 }}>
              LittleBridge is a digital platform created to support ethical adoption and responsible sponsorship within Sri Lanka.
            </p>
            <p className="fu f4" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:'#504E5E', lineHeight:1.78 }}>
              We work to ensure that every process involving a child is handled with care, clarity, and accountability. By connecting parents, orphanages, sponsors, and the relevant authorities, we create a system built on transparency and trust.
            </p>
          </div>
        </section>

        {/* Focus */}
        <section style={{ background:'#fff', padding:'72px 24px' }}>
          <div style={{ maxWidth:900, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:1.8, color:'#0F2854', textTransform:'uppercase', marginBottom:16 }}>Our Focus</div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,3vw,36px)', fontWeight:700, color:'#1C1C2E', lineHeight:1.25, marginBottom:20 }}>
                  To protect childhood while guiding families and communities
                </h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'#504E5E', lineHeight:1.75 }}>
                  Through structured, verified processes, we ensure every interaction prioritises the well-being of the child above all else.
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  'Simplify the adoption journey for parents',
                  'Support orphanages with transparent sponsorship systems',
                  'Enable sponsors to contribute responsibly',
                  'Maintain structured communication with probation departments and NGOs',
                ].map(item => (
                  <div key={item} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <div style={{ width:24, height:24, background:'rgba(155,58,90,0.1)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                      <CheckCircle size={13} color="#0F2854"/>
                    </div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#504E5E', lineHeight:1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why we exist */}
        <section style={{ background:'#F5F2EC', padding:'72px 24px' }}>
          <div style={{ maxWidth:780, margin:'0 auto', textAlign:'center' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:1.8, color:'#0F2854', textTransform:'uppercase', marginBottom:16 }}>Why We Exist</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,3vw,38px)', fontWeight:700, color:'#1C1C2E', lineHeight:1.25, marginBottom:20 }}>
              Bringing clarity to a complex journey
            </h2>
            <div style={{ width:56, height:3, background:'#C8963E', borderRadius:2, margin:'0 auto 28px' }}/>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:'#504E5E', lineHeight:1.8, marginBottom:20 }}>
              In Sri Lanka, adoption and child welfare processes can feel complex and overwhelming for families who simply want to provide love and stability.
            </p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:'#504E5E', lineHeight:1.8, marginBottom:20 }}>
              LittleBridge was created to bring clarity, guidance, and trust to every step — connecting parents, orphanages, sponsors, and authorities through one transparent system.
            </p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontStyle:'italic', color:'#0F2854', lineHeight:1.65 }}>
              "Because when the process is clear, children are protected with care."
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section style={{ background:'#fff', padding:'72px 24px' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              {[
                {
                  icon: <Eye size={24} color="#0F2854"/>,
                  label: 'Our Vision',
                  bg: 'rgba(155,58,90,0.06)',
                  border: 'rgba(155,58,90,0.15)',
                  text: 'To create a Sri Lanka where every child grows in safety, dignity, and belonging.',
                },
                {
                  icon: <Target size={24} color="#C8963E"/>,
                  label: 'Our Mission',
                  bg: 'rgba(200,150,62,0.06)',
                  border: 'rgba(200,150,62,0.2)',
                  text: 'To provide a transparent, secure, and accountable digital platform that connects families, communities, and institutions in the shared responsibility of protecting children.',
                },
              ].map(({ icon, label, bg, border, text }) => (
                <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius:16, padding:'32px 28px' }}>
                  <div style={{ width:52, height:52, background:'#fff', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                    {icon}
                  </div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'#1C1C2E', marginBottom:12 }}>{label}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'#504E5E', lineHeight:1.75 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ background:'#F5F2EC', padding:'72px 24px' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:1.8, color:'#0F2854', textTransform:'uppercase', marginBottom:12 }}>What We Stand For</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,3vw,36px)', fontWeight:700, color:'#1C1C2E' }}>Our Core Values</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20 }}>
              {[
                { icon:<Eye size={24} color="#0F2854"/>, title:'Transparency', desc:'Clear timelines, zero hidden processes. Every stakeholder knows exactly where things stand.' },
                { icon:<Shield size={24} color="#0F2854"/>, title:'Security', desc:'State-of-the-art encryption protects all sensitive family and child data throughout the process.' },
                { icon:<Heart size={24} color="#0F2854"/>, title:'Child-First', desc:'Every decision, feature, and process is designed with the child\'s best interest as the absolute priority.' },
                { icon:<CheckCircle size={24} color="#0F2854"/>, title:'Accountability', desc:'Every action is logged, every orphanage verified. Trust is earned through consistent, auditable processes.' },
              ].map(v => (
                <div key={v.title} className="value-card">
                  <div style={{ width:56, height:56, background:'rgba(155,58,90,0.08)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>{v.icon}</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1C1C2E', marginBottom:10 }}>{v.title}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#504E5E', lineHeight:1.7 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background:'linear-gradient(135deg,#0F2854,#7A2444)', padding:'72px 24px', textAlign:'center' }}>
          <div style={{ maxWidth:600, margin:'0 auto' }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,3vw,32px)', color:'rgba(255,255,255,0.95)', fontStyle:'italic', lineHeight:1.5, marginBottom:28 }}>
              "When we protect a child, we protect the promise of tomorrow."
            </p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.55)', marginBottom:32 }}>
              — LittleBridge, Always for Them.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={() => navigate('/signup')} style={{ background:'#fff', color:'#0F2854', border:'none', borderRadius:9, padding:'13px 32px', fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#F5F2EC'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                Get Started
              </button>
              <button onClick={() => navigate('/orphanages')} style={{ background:'transparent', color:'#fff', border:'2px solid rgba(255,255,255,0.4)', borderRadius:9, padding:'13px 32px', fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.8)'} onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'}>
                Explore Orphanages
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background:'#1C1C2E', color:'#fff', padding:'40px 24px', textAlign:'center' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            © 2026 LittleBridge · <button onClick={() => navigate('/privacy')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, textDecoration:'underline' }}>Privacy Policy</button>
            {' · '}<button onClick={() => navigate('/terms')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, textDecoration:'underline' }}>Terms</button>
          </p>
        </footer>
      </div>
    </>
  );
}
