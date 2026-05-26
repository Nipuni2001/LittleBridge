import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, Clock, FileText, Heart, X, Check, Home, Info } from 'lucide-react';
import api from '../services/api';

const MOCK = [
  { notification_id:1, title:'Welcome to LittleBridge', message:'Your account was created successfully. Start your journey today.', notification_type:'adoption_update', is_read:false, created_at: new Date(Date.now()-3600000).toISOString() },
];

const TYPE_CFG = {
  adoption_update:          { icon:<FileText  size={14} color="#0F2854"/>,  bg:'rgba(155,58,90,0.1)'   },
  document_uploaded:        { icon:<CheckCircle size={14} color="#16A34A"/>, bg:'rgba(22,163,74,0.1)'  },
  stage_completed:          { icon:<CheckCircle size={14} color="#16A34A"/>, bg:'rgba(22,163,74,0.1)'  },
  sponsorship_confirmation: { icon:<Heart size={14} color="#C8963E" fill="#C8963E"/>, bg:'rgba(200,150,62,0.12)' },
  orphanage_approved:       { icon:<Home size={14} color="#4F46E5"/>,        bg:'rgba(79,70,229,0.1)'  },
  booking_request:          { icon:<Clock size={14} color="#C8963E"/>,       bg:'rgba(200,150,62,0.12)'},
  default:                  { icon:<Info  size={14} color="#8A8799"/>,       bg:'#F5F3EE'              },
};

function cfg(type) { return TYPE_CFG[type] || TYPE_CFG.default; }

function timeAgo(iso) {
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen]   = useState(false);
  const [list, setList]   = useState([]);
  const ref               = useRef(null);

  const unread = list.filter(n => !n.is_read).length;

    const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setList(data.data || []);
    } catch {
      if (list.length === 0) setList(MOCK);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);



  const markRead = async (id) => {
    try { await api.put(`/notifications/${id}/read`); } catch {}
    setList(p => p.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
  };

  const markAll = async () => {
    try { await api.put('/notifications/mark-all-read'); } catch {}
    setList(p => p.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
        style={{ position:'relative', background:'none', border:'none', cursor:'pointer',
          padding:8, borderRadius:'50%', display:'flex', alignItems:'center',
          justifyContent:'center', transition:'background .2s' }}
        onMouseEnter={e => e.currentTarget.style.background='#F5F2EC'}
        onMouseLeave={e => e.currentTarget.style.background='none'}>
        <Bell size={21} color="#504E5E"/>
        {unread > 0 && (
          <span style={{ position:'absolute', top:4, right:4, minWidth:17, height:17,
            background:'#E05975', color:'#fff', borderRadius:9, border:'2px solid #fff',
            fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0,
          width:340, background:'#fff', borderRadius:16,
          boxShadow:'0 16px 48px rgba(0,0,0,0.14)',
          border:'1px solid #E8E4DF', zIndex:1000, overflow:'hidden',
          animation:'nbSlide .2s ease forwards' }}>
          <style>{`
            @keyframes nbSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
            .nb-item{padding:13px 18px;border-bottom:1px solid #F5F3EF;cursor:pointer;display:flex;gap:12px;align-items:flex-start;transition:background .15s;}
            .nb-item:hover{background:#FAFAF8;}
            .nb-item.unread{background:rgba(155,58,90,0.03);}
            .nb-item.unread:hover{background:rgba(155,58,90,0.06);}
          `}</style>

          {/* Header */}
          <div style={{ padding:'15px 18px 11px', borderBottom:'1px solid #F0EDE8',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:'#1C1C2E' }}>
                Notifications
              </span>
              {unread > 0 && (
                <span style={{ background:'rgba(155,58,90,0.1)', color:'#0F2854',
                  borderRadius:12, padding:'2px 8px', fontSize:11, fontWeight:700,
                  fontFamily:"'DM Sans',sans-serif" }}>
                  {unread} new
                </span>
              )}
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {unread > 0 && (
                <button onClick={markAll}
                  style={{ background:'none', border:'none', cursor:'pointer',
                    fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#0F2854',
                    fontWeight:600, padding:'4px 8px', borderRadius:6, display:'flex',
                    alignItems:'center', gap:3 }}>
                  <Check size={11}/>Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)}
                style={{ background:'none', border:'none', cursor:'pointer',
                  padding:4, color:'#8A8799', display:'flex' }}>
                <X size={14}/>
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight:360, overflowY:'auto' }}>
            {list.length === 0 ? (
              <div style={{ padding:'36px 18px', textAlign:'center' }}>
                <Bell size={32} color="#E0DDD8" style={{ margin:'0 auto 12px', display:'block' }}/>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#B8B4AF' }}>
                  No notifications yet
                </p>
              </div>
            ) : list.map(n => (
              <div key={n.notification_id}
                className={`nb-item ${!n.is_read ? 'unread' : ''}`}
                onClick={() => markRead(n.notification_id)}>
                {/* Icon */}
                <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
                  background:cfg(n.notification_type).bg,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {cfg(n.notification_type).icon}
                </div>
                {/* Text */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'flex-start', gap:8, marginBottom:3 }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13,
                      fontWeight: n.is_read ? 500 : 700, color:'#1C1C2E', lineHeight:1.35 }}>
                      {n.title}
                    </span>
                    {!n.is_read && (
                      <span style={{ width:7, height:7, background:'#0F2854',
                        borderRadius:'50%', flexShrink:0, marginTop:3 }}/>
                    )}
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12,
                    color:'#8A8799', lineHeight:1.55, marginBottom:4 }}>
                    {n.message}
                  </p>
                  <span style={{ fontFamily:"'DM Sans',sans-serif",
                    fontSize:11, color:'#C0BAB5' }}>
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {list.length > 0 && (
            <div style={{ padding:'10px 18px', borderTop:'1px solid #F0EDE8',
              textAlign:'center', fontFamily:"'DM Sans',sans-serif",
              fontSize:12, color:'#C0BAB5' }}>
              {list.length} notification{list.length !== 1 ? 's' : ''} total
            </div>
          )}
        </div>
      )}
    </div>
  );
}
