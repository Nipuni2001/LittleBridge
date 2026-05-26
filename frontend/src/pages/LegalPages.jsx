import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, FileText, Cookie } from 'lucide-react';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--p:#0F2854;--gold:#C8963E;--text:#1C1C2E;--muted:#504E5E;--border:#E8E4DF;--bg:#FAFAF8;--cream:#F5F2EC;}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);}
.lp-nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;}
.lp-gold{height:3px;background:linear-gradient(90deg,var(--gold),#E8B96B,var(--gold));}
.lp-body{max-width:780px;margin:0 auto;padding:56px 24px 80px;}
h1{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,42px);font-weight:700;color:var(--text);line-height:1.2;margin-bottom:12px;}
h2{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text);margin:36px 0 12px;}
h3{font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;color:var(--text);margin:20px 0 8px;}
p{font-family:'DM Sans',sans-serif;font-size:15px;color:var(--muted);line-height:1.78;margin-bottom:14px;}
ul{padding-left:22px;margin-bottom:14px;}
li{font-family:'DM Sans',sans-serif;font-size:15px;color:var(--muted);line-height:1.75;margin-bottom:6px;}
.meta{font-family:'DM Sans',sans-serif;font-size:13px;color:#9A8F8A;margin-bottom:32px;}
.section-divider{border:none;border-top:1px solid var(--border);margin:28px 0;}
.highlight-box{background:rgba(155,58,90,0.05);border-left:3px solid var(--p);border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;}
`;

const PRIVACY = (
  <>
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
      <div style={{ width:52, height:52, background:'rgba(155,58,90,0.08)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Shield size={24} color="#0F2854"/>
      </div>
      <div>
        <h1 style={{ marginBottom:0 }}>Privacy Policy</h1>
      </div>
    </div>
    <p className="meta">LittleBridge &nbsp;·&nbsp; Last Updated: 4 April 2026</p>
    <p>This Privacy Policy explains how LittleBridge ("we," "our," "us") collects, uses, and protects the information you provide when you access and use the LittleBridge web application ("Platform"). By using the Platform, you agree to the terms of this Privacy Policy.</p>
    <hr className="section-divider"/>
    <h2>1. Data We Collect</h2>
    <h3>1.1 Personal Information</h3>
    <ul><li>Full name</li><li>Email address</li><li>Contact number</li><li>Residential address</li><li>National identification details (where required for verification)</li></ul>
    <h3>1.2 Adoption-Related Information</h3>
    <ul><li>Documents uploaded for adoption processing</li><li>Application status and timeline data</li><li>Communication records within the system</li></ul>
    <h3>1.3 Sponsorship Information</h3>
    <ul><li>Donation records</li><li>Orphanage selection details</li><li>Location data (latitude and longitude) for nearby orphanage services</li></ul>
    <h3>1.4 Technical Information</h3>
    <ul><li>IP address</li><li>Browser type</li><li>Device information</li><li>Login activity and timestamps</li></ul>
    <h2>2. Why We Collect Your Data</h2>
    <p>We collect your data to:</p>
    <ul><li>Facilitate and track adoption processes</li><li>Enable document review and approval by authorized probation departments or NGOs</li><li>Connect sponsors with verified orphanages</li><li>Provide status updates and notifications</li><li>Improve system functionality and user experience</li><li>Maintain compliance with applicable Sri Lankan child protection regulations</li></ul>
    <p>We collect only information necessary to operate the Platform securely and transparently.</p>
    <h2>3. Data Security</h2>
    <p>LittleBridge is committed to protecting your data. We implement appropriate technical and administrative safeguards to prevent unauthorized access, misuse, or disclosure.</p>
    <div className="highlight-box"><p style={{ marginBottom:0 }}>Access to sensitive adoption documents is restricted to authorized personnel and relevant authorities involved in the approval process.</p></div>
    <h2>4. Data Sharing</h2>
    <p>LittleBridge does not sell, lease, or distribute personal information to third parties. Information may be shared only:</p>
    <ul><li>With authorized probation departments or NGOs for adoption verification</li><li>With verified orphanages where operationally necessary</li><li>If required by Sri Lankan law or legal order</li></ul>
    <h2>5. Cookie Policy</h2>
    <p>LittleBridge may use cookies to analyze website traffic, improve user experience, and maintain secure login sessions. Cookies do not give us control over your device. You may disable cookies through your browser settings if you choose.</p>
    <h2>6. Links to Other Websites</h2>
    <p>The Platform may contain links to external websites. LittleBridge is not responsible for the privacy practices of those websites. Users are advised to review their respective privacy policies.</p>
    <h2>7. Restricting or Updating Your Information</h2>
    <p>Users may request to access their personal data, correct inaccurate information, or request deletion of their account (subject to legal requirements related to adoption records). Requests can be submitted through our official contact email.</p>
    <h2>8. Policy Updates</h2>
    <p>LittleBridge reserves the right to update this Privacy Policy when necessary. Any changes will be posted on this page with the updated date.</p>
    <h2>9. Contact Information</h2>
    <p>For questions regarding this Privacy Policy, please contact:</p>
    <div className="highlight-box"><p style={{ marginBottom:4 }}><strong>LittleBridge</strong></p><p style={{ marginBottom:4 }}>lttlbrdg@gmail.com</p><p style={{ marginBottom:4 }}>+94 11 265 6163</p><p style={{ marginBottom:0 }}>No. 5, Park Street, Colombo 5, Sri Lanka</p></div>
  </>
);

const TERMS = (
  <>
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
      <div style={{ width:52, height:52, background:'rgba(200,150,62,0.1)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <FileText size={24} color="#C8963E"/>
      </div>
      <div><h1 style={{ marginBottom:0 }}>Terms &amp; Conditions</h1></div>
    </div>
    <p className="meta">LittleBridge &nbsp;·&nbsp; Last Updated: 4 April 2026</p>
    <p>These Terms and Conditions ("Terms") govern your access to and use of the LittleBridge web application ("Platform"). By accessing or using the Platform, you agree to comply with these Terms. If you do not agree, you must not use the Platform.</p>
    <hr className="section-divider"/>
    <h2>1. Purpose of the Platform</h2>
    <p>LittleBridge is a digital platform designed to provide structured guidance for adoption processes, facilitate document submission and timeline tracking, connect sponsors with verified orphanages, and enable communication between parents, orphanages, sponsors, and authorized probation departments or NGOs.</p>
    <div className="highlight-box"><p style={{ marginBottom:0 }}>The Platform operates to support child protection, transparency, and responsible engagement within Sri Lanka.</p></div>
    <h2>2. User Eligibility</h2>
    <p>By using the Platform, you confirm that you are at least 18 years of age, the information you provide is accurate and complete, and you will use the Platform only for lawful purposes. LittleBridge reserves the right to suspend or terminate accounts that provide false information or misuse the system.</p>
    <h2>3. User Roles and Responsibilities</h2>
    <h3>3.1 Parents / Prospective Adoptive Parents</h3>
    <ul><li>Must provide accurate and truthful documentation</li><li>Are responsible for maintaining confidentiality of login credentials</li><li>Acknowledge that submission of documents does not guarantee approval</li></ul>
    <h3>3.2 Sponsors</h3>
    <ul><li>May contribute voluntarily to verified orphanages</li><li>Acknowledge that donations are made at their own discretion</li><li>Must ensure that provided payment information is accurate</li></ul>
    <h3>3.3 Orphanage Staff</h3>
    <ul><li>Must provide accurate information regarding donation needs and events</li><li>Must update sponsorship status truthfully</li><li>Are responsible for maintaining the accuracy of their institutional information</li></ul>
    <h3>3.4 Probation Departments / NGOs</h3>
    <ul><li>May review and approve documentation in accordance with applicable regulations</li><li>Must use the Platform strictly for official and authorized purposes</li></ul>
    <h2>4. Adoption Process Disclaimer</h2>
    <p>LittleBridge serves as a facilitation and tracking platform. Final decisions regarding adoption approval remain under the authority of relevant Sri Lankan government bodies and authorized probation departments. The Platform does not guarantee adoption approval outcomes.</p>
    <h2>5. Sponsorship and Donations</h2>
    <p>LittleBridge provides a structured system for sponsorship visibility and transparency. Donations are voluntary. LittleBridge does not assume responsibility for the direct administration of orphanage funds beyond platform facilitation. Any disputes related to donations must be resolved between the relevant parties, subject to applicable laws.</p>
    <h2>6. Account Security</h2>
    <p>Users are responsible for maintaining the confidentiality of their login credentials. Any activity conducted through a user account is the responsibility of the account holder. LittleBridge reserves the right to suspend accounts suspected of unauthorized access or misuse.</p>
    <h2>7. Acceptable Use</h2>
    <p>Users agree not to upload false, misleading, or fraudulent documents; attempt unauthorized access to other user accounts; use the Platform for unlawful, harmful, or abusive activities; or disrupt or interfere with the security or functionality of the Platform. Violation of these terms may result in suspension or legal action.</p>
    <h2>8. Intellectual Property</h2>
    <p>All content, branding, design elements, and system architecture of LittleBridge are the intellectual property of the Platform and may not be copied, reproduced, or distributed without prior written consent.</p>
    <h2>9. Limitation of Liability</h2>
    <p>LittleBridge shall not be held liable for delays or decisions made by external authorities, technical interruptions beyond reasonable control, or indirect, incidental, or consequential damages arising from use of the Platform. Use of the Platform is at the user's own risk.</p>
    <h2>10. Termination</h2>
    <p>LittleBridge reserves the right to suspend or terminate user access in cases of violation of these Terms, fraudulent activity, or legal or regulatory requirements.</p>
    <h2>11. Amendments</h2>
    <p>LittleBridge may revise these Terms at any time. Updated versions will be published on this page with the revised date. Continued use of the Platform constitutes acceptance of the updated Terms.</p>
    <h2>12. Governing Law</h2>
    <p>These Terms and Conditions shall be governed by and interpreted in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes arising from use of the Platform shall be subject to the jurisdiction of Sri Lankan courts.</p>
    <h2>13. Contact Information</h2>
    <div className="highlight-box"><p style={{ marginBottom:4 }}><strong>LittleBridge</strong></p><p style={{ marginBottom:0 }}>lttlbrdg@gmail.com</p></div>
  </>
);

const COOKIES = (
  <>
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
      <div style={{ width:52, height:52, background:'rgba(155,58,90,0.06)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Cookie size={24} color="#0F2854"/>
      </div>
      <div><h1 style={{ marginBottom:0 }}>Cookie Policy</h1></div>
    </div>
    <p className="meta">LittleBridge &nbsp;·&nbsp; Last Updated: 4 April 2026</p>
    <p>This Cookie Policy explains how LittleBridge uses cookies on our Platform.</p>
    <hr className="section-divider"/>
    <h2>What Are Cookies?</h2>
    <p>Cookies are small text files placed on your device by a website when you visit it. They are widely used to make websites work, or work more efficiently, and to provide information to website owners.</p>
    <h2>How We Use Cookies</h2>
    <p>LittleBridge may use cookies to:</p>
    <ul><li><strong>Analyze website traffic</strong> — to understand how users interact with our Platform and improve performance</li><li><strong>Improve user experience</strong> — to remember your preferences and provide a smoother experience</li><li><strong>Maintain secure login sessions</strong> — to keep you securely signed in during your session</li></ul>
    <h2>Your Control Over Cookies</h2>
    <p>Cookies do not give us control over your device. You may disable cookies through your browser settings if you choose. Please note that disabling cookies may affect the functionality of certain features on the Platform, including secure login sessions.</p>
    <div className="highlight-box"><p style={{ marginBottom:0 }}>To manage cookies in your browser, refer to your browser's help documentation. Most browsers allow you to view, delete, or block cookies from specific websites.</p></div>
    <h2>Third-Party Cookies</h2>
    <p>The Platform may use third-party services (such as analytics providers) that place their own cookies. LittleBridge does not control these cookies. Please refer to the respective third-party privacy policies for more information.</p>
    <h2>Updates to This Policy</h2>
    <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with the updated date.</p>
    <h2>Contact</h2>
    <p>For questions about our cookie usage, contact us at <a href="mailto:lttlbrdg@gmail.com" style={{ color:'#0F2854', textDecoration:'none' }}>lttlbrdg@gmail.com</a>.</p>
  </>
);

export function PrivacyPage() { return <LegalPage content={PRIVACY} pageKey="privacy"/>; }
export function TermsPage() { return <LegalPage content={TERMS} pageKey="terms"/>; }
export function CookiePage() { return <LegalPage content={COOKIES} pageKey="cookies"/>; }

function LegalPage({ content, pageKey }) {
  const navigate = useNavigate();
  const links = [
    { key:'privacy', label:'Privacy Policy', path:'/privacy' },
    { key:'terms', label:'Terms & Conditions', path:'/terms' },
    { key:'cookies', label:'Cookie Policy', path:'/cookies' },
  ];
  return (
    <>
      <style>{S}</style>
      <div>
        <nav className="lp-nav">
          <div className="lp-gold"/>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:20 }}>
              <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#8A8799' }}>
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
            <div style={{ display:'flex', gap:8 }}>
              {links.map(l => (
                <button key={l.key} onClick={() => navigate(l.path)} style={{ background: pageKey===l.key?'rgba(155,58,90,0.08)':'none', border:'none', borderRadius:8, padding:'7px 14px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: pageKey===l.key?700:400, color: pageKey===l.key?'#0F2854':'#8A8799', cursor:'pointer', transition:'all .2s' }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="lp-body">
          {content}
        </div>

        <footer style={{ background:'#1C1C2E', color:'#fff', padding:'32px 24px', textAlign:'center' }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            © 2026 LittleBridge · Standing for Every Child's Future.
          </p>
        </footer>
      </div>
    </>
  );
}
