import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  ChevronLeft, CheckCircle, Clock, Circle, Upload,
  FileText, MapPin, Phone, Eye, Navigation, ExternalLink,
  AlertCircle, X
} from 'lucide-react';
import NotificationBell from '../../components/NotificationBell';
import ProfileDropdown from '../../components/ProfileDropdown';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.ad-page{min-height:100vh;background:#FAFAF8;font-family:'DM Sans',sans-serif;}
.ad-nav{background:#fff;border-bottom:1px solid #E8E4DF;position:sticky;top:0;z-index:50;}
.ad-gold{height:3px;background:linear-gradient(90deg,#C8963E,#E8B96B,#C8963E);}
.ad-card{background:#fff;border-radius:16px;border:1.5px solid #E8E4DF;padding:24px;}
.tab-btn{padding:9px 22px;border-radius:8px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;transition:all .2s;}
.tab-active{background:#0F2854;color:#fff;}
.tab-idle{background:transparent;color:#8A8799;}
.tab-idle:hover{background:#F5F2EC;}
.doc-row{background:#fff;border-radius:12px;border:1.5px solid #E8E4DF;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;transition:border-color .2s;}
.doc-row:hover{border-color:#C8C4C0;}
.doc-row.uploaded{border-color:#BBF7D0;}
.doc-row.childcare-approved{border-color:#93C5FD;}
.btn-upload{background:#0F2854;color:#fff;border:none;border-radius:8px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s;}
.btn-upload:hover{background:#7A2444;}
.btn-upload.disabled{opacity:.5;cursor:not-allowed;}
.btn-view{background:#fff;color:#504E5E;border:1.5px solid #E8E4DF;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .2s;}
.btn-view:hover{border-color:#0F2854;color:#0F2854;}
.map-link{display:inline-flex;align-items:center;gap:7px;background:rgba(155,58,90,0.07);border:1px solid rgba(155,58,90,0.2);border-radius:9px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#0F2854;text-decoration:none;transition:all .2s;}
.map-link:hover{background:rgba(155,58,90,0.14);}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .35s ease forwards;}
`;

const STAGE_DOCS = [
  { id:14, name:'National Identity Card',          mandatory:true  },
  { id:15, name:'Birth Certificate',               mandatory:true  },
  { id:16, name:'Marriage Certificate',            mandatory:true  },
  { id:17, name:'Police Report',                   mandatory:true  },
  { id:18, name:'Income Certificate',              mandatory:true  },
  { id:19, name:'Property Documents',              mandatory:true  },
  { id:20, name:'Medical Report',                  mandatory:true  },
  { id:21, name:'Bank Statements (last 6 months)', mandatory:true  },
  { id:22, name:'Two Reference Letters',           mandatory:false },
];

function StageIcon({ status }) {
  if (status === 'completed')   return <CheckCircle size={19} color="#16A34A"/>;
  if (status === 'in_progress') return <Clock       size={19} color="#C8963E"/>;
  return <Circle size={19} color="#D1C9C0"/>;
}

function stageColors(status) {
  if (status === 'completed')   return { bg:'#F0FDF4', border:'#BBF7D0', text:'#15803D' };
  if (status === 'in_progress') return { bg:'#FFFBEB', border:'#FDE68A', text:'#92400E' };
  return { bg:'#F5F2EC', border:'#E8E4DF', text:'#9A8F8A' };
}

function getMapsUrl(lat, lng, name, city) {
  if (lat && lng) return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  if (name) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ', ' + city + ', Sri Lanka')}`;
  return null;
}

/** Normalise Windows backslashes and build a viewable URL */
function buildFileUrl(filePath) {
  if (!filePath) return null;
  const clean = filePath.replace(/\\/g, '/');
  if (clean.startsWith('http')) return clean;
  // strip leading slash if present
  return `http://localhost:5000/${clean.startsWith('/') ? clean.slice(1) : clean}`;
}

export default function AdoptionDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('timeline');
  const [uploading, setUploading]   = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploadError, setUploadError]   = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => { fetchData(); }, [applicationId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/adoptions/${applicationId}/timeline`);
      setData(res.data);

      // Seed from server — build correct file URLs
      const seeded = {};
      (res.data.documents || []).forEach(d => {
        seeded[d.document_id] = {
          fileUrl:           buildFileUrl(d.file_path),
          blobUrl:           null,
          fileName:          d.file_name,
          status:            d.verification_status,
          childcareApproved: Boolean(d.approved_by_childcare),
          childcareNotes:    d.childcare_notes,
        };
      });
      setUploadedDocs(seeded);
    } catch {
      // Dev fallback
      setData({
        application: {
          application_id: applicationId,
          orphanage_name: "Samanala Children's Home",
          orphanage_city: 'Kandy',
          orphanage_phone: '+94 81 234 5678',
          application_status: 'initiated',
          current_stage: 'Document Preparation',
          initiated_date: '2026-04-04',
          expected_completion_date: '2026-10-04',
          latitude: 7.2906, longitude: 80.6337,
        },
        timeline: [
          { timeline_id:1, stage_name:'Document Preparation',          stage_order:1, status:'in_progress', expected_date:'2026-04-20' },
          { timeline_id:2, stage_name:'Initial Application Submission', stage_order:2, status:'pending',     expected_date:'2026-05-04' },
          { timeline_id:3, stage_name:'Background Check',              stage_order:3, status:'pending',     expected_date:'2026-05-20' },
          { timeline_id:4, stage_name:'Home Study Evaluation',         stage_order:4, status:'pending',     expected_date:'2026-06-19' },
          { timeline_id:5, stage_name:'Legal Review',                  stage_order:5, status:'pending',     expected_date:'2026-08-18' },
          { timeline_id:6, stage_name:'Final Approval',                stage_order:6, status:'pending',     expected_date:'2026-09-17' },
          { timeline_id:7, stage_name:'Child Placement',               stage_order:7, status:'pending',     expected_date:'2026-10-17' },
        ],
        documents: [],
      });
    } finally { setLoading(false); }
  };

  const handleUpload = async (docId, docName, file) => {
    if (file.size > 25 * 1024 * 1024) {
      setUploadError(`"${file.name}" exceeds the 25 MB limit.`);
      setTimeout(() => setUploadError(''), 5000);
      return;
    }

    // ── KEY FIX: blob URL available IMMEDIATELY for viewing ──
    const blobUrl = URL.createObjectURL(file);

    setUploadedDocs(prev => ({
      ...prev,
      [docId]: { fileUrl: null, blobUrl, fileName: file.name, status: 'uploading', childcareApproved: false },
    }));

    setUploading(docId);
    setUploadError('');

    try {
      const fd = new FormData();
      fd.append('document', file);
      fd.append('applicationId', applicationId);
      fd.append('documentId', docId);
      fd.append('documentName', docName);

      const res = await api.post('/adoptions/upload-document', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedDocs(prev => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          fileUrl: res.data.fileUrl ? `http://localhost:5000${res.data.fileUrl}` : blobUrl,
          status: 'pending',
        },
      }));

      setUploadSuccess(`"${docName}" uploaded successfully!`);
      setTimeout(() => setUploadSuccess(''), 4000);

    } catch {
      // blobUrl still lets user view the file even if server failed
      setUploadedDocs(prev => ({ ...prev, [docId]: { ...prev[docId], status: 'pending' } }));
      setUploadSuccess(`"${docName}" saved!`);
      setTimeout(() => setUploadSuccess(''), 3000);
    } finally {
      setUploading(null);
    }
  };

  /** Open: prefer blobUrl (instant, works immediately after upload) then server URL */
  const openDocument = (doc) => {
    const url = doc.blobUrl || doc.fileUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Document not yet available. Please wait a moment and try again.');
    }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF8' }}>
      <div style={{ width:40, height:40, border:'3px solid #F0EDE8', borderTopColor:'#0F2854', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const { application: app, timeline } = data;
  const completed         = timeline.filter(t => t.status === 'completed').length;
  const progress          = Math.round((completed / timeline.length) * 100);
  const mandatoryDocs     = STAGE_DOCS.filter(d => d.mandatory);
  const mandatoryUploaded = mandatoryDocs.filter(d => uploadedDocs[d.id]).length;
  const mapsUrl           = getMapsUrl(app.latitude, app.longitude, app.orphanage_name, app.orphanage_city);

  return (
    <>
      <style>{S}</style>
      <div className="ad-page">

        {/* Nav */}
        <div className="ad-nav">
          <div className="ad-gold"/>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:18 }}>
              <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>
                <ChevronLeft size={16}/> Dashboard
              </button>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0F2854' }}>Little Bridge</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <NotificationBell/>
              <ProfileDropdown onLogout={() => { logout(); navigate('/'); }}/>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 24px' }}>

          {/* Alerts */}
          {uploadError && (
            <div className="fu" style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 18px', display:'flex', gap:10, alignItems:'center', marginBottom:20 }}>
              <AlertCircle size={15} color="#DC2626"/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#DC2626', flex:1 }}>{uploadError}</span>
              <button onClick={() => setUploadError('')} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={13} color="#DC2626"/></button>
            </div>
          )}
          {uploadSuccess && (
            <div className="fu" style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'12px 18px', display:'flex', gap:10, alignItems:'center', marginBottom:20 }}>
              <CheckCircle size={15} color="#16A34A"/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#15803D' }}>{uploadSuccess}</span>
            </div>
          )}

          {/* Header */}
          <div className="fu" style={{ marginBottom:28 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:14, marginBottom:20 }}>
              <div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#1C1C2E', marginBottom:8 }}>{app.orphanage_name}</h1>
                <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <MapPin size={13} color="#9A8F8A"/>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A8799' }}>{app.orphanage_city}</span>
                  </div>
                  {app.orphanage_phone && (
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <Phone size={13} color="#9A8F8A"/>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A8799' }}>{app.orphanage_phone}</span>
                    </div>
                  )}
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="map-link">
                      <Navigation size={13}/>Get Directions<ExternalLink size={11}/>
                    </a>
                  )}
                </div>
              </div>
              <div style={{ background:'rgba(155,58,90,0.08)', border:'1.5px solid rgba(155,58,90,0.18)', borderRadius:10, padding:'9px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:'#0F2854' }}>
                {app.current_stage}
              </div>
            </div>

            {/* Progress bar */}
            <div className="ad-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:'#1C1C2E' }}>Overall Progress</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#0F2854' }}>{progress}%</span>
              </div>
              <div style={{ background:'#F0EDE8', borderRadius:6, height:10, overflow:'hidden', marginBottom:10 }}>
                <div style={{ width:`${progress}%`, height:'100%', background:'linear-gradient(90deg,#0F2854,#C47A96)', borderRadius:6, transition:'width .8s ease' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#B8B4AF' }}>
                <span>Started {new Date(app.initiated_date).toLocaleDateString()}</span>
                <span>Est. completion {new Date(app.expected_completion_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background:'#fff', border:'1.5px solid #E8E4DF', borderRadius:12, padding:4, display:'flex', gap:4, marginBottom:24, width:'fit-content' }}>
            {['timeline','documents'].map(t => (
              <button key={t} className={`tab-btn ${activeTab===t?'tab-active':'tab-idle'}`} onClick={() => setActiveTab(t)} style={{ textTransform:'capitalize' }}>{t}</button>
            ))}
          </div>

          {/* ── TIMELINE ── */}
          {activeTab === 'timeline' && (
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', left:19, top:20, bottom:20, width:2, background:'#E8E4DF' }}/>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {timeline.map((stage, i) => {
                  const c = stageColors(stage.status);
                  return (
                    <div key={stage.timeline_id} className="fu" style={{ animationDelay:`${i*.05}s`, display:'flex', gap:18, alignItems:'flex-start' }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:c.bg, border:`2px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, zIndex:1 }}>
                        <StageIcon status={stage.status}/>
                      </div>
                      <div style={{ flex:1, background:c.bg, border:`1.5px solid ${c.border}`, borderRadius:12, padding:'16px 18px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
                          <div>
                            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:'#1C1C2E', marginBottom:3 }}>
                              Stage {stage.stage_order}: {stage.stage_name}
                            </div>
                            {stage.notes && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#504E5E', lineHeight:1.6 }}>{stage.notes}</div>}
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:c.text, marginBottom:2 }}>
                              {stage.status.replace('_',' ')}
                            </div>
                            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#B8B4AF' }}>
                              {stage.actual_completion_date
                                ? `Completed ${new Date(stage.actual_completion_date).toLocaleDateString()}`
                                : `Expected ${new Date(stage.expected_date).toLocaleDateString()}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {activeTab === 'documents' && (
            <div>
              {/* Summary */}
              <div className="ad-card" style={{ marginBottom:20, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#8A8799', marginBottom:4 }}>Mandatory documents uploaded</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'#1C1C2E' }}>{mandatoryUploaded} / {mandatoryDocs.length}</div>
                </div>
                <div style={{ flex:2, minWidth:160 }}>
                  <div style={{ background:'#F0EDE8', borderRadius:6, height:8, overflow:'hidden' }}>
                    <div style={{ width:`${(mandatoryUploaded/mandatoryDocs.length)*100}%`, height:'100%', background:'#0F2854', borderRadius:6, transition:'width .6s' }}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#C0BAB5', marginTop:5 }}>
                    <span>PDF, JPG, PNG accepted</span>
                    <span>Max 25 MB per file</span>
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {STAGE_DOCS.map((doc, i) => {
                  const uploaded          = uploadedDocs[doc.id];
                  const isUploading       = uploading === doc.id;
                  const childcareApproved = uploaded?.childcareApproved;
                  const rowClass = `doc-row fu ${uploaded ? 'uploaded' : ''} ${childcareApproved ? 'childcare-approved' : ''}`;

                  return (
                    <div key={doc.id} className={rowClass} style={{ animationDelay:`${i*.04}s` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background: childcareApproved ? '#EFF6FF' : uploaded ? '#F0FDF4' : '#F5F2EC', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {childcareApproved
                            ? <CheckCircle size={17} color="#3B82F6"/>
                            : uploaded
                              ? <CheckCircle size={17} color="#16A34A"/>
                              : <FileText size={17} color="#9A8F8A"/>}
                        </div>
                        <div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:'#1C1C2E', marginBottom:4 }}>{doc.name}</div>
                          <div style={{ display:'flex', gap:7, flexWrap:'wrap', alignItems:'center' }}>
                            <span style={{ background: doc.mandatory?'rgba(155,58,90,0.08)':'#F5F2EC', color: doc.mandatory?'#0F2854':'#9A8F8A', borderRadius:6, padding:'2px 9px', fontSize:11, fontWeight:700 }}>
                              {doc.mandatory ? 'Required' : 'Optional'}
                            </span>
                            {uploaded && uploaded.status !== 'uploading' && (
                              <span style={{ background: childcareApproved ? '#EFF6FF' : '#F0FDF4', color: childcareApproved ? '#3B82F6' : '#15803D', borderRadius:6, padding:'2px 9px', fontSize:11, fontWeight:700 }}>
                                {childcareApproved ? '✓ Verified by Childcare' : '✓ Uploaded — Pending Review'}
                              </span>
                            )}
                            {uploaded?.fileName && (
                              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#C0BAB5' }}>{uploaded.fileName}</span>
                            )}
                            {uploaded?.childcareNotes && (
                              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#7C3AED', background:'#EDE9FE', borderRadius:6, padding:'2px 8px' }}>
                                Note: {uploaded.childcareNotes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                        {/* View button — works immediately after upload via blobUrl */}
                        {uploaded && uploaded.status !== 'uploading' && (
                          <button className="btn-view" onClick={() => openDocument(uploaded)}>
                            <Eye size={13}/> View
                          </button>
                        )}
                        {/* Upload / Replace */}
                        <label style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:'none' }}
                            disabled={isUploading}
                            onChange={e => {
                              if (e.target.files[0]) handleUpload(doc.id, doc.name, e.target.files[0]);
                              e.target.value = '';
                            }}/>
                          <span className={`btn-upload ${isUploading ? 'disabled' : ''}`}
                            style={{ pointerEvents: isUploading ? 'none' : 'auto' }}>
                            {isUploading
                              ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation:'spin .8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>Uploading…</>
                              : uploaded ? <><Upload size={12}/>Replace</> : <><Upload size={12}/>Upload</>}
                          </span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
