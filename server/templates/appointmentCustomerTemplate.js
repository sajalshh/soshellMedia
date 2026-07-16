module.exports = ({ name, date, time }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin-bottom: 10px;">Hey ${name} 👋</h2>

      <p>
        Your appointment with <b>Soshell Media</b> is confirmed! 🎉
      </p>

      <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 10px;">
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 160px;">Date:</td>
          <td style="padding: 8px;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Time:</td>
          <td style="padding: 8px;">${time} (America/Toronto)</td>
        </tr>
      </table>

      <p style="margin-top: 20px;">
        We look forward to speaking with you. If you need to reschedule,
        just reply to this email or contact us.
      </p>

      <p style="margin-top: 20px;">
        Regards,<br/>
        <b>Soshell Media Team</b>
      </p>

      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        This is an automated confirmation email.
      </p>
    </div>
  `;
};
