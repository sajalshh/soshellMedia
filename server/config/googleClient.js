// server/config/googleClient.js

const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const KEY_FILE_PATH = path.join(__dirname, "google_credentials.json");
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send",
];

const credentials = JSON.parse(fs.readFileSync(KEY_FILE_PATH));
const client_email = credentials.client_email;
const private_key = credentials.private_key;

// THE FIX IS HERE: We are telling the service account which user to act on behalf of.
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
  clientOptions: {
    subject: "info@soshellmedia.co",
  },
});

const calendar = google.calendar({ version: "v3", auth });

// We export the email and key for Nodemailer to use
module.exports = { auth, calendar, client_email, private_key };
