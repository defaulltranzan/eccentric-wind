/**
 * Handles incoming custom intent declarations and contact inquiries
 */
exports.submitInquiry = (req, res) => {
  const { name, email, trek, crew, message, phone } = req.body;

  const inquiryLog = {
    id: `INQ-${Date.now()}`,
    timestamp: new Date().toISOString(),
    name,
    email,
    phone: phone || 'Not Provided',
    trek,
    crew,
    message: message || 'Standard Expedition Intent Declaration',
    ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
  };

  console.log(`[+] New Expedition Inquiry Registered [${inquiryLog.id}]:`, inquiryLog.name, '->', inquiryLog.trek);

  res.status(201).json({
    status: 'success',
    message: `Intent successfully registered. An expedition director will contact you at ${email} within 24 hours.`,
    inquiryId: inquiryLog.id
  });
};
