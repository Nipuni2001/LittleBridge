import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, LogOut, ChevronDown, X, Building2, Shield, Heart, Home } from 'lucide-react';

const ROLE_INFO = {
  adopter:            { label:'Parent / Adopter',       color:'#C8963E', bg:'rgba(200,150,62,0.1)',  icon:<Home  size={13}/> },
  sponsor:            { label:'Sponsor / Donor',        color:'#0F2854', bg:'rgba(155,58,90,0.1)',  icon:<Heart size={13}/> },
  both:               { label:'Adopter & Sponsor',      color:'#059669', bg:'rgba(5,150,105,0.1)',  icon:<Heart size={13}/> },
  orphanage:          { label:'Orphanage Account',      color:'#4F46E5', bg:'rgba(79,70,229,0.1)', icon:<Building2 size={13}/> },
  admin:              { label:'Administrator',           color:'#7C3AED', bg:'rgba(124,58,237,0.1)',icon:<Shield size={13}/> },
  childcare_services: { label:'Childcare Services',     color:'#DC2626', bg:'rgba(220,38,38,0.1)', icon:<Shield size={13}/> },
  super_admin:        { label:'Super Administrator',    color:'#1C1C2E', bg:'rgba(28,28,46,0.1)',  icon:<Shield size={13}/> },
  guest:              { label:'Guest Session',          color:'#C8963E', bg:'rgba(200,150,62,0.1)', icon:<User  size={13}/> },
};

function getAvatarBg(userType) {
  const m = {
    adopter:'#C8963E', sponsor:'#0F2854', both:'#059669',
    orphanage:'#4F46E5', admin:'#7C3AED', childcare_services:'#DC2626',
    super_admin:'#1C1C2E',
  };
  return `linear-gradient(135deg,${m[userType]||'#0F2854'},${m[userType]||'#7A2444'}dd)`;
}

function initials(user) {
  if (!user || user.isGuest) return 'G';
  return ((user.firstName?.[0]||'') + (user.lastName?.[0]||'')).toUpperCase() || 'U';
}

export default function ProfileDropdown({ onLogout }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!user) return null;

  const roleKey  = user.isGuest ? 'guest' : (user.role || user.userType);
  const roleInfo = ROLE_INFO[roleKey] || ROLE_INFO.guest;
  const name     = user.isGuest ? 'Guest User' : `${user.firstName||''} ${user.lastName||''}`.trim() || 'User';
  const ini      = initials(user);

  return (
    <div ref={ref} style={{ position:'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', gap:9, background:'#F5F2EC',
          border:'none', borderRadius:24, padding:'6px 14px 6px 6px', cursor:'pointer',
          transition:'background .2s' }}
        onMouseEnter={e => e.currentTarget.style.background='#EDE8E0'}
        onMouseLeave={e => e.currentTarget.style.background='#F5F2EC'}>
        <div style={{ width:34, height:34, borderRadius:'50%', background:getAvatarBg(user.isGuest?'sponsor':user.userType),
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
          {ini}
        </div>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:'#1C1C2E' }}>
          {user.isGuest ? 'Guest' : user.firstName}
        </span>
        <ChevronDown size={14} color="#8A8799"
          style={{ transition:'transform .2s', transform: open?'rotate(180deg)':'none' }}/>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:290,
          background:'#fff', borderRadius:18, boxShadow:'0 16px 48px rgba(0,0,0,0.14)',
          border:'1px solid #E8E4DF', zIndex:1000, overflow:'hidden',
          animation:'pdSlide .22s ease forwards' }}>
          <style>{`@keyframes pdSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#0F2854,#7A2444)', padding:'20px 20px 16px', position:'relative' }}>
            <button onClick={() => setOpen(false)}
              style={{ position:'absolute', top:10, right:10, background:'rgba(255,255,255,0.15)',
                border:'none', borderRadius:7, width:26, height:26, display:'flex',
                alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
              <X size={13}/>
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:13 }}>
              <div style={{ width:50, height:50, borderRadius:'50%', background:'rgba(255,255,255,0.18)',
                border:'2px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center',
                justifyContent:'center', fontFamily:"'DM Sans',sans-serif", fontSize:18,
                fontWeight:700, color:'#fff', flexShrink:0 }}>
                {ini}
              </div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700,
                  color:'#fff', marginBottom:5 }}>{name}</div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:4,
                  background:roleInfo.bg, color:roleInfo.color, borderRadius:20,
                  padding:'2px 10px', fontFamily:"'DM Sans',sans-serif",
                  fontSize:11, fontWeight:700 }}>
                  {roleInfo.icon}{roleInfo.label}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding:'12px 16px' }}>
            {user.email && !user.isGuest && (
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:9 }}>
                <Mail size={13} color="#0F2854"/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#504E5E',
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user.email}
                </span>
              </div>
            )}
            {user.city && (
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:9 }}>
                <MapPin size={13} color="#0F2854"/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#504E5E' }}>
                  {user.city}{user.country ? `, ${user.country}` : ''}
                </span>
              </div>
            )}

            {user.isGuest && (
              <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9,
                padding:'10px 12px', margin:'6px 0' }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#92400E', lineHeight:1.5, marginBottom:8 }}>
                  Create a free account to track your donations.
                </p>
                <button onClick={() => { setOpen(false); navigate('/signup?role=sponsor'); }}
                  style={{ background:'#0F2854', color:'#fff', border:'none', borderRadius:7,
                    padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer',
                    fontFamily:"'DM Sans',sans-serif" }}>
                  Create Account
                </button>
              </div>
            )}

            <div style={{ height:1, background:'#F0EDE8', margin:'8px 0' }}/>

            <button
              onClick={() => { setOpen(false); onLogout && onLogout(); }}
              style={{ width:'100%', padding:'11px 14px', background:'transparent',
                border:'1.5px solid #F0EDE8', borderRadius:10, display:'flex',
                alignItems:'center', justifyContent:'center', gap:7, cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
                color:'#DC2626', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.borderColor='#FECACA'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='#F0EDE8'; }}>
              <LogOut size={15}/>
              {user.isGuest ? 'Exit Guest Session' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
