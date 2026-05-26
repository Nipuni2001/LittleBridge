import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Home, Heart, ArrowRight, LogIn, Building2 } from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
.rg-overlay{min-height:100vh;background:#FAFAF8;display:flex;align-items:center;justify-content:center;padding:24px;}
.rg-card{background:#fff;border-radius:20px;border:1.5px solid #E8E4DF;padding:48px 44px;max-width:460px;width:100%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.07);}
.rg-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:#0F2854;color:#fff;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;}
.rg-btn:hover{background:#7A2444;transform:translateY(-1px);}
.rg-btn-out{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:transparent;color:#0F2854;border:1.5px solid #0F2854;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;}
.rg-btn-out:hover{background:#0F2854;color:#fff;}
.role-badge{display:inline-flex;align-items:center;gap:6px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:20px;padding:4px 14px;margin-bottom:20px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;color:#92400E;}
`;

const ROLE_LABELS = {
  adopter:             'Parent / Adopter',
  sponsor:             'Sponsor / Donor',
  both:                'Adopter & Sponsor',
  orphanage:           'Orphanage Account',
  admin:               'Administrator',
  childcare_services:  'Childcare Services',
  guest:               'Guest',
};

export default function RoleGuard({ requiredRoles, feature, children }) {
  const { user, isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();

  // Not logged in at all
  if (!isAuthenticated) {
    return (
      <>
        <style>{S}</style>
        <div className="rg-overlay">
          <div className="rg-card">
            <div style={{ width:64, height:64, background:'rgba(155,58,90,0.08)',
              borderRadius:'50%', display:'flex', alignItems:'center',
              justifyContent:'center', margin:'0 auto 24px' }}>
              <LogIn size={28} color="#0F2854"/>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24,
              fontWeight:700, color:'#1C1C2E', marginBottom:12 }}>
              Sign In Required
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15,
              color:'#504E5E', lineHeight:1.7, marginBottom:28 }}>
              Please sign in to access {feature}.
              {feature === 'sponsorship'
                ? ' You can also continue anonymously as a guest.'
                : ''}
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="rg-btn" onClick={() => navigate('/login')}>
                <LogIn size={15}/> Sign In
              </button>
              {feature === 'sponsorship' && (
                <button className="rg-btn-out"
                  onClick={() => navigate('/signup?role=sponsor')}>
                  Create Account
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Guest trying to adopt
  if (isGuest && feature === 'adoption') {
    return (
      <>
        <style>{S}</style>
        <div className="rg-overlay">
          <div className="rg-card">
            <div style={{ width:64, height:64, background:'rgba(155,58,90,0.08)',
              borderRadius:'50%', display:'flex', alignItems:'center',
              justifyContent:'center', margin:'0 auto 24px' }}>
              <Home size={28} color="#0F2854"/>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22,
              fontWeight:700, color:'#1C1C2E', marginBottom:12 }}>
              Account Required for Adoption
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15,
              color:'#504E5E', lineHeight:1.7, marginBottom:28 }}>
              Adoption requires a verified account. Please create a free
              Parent/Adopter account to begin your journey.
            </p>
            <button className="rg-btn" onClick={() => navigate('/signup?role=adopter')}>
              <ArrowRight size={15}/> Create Parent Account
            </button>
          </div>
        </div>
      </>
    );
  }

  // Logged in but wrong role
  const roleKey = isGuest ? 'guest' : user?.userType;
  const hasRole = requiredRoles.some(r => r === roleKey);

  if (!hasRole) {
    const currentLabel = ROLE_LABELS[roleKey] || roleKey;
    const isAdopterTryingSponsor = feature === 'sponsorship' && user?.userType === 'adopter';
    const isSponsorTryingAdopt   = feature === 'adoption'    && user?.userType === 'sponsor';

    let heading = 'Access Restricted';
    let message = `You're signed in as ${currentLabel}.`;
    let detail  = `This feature requires: ${requiredRoles.map(r => ROLE_LABELS[r] || r).join(' or ')}.`;
    let icon    = <Shield size={28} color="#0F2854"/>;

    if (isAdopterTryingSponsor) {
      heading = 'Sponsorship Requires a Sponsor Account';
      message = `You're signed in as a Parent / Adopter.`;
      detail  = 'To make donations, you need a Sponsor or Both Roles account. Register a new account or contact support to change your role.';
      icon    = <Heart size={28} color="#0F2854"/>;
    } else if (isSponsorTryingAdopt) {
      heading = 'Adoption Requires a Parent Account';
      message = `You're signed in as a Sponsor / Donor.`;
      detail  = 'To begin an adoption journey, you need a Parent/Adopter or Both Roles account.';
      icon    = <Home size={28} color="#0F2854"/>;
    }

    return (
      <>
        <style>{S}</style>
        <div className="rg-overlay">
          <div className="rg-card">
            <div style={{ width:64, height:64, background:'rgba(155,58,90,0.08)',
              borderRadius:'50%', display:'flex', alignItems:'center',
              justifyContent:'center', margin:'0 auto 24px' }}>
              {icon}
            </div>
            <div className="role-badge">{currentLabel}</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22,
              fontWeight:700, color:'#1C1C2E', marginBottom:12 }}>
              {heading}
            </h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15,
              color:'#504E5E', lineHeight:1.7, marginBottom:8 }}>
              {message}
            </p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14,
              color:'#8A8799', lineHeight:1.65, marginBottom:28 }}>
              {detail}
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="rg-btn" onClick={() => navigate('/signup')}>
                <ArrowRight size={15}/> Register with Both Roles
              </button>
              <button className="rg-btn-out" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Has the right role — render children
  return children;
}
