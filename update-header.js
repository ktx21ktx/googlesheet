require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const GOOGLE_CREDENTIALS = path.join(__dirname, 'service-account-key.json');
const SHEET_ID = process.env.SHEET_ID;

async function updateHeader() {
  try {
    console.log('📋 Google Sheet 헤더 업데이트 중...\n');

    const auth = new google.auth.GoogleAuth({
      keyFile: GOOGLE_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 시트 이름 가져오기
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    const sheetName = spreadsheet.data.sheets[0].properties.title;

    // 현재 헤더 확인
    const headerResult = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `'${sheetName}'!A1:E1`,
    });

    const currentHeader = headerResult.data.values?.[0] || [];
    console.log('현재 헤더:', currentHeader);

    // 새 헤더 설정
    const newHeader = ['Timestamp', '사용자명', 'Check-in', 'Check-out', 'Guests'];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `'${sheetName}'!A1:E1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [newHeader]
      }
    });

    console.log('\n✅ 헤더 업데이트 완료!');
    console.log('새 헤더:', newHeader);
    console.log('\n📊 이제 사용자명이 Google Sheet에 저장됩니다.\n');

  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

updateHeader();
