module.exports = ({ name, category }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin-bottom: 10px;">Hey ${name} 👋</h2>

      <p>
        Thanks for reaching out to <b>Soshell Media</b>!
        We’ve received your message under the category:
        <b>${category}</b>.
      </p>

      <p>
        Our team will review it and get back to you shortly.
      </p>

      <p style="margin-top: 20px;">
        Regards,<br/>
        <b>Soshell Media Team</b>
      </p>

      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        This is an automated confirmation email. Please do not reply to this message.
      </p>
    </div>
  `;
};
