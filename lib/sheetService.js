const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function initializeSheets() {
  const credPath = path.join(process.cwd(), 'service-account-key.json');
  let auth;

  if (fs.existsSync(credPath)) {
    auth = new google.auth.GoogleAuth({
      keyFile: credPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else {
    let credentials;

    if (process.env.GOOGLE_CREDENTIALS) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      } catch (err) {
        throw new Error('INVALID_CREDENTIALS_JSON');
      }
    } else if (process.env.GOOGLE_CREDENTIALS_BASE64) {
      try {
        const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
        credentials = JSON.parse(decoded);
      } catch (err) {
        throw new Error('INVALID_BASE64_CREDENTIALS');
      }
    } else {
      throw new Error('CREDENTIALS_NOT_FOUND');
    }

    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  return google.sheets({ version: 'v4', auth });
}

async function appendReservation(sheetsAPI, sheetId, data) {
  const spreadsheet = await sheetsAPI.spreadsheets.get({
    spreadsheetId: sheetId,
  });
  const sheetName = spreadsheet.data.sheets[0].properties.title;

  // Phone, Email 순서로 저장
  const values = [[data.timestamp, data.userName, data.checkIn, data.checkOut, data.guests, data.phone || '', data.email || '']];

  return await sheetsAPI.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `'${sheetName}'!A:G`,
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  });
}

module.exports = { initializeSheets, appendReservation };
