module.exports = ({ name, email, phone, purpose, date, time }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin-bottom: 10px;">📅 New Appointment Booked</h2>

      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 160px;">Name:</td>
          <td style="padding: 8px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Email:</td>
          <td style="padding: 8px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Phone:</td>
          <td style="padding: 8px;">${phone || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Date:</td>
          <td style="padding: 8px;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Time:</td>
          <td style="padding: 8px;">${time}</td>
        </tr>
      </table>

      <h3 style="margin-top: 20px;">Purpose:</h3>
      <div style="background:#f4f4f4; padding: 12px; border-radius: 6px;">
        ${(purpose || "").replace(/\n/g, "<br/>")}
      </div>

      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        This appointment was booked from the Soshell Media website.
      </p>
    </div>
  `;
};
