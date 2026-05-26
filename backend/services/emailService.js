const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM  = process.env.FROM_EMAIL  || 'onboarding@resend.dev';
const ADMIN = process.env.ADMIN_EMAIL || 'lttlbrdg@gmail.com';

const P = '#0F2854';
const G = '#C8963E';

async function send(to, subject, html) {
  try {
    const { data, error } = await resend.emails.send({
      from:    `LittleBridge <${FROM}>`,
      to:      [to],
      subject,
      html,
    });
    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }
    console.log(`Email sent → ${to} | ${subject} [id: ${data?.id}]`);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email send exception:', err.message);
    return { success: false, error: err.message };
  }
}

function wrap(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#F0F6FF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FF;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,40,84,0.1);">
  <tr><td style="background:linear-gradient(135deg,${P},#1C4D8D);padding:36px 40px;text-align:center;">
    <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px;">Little Bridge</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Connecting Children with Loving Families</p>
    <div style="width:40px;height:2px;background:${G};margin:14px auto 0;border-radius:2px;"></div>
  </td></tr>
  <tr><td style="padding:36px 40px;">${bodyHtml}</td></tr>
  <tr><td style="background:#F0F6FF;padding:24px 40px;text-align:center;border-top:1px solid #C8D8EC;">
    <p style="margin:0;font-size:12px;color:#8A9AB5;">© ${new Date().getFullYear()} LittleBridge · Colombo, Sri Lanka</p>
    <p style="margin:6px 0 0;font-size:12px;color:#8A9AB5;">
      <a href="mailto:lttlbrdg@gmail.com" style="color:${P};text-decoration:none;">lttlbrdg@gmail.com</a>
      &nbsp;·&nbsp; +94 11 265 6163
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

const h2  = t => `<h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:22px;color:${P};">${t}</h2>`;
const p   = t => `<p style="margin:0 0 14px;font-size:15px;color:#4A5A78;line-height:1.7;">${t}</p>`;
const btn = (t, href) => `<div style="margin:24px 0;"><a href="${href}" style="display:inline-block;background:${P};color:#fff;text-decoration:none;padding:13px 28px;border-radius:9px;font-size:15px;font-weight:600;">${t}</a></div>`;
const info = (label, value) => `<div style="display:flex;margin-bottom:8px;"><span style="min-width:180px;font-size:13px;color:#8A9AB5;font-weight:600;">${label}</span><span style="font-size:13px;color:${P};font-weight:600;">${value}</span></div>`;
const box  = inner => `<div style="background:#F0F6FF;border-radius:10px;padding:20px 24px;margin:0 0 20px;">${inner}</div>`;
const successBox = inner => `<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px 22px;margin:0 0 20px;">${inner}</div>`;
const warnBox  = inner => `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:16px 22px;margin:0 0 20px;">${inner}</div>`;
const dangerBox = inner => `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:16px 22px;margin:0 0 20px;">${inner}</div>`;

const CATEGORY_LABELS = {
  monetary:   'Monetary donation',
  clothes:    'Clothes',
  books:      'Books',
  food:       'Food',
  medical:    'Medical supplies',
  educational:'Educational equipment',
  toys:       'Toys',
  essentials: 'Essential items',
  art:        'Art supplies',
  sports:     'Sports equipment',
};

const catLabel = c => CATEGORY_LABELS[c] || c || 'Goods';

const emailService = {

  // ── Contact form ──────────────────────────────────────────
  async sendContactFormEmail(firstName, lastName, email, interest, message) {
    const html = wrap('New Contact Form Submission', `
      ${h2('New Contact Form Submission')}
      ${p('A message was received via the LittleBridge contact form.')}
      ${box(`${info('From', `${firstName} ${lastName}`)}${info('Email', email)}${info('Interest', interest)}`)}
      <div style="background:#fff;border:1.5px solid #C8D8EC;border-radius:10px;padding:18px 22px;margin:0 0 20px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#8A9AB5;text-transform:uppercase;letter-spacing:1px;">Message</p>
        <p style="margin:0;font-size:14px;color:#4A5A78;line-height:1.7;">${message}</p>
      </div>
      ${p(`Reply directly to <a href="mailto:${email}" style="color:${P};">${email}</a>`)}
    `);
    return send(ADMIN, `[LittleBridge Contact] ${interest} — ${firstName} ${lastName}`, html);
  },

  // ── Welcome / Registration ────────────────────────────────
  async sendWelcomeEmail(toEmail, firstName, userType) {
    const roleLabel = {
      adopter:   'Adoptive Parent',
      sponsor:   'Sponsor / Donor',
      both:      'Adopter & Sponsor',
      orphanage: 'Orphanage Account',
    }[userType] || userType;

    const html = wrap(`Welcome to LittleBridge, ${firstName}!`, `
      ${h2(`Welcome to LittleBridge, ${firstName}!`)}
      ${p(`Your account has been created as a <strong>${roleLabel}</strong>. We're glad you're here.`)}
      ${p('LittleBridge connects adoptive families, generous sponsors, and verified orphanages across Sri Lanka — with transparency and accountability at every step.')}
      ${successBox(`<p style="margin:0;font-size:14px;color:#15803D;font-weight:600;">✓ Account created successfully</p>`)}
      ${btn('Visit Your Dashboard', 'http://localhost:5173/dashboard')}
      ${p('If you have any questions, contact us at lttlbrdg@gmail.com — we respond within one business day.')}
    `);
    return send(toEmail, `Welcome to LittleBridge, ${firstName}!`, html);
  },

  // ── Adoption initiated ────────────────────────────────────
  async sendApplicationInitiatedEmail(toEmail, firstName, orphanageName, applicationId, expectedDate) {
    const html = wrap('Adoption Application Started', `
      ${h2(`Your Adoption Journey Has Begun, ${firstName}!`)}
      ${p(`Your adoption application for <strong>${orphanageName}</strong> has been initiated successfully.`)}
      ${box(`${info('Orphanage', orphanageName)}${info('Application ID', `#${applicationId}`)}${info('Expected Completion', expectedDate)}${info('Current Stage', 'Document Preparation')}`)}
      ${p('Your first step is to upload all required documents. Log in to your dashboard to get started.')}
      ${btn('Go to My Application', `http://localhost:5173/adoption/details/${applicationId}`)}
      ${p('<strong>Required Documents:</strong> National Identity Card, Birth Certificate, Marriage Certificate, Police Report, Income Certificate, Property Documents, Medical Report, Bank Statements (6 months).')}
    `);
    return send(toEmail, `Adoption application started — ${orphanageName}`, html);
  },

  // ── Document uploaded ─────────────────────────────────────
  async sendDocumentUploadedEmail(toEmail, firstName, documentName, applicationId, orphanageName) {
    const html = wrap('Document Uploaded', `
      ${h2(`Document Uploaded, ${firstName}!`)}
      ${successBox(`<p style="margin:0;font-size:14px;color:#15803D;font-weight:600;">✓ Received — pending verification by Childcare Services</p>`)}
      ${box(`${info('Document', documentName)}${info('Application', `#${applicationId} — ${orphanageName}`)}`)}
      ${btn('View My Application', `http://localhost:5173/adoption/details/${applicationId}`)}
    `);
    return send(toEmail, `Document uploaded: ${documentName}`, html);
  },

  // ── Document approved ─────────────────────────────────────
  async sendDocumentApprovedEmail(toEmail, firstName, documentName, applicationId, notes) {
    const html = wrap('Document Verified ✓', `
      ${h2(`Great news, ${firstName}!`)}
      ${p(`Your <strong>${documentName}</strong> has been <strong style="color:#15803D;">verified and approved</strong> by the Childcare Services Department.`)}
      ${notes ? `${successBox(`<p style="margin:0;font-size:13px;color:#15803D;"><strong>Note from Childcare:</strong> ${notes}</p>`)}` : ''}
      ${btn('View My Application', `http://localhost:5173/adoption/details/${applicationId}`)}
    `);
    return send(toEmail, `Document approved: ${documentName}`, html);
  },

  // ── Document rejected ─────────────────────────────────────
  async sendDocumentRejectedEmail(toEmail, firstName, documentName, applicationId, notes) {
    const html = wrap('Document Needs Attention', `
      ${h2(`Action Required, ${firstName}`)}
      ${p(`Your <strong>${documentName}</strong> needs to be resubmitted.`)}
      ${notes ? `${dangerBox(`<p style="margin:0;font-size:13px;color:#DC2626;"><strong>Reason:</strong> ${notes}</p>`)}` : ''}
      ${p('Please log in, upload a corrected version of this document, and resubmit.')}
      ${btn('Resubmit Document', `http://localhost:5173/adoption/details/${applicationId}`)}
    `);
    return send(toEmail, `Document update required: ${documentName}`, html);
  },

  // ── Stage completed ───────────────────────────────────────
  async sendStageCompletedEmail(toEmail, firstName, completedStage, nextStage, applicationId) {
    const html = wrap('Stage Completed 🎉', `
      ${h2(`Stage Complete, ${firstName}!`)}
      ${p(`You have successfully completed <strong>${completedStage}</strong>.`)}
      ${nextStage ? p(`Your application has advanced to: <strong>${nextStage}</strong>`) : p('Congratulations on your continued progress!')}
      ${btn('View My Progress', `http://localhost:5173/adoption/details/${applicationId}`)}
    `);
    return send(toEmail, `Stage completed: ${completedStage}`, html);
  },

  // ── Orphanage registration received ──────────────────────
  async sendOrphanageRegistrationEmail(toEmail, orphanageName) {
    const html = wrap('Registration Received', `
      ${h2(`Registration Received — ${orphanageName}`)}
      ${p('Your orphanage registration has been submitted and is under review by the Probation & Child Care Services Department.')}
      ${warnBox(`<p style="margin:0;font-size:14px;color:#92400E;font-weight:600;">⏳ Status: Pending Review</p><p style="margin:8px 0 0;font-size:13px;color:#92400E;">Review typically takes 3–5 business days. You will receive an email with the outcome.</p>`)}
      ${p('Questions? Contact us at lttlbrdg@gmail.com')}
    `);
    return send(toEmail, `Registration received — ${orphanageName}`, html);
  },

  // ── Orphanage approved ────────────────────────────────────
  async sendOrphanageApprovedEmail(toEmail, orphanageName) {
    const html = wrap('Orphanage Approved!', `
      ${h2(`${orphanageName} is now live on LittleBridge!`)}
      ${successBox(`<p style="margin:0;font-size:14px;color:#15803D;font-weight:600;">✓ Approved by the Probation & Child Care Services Department</p>`)}
      ${p('Your orphanage is now listed and can be found by adoptive families and sponsors across Sri Lanka.')}
      ${btn('View Your Orphanage Dashboard', 'http://localhost:5173/dashboard')}
      ${p('You can now manage donation needs, respond to sponsorship requests, and track your listings from your dashboard.')}
    `);
    return send(toEmail, `${orphanageName} is now approved on LittleBridge!`, html);
  },

  // ── Orphanage rejected ────────────────────────────────────
  async sendOrphanageRejectedEmail(toEmail, orphanageName, reason) {
    const html = wrap('Registration Update', `
      ${h2(`Registration Update — ${orphanageName}`)}
      ${p('After review, your registration requires additional information.')}
      ${reason ? `${dangerBox(`<p style="margin:0;font-size:13px;color:#DC2626;"><strong>Reason:</strong> ${reason}</p>`)}` : ''}
      ${p('Please contact us at lttlbrdg@gmail.com to discuss next steps.')}
    `);
    return send(toEmail, `Registration update — ${orphanageName}`, html);
  },

  // ── Admin: new orphanage alert ────────────────────────────
  async sendAdminNewOrphanageAlert(orphanageName, city, email) {
    const html = wrap('New Orphanage Registration', `
      ${h2('New Orphanage Registration')}
      ${p('A new orphanage has submitted a registration request on LittleBridge.')}
      ${box(`${info('Name', orphanageName)}${info('City', city)}${info('Email', email || 'Not provided')}${info('Status', 'Pending Review')}`)}
      ${btn('Review in Childcare Dashboard', 'http://localhost:5173/childcare/dashboard')}
    `);
    return send(ADMIN, `New orphanage registration: ${orphanageName}`, html);
  },

  // ── Booking notification to orphanage ────────────────────
  async sendBookingNotificationToOrphanage(toEmail, orphanageName, visitorName, visitType, date, detailsHtml) {
    const html = wrap('New Request Received', `
      ${h2(`New ${visitType} request — ${orphanageName}`)}
      ${p(`A new request was received from <strong>${visitorName}</strong>.`)}
      ${detailsHtml || ''}
      ${btn('View in Dashboard', 'http://localhost:5173/dashboard')}
    `);
    return send(toEmail, `New ${visitType} request for ${orphanageName}`, html);
  },

  // ══════════════════════════════════════════════════════════
  // NEW — Sponsorship / Donation emails (Issue 3)
  // ══════════════════════════════════════════════════════════

  /**
   * Sent to the DONOR immediately after they submit a donation request.
   */
  async sendSponsorshipReceivedEmail(toEmail, firstName, orphanageName, category, amount, scheduledDate) {
    const catText  = catLabel(category);
    const amtText  = amount ? `LKR ${parseFloat(amount).toLocaleString()}` : null;
    const dateText = scheduledDate
      ? new Date(scheduledDate).toLocaleDateString('en-LK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      : null;

    const html = wrap('Donation Request Submitted', `
      ${h2(`Thank you, ${firstName}!`)}
      ${p(`Your donation request to <strong>${orphanageName}</strong> has been submitted. The orphanage will review and confirm it shortly.`)}
      ${successBox(`<p style="margin:0;font-size:14px;color:#15803D;font-weight:600;">✓ Request received — awaiting orphanage confirmation</p>`)}
      ${box(`
        ${info('Orphanage', orphanageName)}
        ${info('Donation type', catText)}
        ${amtText  ? info('Amount', amtText)             : ''}
        ${dateText ? info('Preferred delivery', dateText) : ''}
      `)}
      ${p('You will receive another email once the orphanage confirms your donation.')}
      ${btn('View My Donations', 'http://localhost:5173/dashboard')}
    `);
    return send(toEmail, `Donation request submitted — ${orphanageName}`, html);
  },

  /**
   * Sent to the DONOR when the orphanage confirms the donation.
   */
  async sendDonationConfirmedEmail(toEmail, firstName, orphanageName, category) {
    const catText = catLabel(category);

    const html = wrap('Donation Confirmed! 🎉', `
      ${h2(`Your donation has been confirmed, ${firstName}!`)}
      ${successBox(`<p style="margin:0;font-size:14px;color:#15803D;font-weight:600;">✓ ${orphanageName} has confirmed your ${catText} donation</p>`)}
      ${p(`The children at <strong>${orphanageName}</strong> are looking forward to receiving your generous contribution. Thank you for making a difference!`)}
      ${btn('View My Donations', 'http://localhost:5173/dashboard')}
    `);
    return send(toEmail, `Donation confirmed — ${orphanageName}`, html);
  },

  /**
   * Sent to the ORPHANAGE email address when a new donation request comes in.
   */
  async sendNewDonationToOrphanageEmail(toEmail, orphanageName, donorName, isAnonymous, category, amount, description, scheduledDate) {
    const catText    = catLabel(category);
    const donorLabel = isAnonymous ? 'Anonymous Donor' : (donorName || 'Someone');
    const amtText    = amount ? `LKR ${parseFloat(amount).toLocaleString()}` : null;
    const dateText   = scheduledDate
      ? new Date(scheduledDate).toLocaleDateString('en-LK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      : null;

    const html = wrap('New Donation Request', `
      ${h2(`New donation request — ${orphanageName}`)}
      ${p(`<strong>${donorLabel}</strong> has submitted a donation request for your orphanage. Please log in to confirm or decline.`)}
      ${box(`
        ${info('Donor', donorLabel)}
        ${info('Donation type', catText)}
        ${amtText    ? info('Amount',            amtText)    : ''}
        ${description ? info('Description',      description) : ''}
        ${dateText   ? info('Preferred delivery', dateText)  : ''}
      `)}
      ${warnBox(`<p style="margin:0;font-size:13px;color:#92400E;font-weight:600;">Action required — please confirm or decline in your dashboard.</p>`)}
      ${btn('View in Orphanage Dashboard', 'http://localhost:5173/dashboard')}
    `);
    return send(toEmail, `New donation request — ${catText}`, html);
  },
};

module.exports = emailService;