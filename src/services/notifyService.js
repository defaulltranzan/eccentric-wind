/* Optional email alerts for new bookings (SMTP — Gmail app password, Zoho,
 * Brevo, etc). Silently disabled until SMTP_HOST, SMTP_USER, SMTP_PASS and
 * BOOKING_NOTIFY_TO are set. */
const env = require('../config/env');

let transport = null;
const enabled = () => !!(env.mail.host && env.mail.user && env.mail.pass && env.mail.to);

function getTransport() {
  if (!transport) {
    const nodemailer = require('nodemailer');
    transport = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure,
      auth: { user: env.mail.user, pass: env.mail.pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000
    });
  }
  return transport;
}

const line = (label, value) => (value ? label + ': ' + value + '\n' : '');

async function bookingReceived(b) {
  if (!enabled()) return false;
  const subject = 'New booking ' + b.ref + ' — ' + b.trip_name + ' (' + b.people + ' pax)';
  const body =
    'A new booking request came in on the website.\n\n' +
    line('Reference', b.ref) +
    line('Trip', b.trip_name) +
    line('Name', b.name) +
    line('Email', b.email) +
    line('Phone / WhatsApp', b.phone) +
    line('People', String(b.people)) +
    line('Preferred date', b.preferred_date) +
    (b.message ? '\nMessage:\n' + b.message + '\n' : '') +
    '\nManage it at ' + env.siteUrl + '/admin#/bookings\n';

  const t = getTransport();
  await t.sendMail({ from: env.mail.from, to: env.mail.to, replyTo: b.email, subject, text: body });
  if (env.mail.customerCopy) {
    await t.sendMail({
      from: env.mail.from,
      to: b.email,
      subject: 'We received your request — ' + b.ref,
      text: 'Namaste ' + b.name + ',\n\nThank you for contacting Himalayan Magic Adventure about ' + b.trip_name +
        '. An expedition director will reply within 24 hours.\n\nYour reference: ' + b.ref + '\n\nHimalayan Magic Adventure, Kathmandu'
    }).catch((err) => console.error('[mail] customer copy failed:', err.message));
  }
  return true;
}

module.exports = { enabled, bookingReceived };
