require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const GOOGLE_CREDENTIALS = path.join(__dirname, 'service-account-key.json');
const SHEET_ID = process.env.SHEET_ID;

async function checkLatest() {
  try {
    console.log('📋 최신 예약 데이터 확인 중...\n');

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

    // 모든 데이터 조회
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `'${sheetName}'!A:E`,
    });

    const values = result.data.values || [];

    console.log('헤더:', values[0]);
    console.log('\n최근 3개 예약:\n');

    // 마지막 3개 행 표시
    for (let i = Math.max(1, values.length - 3); i < values.length; i++) {
      const row = values[i];
      console.log(`${i}번 행:`);
      console.log(`  - 시간: ${row[0] || '(없음)'}`);
      console.log(`  - 사용자명: ${row[1] || '(없음)'}`);
      console.log(`  - 입실일: ${row[2] || '(없음)'}`);
      console.log(`  - 퇴실일: ${row[3] || '(없음)'}`);
      console.log(`  - 인원수: ${row[4] || '(없음)'}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

checkLatest();
