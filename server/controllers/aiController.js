const AiLead = require("../models/AiLead");
const axios = require("axios");

exports.triggerCall = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // 1. Save to your MongoDB first
    const newLead = await AiLead.create({ name, email, phone });

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.AI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    // 2. Create Lead on AI Backend
    const leadRes = await axios.post(
      `${process.env.AI_BACKEND_URL}/api/v1/leads/`,
      { name, email, phone_number: phone },
      config,
    );

    const remoteLeadId = leadRes.data.id;
    newLead.aiSystemId = remoteLeadId;
    await newLead.save();

    // 3. Trigger the Call
    const callRes = await axios.post(
      `${process.env.AI_BACKEND_URL}/api/v1/calls/make-call`,
      {
        agent_id: parseInt(process.env.AI_AGENT_ID),
        to_number: phone,
        lead_id: remoteLeadId,
      },
      config,
    );

    // 4. Update Status
    newLead.status = "called";
    newLead.callSid = callRes.data.call_sid;
    await newLead.save();

    res.status(200).json({ success: true, message: "Call Initiated" });
  } catch (error) {
    console.error("AI Call Error:", error?.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to trigger call" });
  }
};


exports.getCalls = async (req, res) => {
  try {
    // Fetch all leads, sorted by newest first
    const leads = await AiLead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    console.error("Error fetching AI calls:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};