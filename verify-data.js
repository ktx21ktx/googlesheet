require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const GOOGLE_CREDENTIALS = path.join(__dirname, 'service-account-key.json');
const SHEET_ID = process.env.SHEET_ID;

async function verifyData() {
  try {
    console.log('📋 Google Sheet 데이터 확인 중...\n');

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
      range: `'${sheetName}'!A:D`,
    });

    const values = result.data.values || [];

    console.log(`✅ 시트명: ${sheetName}`);
    console.log(`✅ 총 행 수: ${values.length} (헤더 포함)\n`);

    console.log('📊 저장된 모든 데이터:\n');

    if (values.length > 0) {
      // 헤더
      console.log(
        values[0]
          .map((cell, i) => {
            const padding = [30, 15, 15, 15][i] || 15;
            return String(cell).padEnd(padding);
          })
          .join('│')
      );
      console.log('─'.repeat(75));

      // 데이터 행
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        console.log(
          (row[0] || '').padEnd(30) +
            '│' +
            (row[1] || '').padEnd(15) +
            '│' +
            (row[2] || '').padEnd(15) +
            '│' +
            (row[3] || '').padEnd(15)
        );
      }

      console.log('\n✅ 테스트 완료! 모든 예약 데이터가 Google Sheet에 저장되었습니다.\n');
      console.log('📱 저장된 예약 수:', values.length - 1, '건');
    }
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

verifyData();
