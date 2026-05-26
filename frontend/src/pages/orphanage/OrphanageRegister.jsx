import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { MapPin, CheckCircle, AlertCircle, Navigation, Link, Info } from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.or-page{min-height:100vh;background:#FAFAF8;font-family:'DM Sans',sans-serif;display:flex;align-items:flex-start;justify-content:center;padding:40px 24px;}
.or-card{background:#fff;border-radius:20px;border:1.5px solid #E8E4DF;padding:40px;max-width:640px;width:100%;}
.or-input{width:100%;padding:12px 14px;border:1.5px solid #E8E4DF;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:#1C1C2E;outline:none;transition:border-color .2s;background:#fff;}
.or-input:focus{border-color:#0F2854;box-shadow:0 0 0 3px rgba(155,58,90,0.07);}
.or-label{display:block;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#1C1C2E;margin-bottom:6px;}
.or-btn{background:#0F2854;color:#fff;border:none;border-radius:10px;padding:14px 28px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;width:100%;transition:all .2s;}
.or-btn:hover{background:#7A2444;transform:translateY(-1px);}
.or-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.coord-box{background:#F5F2EC;border-radius:10px;padding:14px;display:flex;gap:16px;align-items:center;margin-top:10px;}
.parse-btn{background:rgba(155,58,90,0.08);border:1.5px solid rgba(155,58,90,0.2);border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#0F2854;cursor:pointer;transition:all .2s;white-space:nowrap;}
.parse-btn:hover{background:rgba(155,58,90,0.14);}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const CITIES = ['Colombo','Kandy','Galle','Negombo','Matara','Jaffna','Trincomalee','Batticaloa','Anuradhapura','Polonnaruwa','Ratnapura','Badulla','Kurunegala','Puttalam','Ampara'];

export default function OrphanageRegister() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', registrationNumber: '', email: '', phone: '',
    address: '', city: '', state: '', country: 'Sri Lanka',
    googleMapsUrl: '', latitude: '', longitude: '',
    capacity: '', description: '', website: '',
  });
  const [coords, setCoords]       = useState(null);
  const [parsing, setParsing]     = useState(false);
  const [parseError, setParseError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Parse Google Maps URL via backend
  const parseMapUrl = async () => {
    if (!form.googleMapsUrl.trim()) {
      setParseError('Please paste a Google Maps link first');
      return;
    }
    setParsing(true);
    setParseError('');
    try {
      const res = await api.post('/orphanages/parse-map-url', { url: form.googleMapsUrl });
      setCoords({ lat: res.data.latitude, lng: res.data.longitude });
      setForm(p => ({ ...p, latitude: String(res.data.latitude), longitude: String(res.data.longitude) }));
    } catch (err) {
      setParseError(err.response?.data?.message || 'Could not extract coordinates. Try a full Google Maps URL like: https://www.google.com/maps/place/.../@7.2906,80.6337,...');
    }
    setParsing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/orphanages/register', form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setSubmitting(false);
  };

  if (done) return (
    <>
      <style>{S}</style>
      <div className="or-page">
        <div className="or-card" style={{ textAlign:'center', padding:'60px 40px' }}>
          <CheckCircle size={60} color="#16A34A" style={{ margin:'0 auto 20px', display:'block' }}/>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#1C1C2E', marginBottom:12 }}>
            Registration Submitted!
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'#504E5E', lineHeight:1.7, marginBottom:12 }}>
            Your orphanage registration is now pending review by the <strong>Probation and Child Care Services Department</strong>.
          </p>
          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', marginBottom:28, textAlign:'left' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#92400E', lineHeight:1.7 }}>
              <strong>What happens next:</strong><br/>
              1. Childcare Services will review your documents<br/>
              2. You'll receive an email notification with the decision<br/>
              3. Once approved, your orphanage will appear on the platform
            </div>
          </div>
          <button className="or-btn" style={{ maxWidth:240 }} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{S}</style>
      <div className="or-page">
        <div className="or-card">
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#1C1C2E', marginBottom:8 }}>
              Register Your Orphanage
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799', lineHeight:1.65 }}>
              Fill in your orphanage details. After submission, the Childcare Services Department will review and approve your registration.
            </p>
          </div>

          {error && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', display:'flex', gap:9, alignItems:'center', marginBottom:20 }}>
              <AlertCircle size={14} color="#DC2626"/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#DC2626' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic info */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label className="or-label">Orphanage Name *</label>
                <input className="or-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sunshine Children's Home"/>
              </div>
              <div>
                <label className="or-label">Registration Number *</label>
                <input className="or-input" required value={form.registrationNumber} onChange={e => set('registrationNumber', e.target.value)} placeholder="ORG-2026-XXX"/>
              </div>
              <div>
                <label className="or-label">Capacity</label>
                <input className="or-input" type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="Number of children"/>
              </div>
              <div>
                <label className="or-label">Contact Email *</label>
                <input className="or-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="orphanage@email.com"/>
              </div>
              <div>
                <label className="or-label">Phone *</label>
                <input className="or-input" required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+94 XX XXX XXXX"/>
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label className="or-label">Address *</label>
              <input className="or-input" required value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address"/>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div>
                <label className="or-label">City *</label>
                <select className="or-input" required value={form.city} onChange={e => set('city', e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="or-label">Province *</label>
                <input className="or-input" required value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Western Province"/>
              </div>
            </div>

            {/* Google Maps location */}
            <div style={{ marginBottom:20 }}>
              <label className="or-label">
                <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <MapPin size={14} color="#0F2854"/>
                  Location via Google Maps Link
                </span>
              </label>

              <div style={{ background:'#F0F9FF', border:'1px solid #BAE6FD', borderRadius:10, padding:'10px 14px', marginBottom:10, display:'flex', gap:9 }}>
                <Info size={14} color="#0369A1" style={{ flexShrink:0, marginTop:1 }}/>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#0369A1', lineHeight:1.6 }}>
                  Open Google Maps, find your orphanage location, click Share → Copy link, then paste it here. We'll extract the coordinates automatically.
                </div>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                <div style={{ position:'relative', flex:1 }}>
                  <Link size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#B8B4AF' }}/>
                  <input className="or-input" style={{ paddingLeft:34 }}
                    value={form.googleMapsUrl}
                    onChange={e => { set('googleMapsUrl', e.target.value); setParseError(''); setCoords(null); }}
                    placeholder="https://www.google.com/maps/place/..."/>
                </div>
                <button type="button" className="parse-btn" onClick={parseMapUrl} disabled={parsing}>
                  {parsing
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="#0F2854" strokeOpacity=".3" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#0F2854" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    : <>Extract Coords</>}
                </button>
              </div>

              {parseError && (
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#DC2626', marginTop:6 }}>{parseError}</div>
              )}

              {coords && (
                <div className="coord-box">
                  <CheckCircle size={18} color="#16A34A"/>
                  <div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'#15803D', marginBottom:2 }}>Location extracted successfully!</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#8A8799' }}>
                      Latitude: {coords.lat.toFixed(6)} · Longitude: {coords.lng.toFixed(6)}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#0F2854', display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
                      <Navigation size={11}/>Verify on Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom:20 }}>
              <label className="or-label">Description</label>
              <textarea className="or-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Briefly describe your orphanage and the children you care for…" style={{ resize:'vertical' }}/>
            </div>

            <div style={{ marginBottom:28 }}>
              <label className="or-label">Website (optional)</label>
              <input className="or-input" type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourorphanage.org"/>
            </div>

            <button type="submit" className="or-btn" disabled={submitting}>
              {submitting
                ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .8s linear infinite', display:'inline', marginRight:8 }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>Submitting…</>
                : 'Submit Registration for Review'}
            </button>

            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#B8B4AF', textAlign:'center', marginTop:14 }}>
              Your orphanage will only appear on the platform after approval by the Childcare Services Department.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
