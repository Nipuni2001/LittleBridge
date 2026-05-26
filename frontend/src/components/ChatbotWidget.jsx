import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5001';

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

:root {
  --cb-primary: #0F2854;
  --cb-primary-dark: #7A2444;
  --cb-gold: #C8963E;
  --cb-bg: #FAFAF8;
  --cb-border: #E8E4DF;
  --cb-text: #1C1C2E;
  --cb-muted: #8A8799;
}

.cb-fab {
  position: fixed;
  bottom: 28px; right: 28px;
  z-index: 9999;
  width: 58px; height: 58px;
  background: linear-gradient(135deg, var(--cb-primary), var(--cb-primary-dark));
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(155,58,90,0.45);
  transition: transform .2s, box-shadow .2s;
}
.cb-fab:hover { transform: scale(1.08); box-shadow: 0 10px 32px rgba(155,58,90,0.55); }

.cb-pulse {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 2px solid rgba(155,58,90,0.35);
  animation: cbpulse 2.2s ease-out infinite;
  pointer-events: none;
}
@keyframes cbpulse {
  0% { transform: scale(1); opacity: .75; }
  100% { transform: scale(1.4); opacity: 0; }
}

.cb-badge {
  position: absolute;
  top: -2px; right: -2px;
  width: 18px; height: 18px;
  background: #E05975;
  border-radius: 50%;
  border: 2px solid #fff;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
}

.cb-window {
  position: fixed;
  bottom: 100px; right: 28px;
  z-index: 9998;
  width: 360px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--cb-border);
  animation: cbslide .3s cubic-bezier(.34,1.56,.64,1) forwards;
}
@keyframes cbslide {
  from { opacity: 0; transform: translateY(16px) scale(.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@media(max-width:480px) {
  .cb-window { width: calc(100vw - 32px); right: 16px; bottom: 90px; }
}

.cb-header {
  background: linear-gradient(135deg, var(--cb-primary), var(--cb-primary-dark));
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.cb-avatar {
  width: 38px; height: 38px;
  background: rgba(255,255,255,.18);
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cb-status-dot {
  width: 7px; height: 7px;
  background: #4ADE80;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  box-shadow: 0 0 0 2px rgba(74,222,128,.3);
}

.cb-close-btn {
  background: rgba(255,255,255,.15);
  border: none;
  border-radius: 8px;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background .2s;
}
.cb-close-btn:hover { background: rgba(255,255,255,.25); }

.cb-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--cb-bg);
  min-height: 220px;
  max-height: 320px;
}
.cb-messages::-webkit-scrollbar { width: 3px; }
.cb-messages::-webkit-scrollbar-thumb { background: #E0DDD8; border-radius: 4px; }

.cb-msg-row { display: flex; align-items: flex-end; gap: 7px; }
.cb-msg-row.user { flex-direction: row-reverse; }

.cb-bot-avatar {
  width: 26px; height: 26px;
  background: linear-gradient(135deg, var(--cb-primary), var(--cb-primary-dark));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.cb-bubble {
  max-width: 84%;
  padding: 10px 14px;
  border-radius: 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  line-height: 1.62;
  word-break: break-word;
}
.cb-bubble.bot {
  background: #fff;
  color: var(--cb-text);
  border: 1px solid var(--cb-border);
  border-radius: 4px 14px 14px 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.cb-bubble.user {
  background: var(--cb-primary);
  color: #fff;
  border-radius: 14px 14px 4px 14px;
}

/* Typing indicator */
.cb-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
}
.cb-dot {
  width: 7px; height: 7px;
  background: var(--cb-primary);
  border-radius: 50%;
  opacity: .6;
  animation: cbdot 1.3s ease-in-out infinite;
}
.cb-dot:nth-child(2) { animation-delay: .18s; }
.cb-dot:nth-child(3) { animation-delay: .36s; }
@keyframes cbdot {
  0%, 60%, 100% { transform: translateY(0); opacity: .6; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* Quick replies */
.cb-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px 10px;
  border-top: 1px solid var(--cb-border);
  background: #fff;
}
.cb-qbtn {
  background: var(--cb-bg);
  border: 1px solid var(--cb-border);
  border-radius: 20px;
  padding: 5px 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--cb-muted);
  cursor: pointer;
  transition: all .18s;
  white-space: nowrap;
}
.cb-qbtn:hover {
  background: rgba(155,58,90,.07);
  border-color: var(--cb-primary);
  color: var(--cb-primary);
}

/* Input row */
.cb-input-row {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--cb-border);
  background: #fff;
  flex-shrink: 0;
}
.cb-input {
  flex: 1;
  border: 1.5px solid var(--cb-border);
  border-radius: 10px;
  padding: 9px 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  color: var(--cb-text);
  outline: none;
  background: var(--cb-bg);
  transition: border-color .2s;
  resize: none;
  min-height: 38px;
  max-height: 90px;
}
.cb-input:focus { border-color: var(--cb-primary); background: #fff; }
.cb-send {
  background: var(--cb-primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background .2s;
}
.cb-send:hover:not(:disabled) { background: var(--cb-primary-dark); }
.cb-send:disabled { opacity: .5; cursor: not-allowed; }

/* Offline banner */
.cb-offline {
  background: #FEF9C3;
  border-top: 1px solid #FDE68A;
  padding: 7px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #92400E;
  text-align: center;
  flex-shrink: 0;
}

/* Confidence badge */
.cb-conf {
  font-size: 10px;
  color: rgba(155,58,90,.6);
  padding: 0 4px;
  align-self: flex-end;
  font-family: 'DM Sans', sans-serif;
}

@keyframes cbspin { to { transform: rotate(360deg); } }
`;

const QUICK_REPLIES = [
  'How does adoption work?',
  'How long does it take?',
  'What documents do I need?',
  'How can I sponsor?',
  'Find orphanages near me',
  'Is it free to use?',
];

const WELCOME_MSG = {
  role: 'bot',
  text: "Hello! 👋 I'm the LittleBridge assistant, powered by our own NLP model. I can help with adoption guidance, sponsorship, document requirements, and platform navigation. How can I help you today?",
};

// Icon components
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const BotIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

const Spinner = ({ color = 'white', size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'cbspin .8s linear infinite', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke={color === 'white' ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.15)'} strokeWidth="2.5"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke={color === 'white' ? 'white' : '#0F2854'} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export default function ChatbotWidget() {
  const location = useLocation();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [unread, setUnread] = useState(0);
  const [offline, setOffline] = useState(false);
  const [convId] = useState(() => `lb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Hide on login/signup pages
  const HIDDEN_PATHS = ['/login', '/signup'];
  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    setInput('');
    setShowQuick(false);
    setLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', text: content }]);

    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversation_id: convId,
          user_context: user ? {
            user_id: user.userId,
            user_type: user.userType,
            user_name: user.firstName,
          } : {},
        }),
        signal: AbortSignal.timeout(8000),
      });

      const data = await res.json();
      setOffline(false);

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.response,
          intent: data.intent,
          confidence: data.confidence,
        }]);
        if (!open) setUnread(n => n + 1);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      const isNetworkErr = err.name === 'TypeError' || err.name === 'TimeoutError';

      if (isNetworkErr) {
        setOffline(true);
        // Provide helpful offline fallback using keyword matching
        const offlineResponse = getOfflineFallback(content);
        setMessages(prev => [...prev, { role: 'bot', text: offlineResponse, offline: true }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: 'I had a brief hiccup. Could you try again?',
        }]);
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, open, user, convId]);

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{S}</style>

      {/* FAB */}
      <button className="cb-fab" onClick={() => setOpen(o => !o)} aria-label="Open LittleBridge Assistant">
        <div className="cb-pulse"/>
        {unread > 0 && !open && <div className="cb-badge">{unread}</div>}
        {open ? <CloseIcon/> : <ChatIcon/>}
      </button>

      {/* Chat window */}
      {open && (
        <div className="cb-window">

          {/* Header */}
          <div className="cb-header">
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div className="cb-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C12 21 4 15 4 9C4 6.79 5.79 5 8 5C9.5 5 10.8 5.8 11.5 7C12.2 5.8 13.5 5 15 5C17.21 5 19 6.79 19 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <circle cx="17" cy="15" r="4" stroke="white" strokeWidth="1.6" fill="none"/>
                  <path d="M15.5 15L16.5 16L18.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.2 }}>
                  LittleBridge Assistant
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.65)', display:'flex', alignItems:'center' }}>
                  <span className="cb-status-dot"/>
                  {offline ? 'Limited mode' : 'Powered by NLP · Always here'}
                </div>
              </div>
            </div>
            <button className="cb-close-btn" onClick={() => setOpen(false)}><CloseIcon/></button>
          </div>

          {/* Offline notice */}
          {offline && (
            <div className="cb-offline">
              Chatbot service offline. Basic responses only. Start the Flask server.
            </div>
          )}

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg-row ${m.role}`}>
                {m.role === 'bot' && (
                  <div className="cb-bot-avatar"><BotIcon/></div>
                )}
                <div className={`cb-bubble ${m.role}`}>{m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="cb-msg-row">
                <div className="cb-bot-avatar"><BotIcon/></div>
                <div className="cb-bubble bot">
                  <div className="cb-typing">
                    <div className="cb-dot"/><div className="cb-dot"/><div className="cb-dot"/>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>

          {/* Quick replies */}
          {showQuick && (
            <div className="cb-quick">
              {QUICK_REPLIES.map(q => (
                <button key={q} className="cb-qbtn" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="cb-input-row">
            <textarea
              ref={inputRef}
              className="cb-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
              disabled={loading}
              rows={1}
            />
            <button
              className="cb-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? <Spinner/> : <SendIcon/>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Offline keyword fallback ──────────────────────────────────
function getOfflineFallback(text) {
  const t = text.toLowerCase();

  if (/adopt|parent|child placement/.test(t))
    return "Adoption involves 7 stages over ~6 months: Document Prep → Application → Background Check → Home Study → Legal Review → Final Approval → Child Placement. Sign up and use the Dashboard to track your progress.";

  if (/document|paper|certif|id|passport/.test(t))
    return "Required adoption documents: National ID, Birth Certificate, Marriage Certificate, Proof of Income, Bank Statements (6 months), Medical Certificate, Police Clearance, and 2 Reference Letters.";

  if (/how long|time|month|duration/.test(t))
    return "The adoption process takes approximately 6 months. The longest stage is Legal Review (6-8 weeks). Document preparation is the fastest when you're organised.";

  if (/sponsor|donat|give|contribut/.test(t))
    return "You can sponsor orphanages with money, clothes, books, food, or medical supplies. No account needed — visit the Sponsorship page and donate as a guest.";

  if (/orphanage|home|center/.test(t))
    return "All orphanages on LittleBridge are verified by NGOs. Visit the Orphanages page to browse all listings across Sri Lanka.";

  if (/guest|anonymous|no account/.test(t))
    return "Yes! You can donate anonymously as a guest. Click 'Continue as Guest Sponsor' on the login page — no account required.";

  if (/contact|email|phone|address/.test(t))
    return "Contact us: lttlbrdg@gmail.com | +94 11 265 6163 | No. 5, Park Street, Colombo 5, Sri Lanka.";

  return "I'm currently in limited mode (offline). For full assistance, please ensure the chatbot service is running. You can also contact us at lttlbrdg@gmail.com.";
}
