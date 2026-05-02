require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const GOOGLE_CREDENTIALS = path.join(__dirname, 'service-account-key.json');
const SHEET_ID = process.env.SHEET_ID || '';
const PORT = process.env.PORT || 3000;

async function initializeSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

app.post('/api/reserve', async (req, res) => {
  try {
    const { userName, checkIn, checkOut, guests } = req.body;

    console.log('[REQUEST] 예약 요청:', { userName, checkIn, checkOut, guests });

    if (!SHEET_ID) {
      return res.status(400).json({ error: '시트 ID가 설정되지 않았습니다' });
    }

    if (!userName || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
    }

    const sheets = await initializeSheets();

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const sheetName = spreadsheet.data.sheets[0].properties.title;

    const now = new Date().toLocaleString('ko-KR');
    const values = [[now, userName, checkIn, checkOut, guests]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `'${sheetName}'!A:E`,
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    console.log('[SUCCESS] 데이터 저장 완료');
    res.json({ success: true, message: '예약 정보가 저장되었습니다' });
  } catch (error) {
    console.error('[ERROR] 시트 저장 실패:', error.message);
    console.error('[ERROR] 상세:', { code: error.code, status: error.status });
    res.status(500).json({ error: '데이터 저장 실패', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});
