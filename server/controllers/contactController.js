const sendEmail = require("../services/emailService");
const adminEmailTemplate = require("../templates/adminEmailTemplate");
const customerEmailTemplate = require("../templates/customerEmailTemplate");

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, phone, email, category, message } = req.body;

    // Basic validation
    if (!name || !email || !category || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Category and Message are required.",
      });
    }

    // 1) Send email to ADMIN
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Contact Form Lead - ${category}`,
      html: adminEmailTemplate({ name, phone, email, category, message }),
    });

    // 2) Send confirmation email to CUSTOMER
    await sendEmail({
      to: email,
      subject: "✅ We received your message - Soshell Media",
      html: customerEmailTemplate({ name, category }),
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending email.",
    });
  }
};
