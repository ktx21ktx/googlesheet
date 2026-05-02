require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SHEET_ID = process.env.SHEET_ID;
let sheets = null;

async function initializeSheets() {
  if (!sheets) {
    // 파일 경로 탐색 (로컬 + Vercel)
    let credPath = path.join(process.cwd(), 'service-account-key.json');
    if (!fs.existsSync(credPath)) {
      credPath = path.join(__dirname, '..', 'service-account-key.json');
    }

    let auth;

    // 파일이 존재하면 keyFile로 인증
    if (fs.existsSync(credPath)) {
      auth = new google.auth.GoogleAuth({
        keyFile: credPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    }
    // 파일 없으면 환경 변수 사용
    else {
      let credentials;

      console.log('[DEBUG] 환경 변수 확인:');
      console.log('[DEBUG] GOOGLE_CREDENTIALS:', process.env.GOOGLE_CREDENTIALS ? '설정됨' : '없음');
      console.log('[DEBUG] GOOGLE_CREDENTIALS_BASE64:', process.env.GOOGLE_CREDENTIALS_BASE64 ? `설정됨 (${process.env.GOOGLE_CREDENTIALS_BASE64.length} chars)` : '없음');

      if (process.env.GOOGLE_CREDENTIALS) {
        console.log('[DEBUG] GOOGLE_CREDENTIALS 사용 중...');
        try {
          credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
          console.log('[DEBUG] GOOGLE_CREDENTIALS JSON 파싱 성공');
        } catch (err) {
          console.log('[DEBUG] GOOGLE_CREDENTIALS JSON 파싱 실패:', err.message);
          throw new Error('GOOGLE_CREDENTIALS JSON 파싱 실패: ' + err.message);
        }
      } else if (process.env.GOOGLE_CREDENTIALS_BASE64) {
        console.log('[DEBUG] GOOGLE_CREDENTIALS_BASE64 사용 중...');
        try {
          const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
          console.log('[DEBUG] Base64 디코딩 성공 (길이:', decoded.length, ')');
          credentials = JSON.parse(decoded);
          console.log('[DEBUG] JSON 파싱 성공, client_email:', credentials.client_email);
        } catch (err) {
          console.log('[DEBUG] Base64/JSON 처리 실패:', err.message);
          throw new Error('GOOGLE_CREDENTIALS_BASE64 디코딩 실패: ' + err.message);
        }
      } else {
        throw new Error('Google 인증 정보 없음. service-account-key.json 또는 환경 변수 필요');
      }

      auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    }

    sheets = google.sheets({ version: 'v4', auth });
  }
  return sheets;
}

module.exports = async (req, res) => {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: '메서드가 허용되지 않습니다' });
    return;
  }

  try {
    const { userName, checkIn, checkOut, guests } = req.body;

    console.log('[DEBUG] SHEET_ID value:', SHEET_ID);
    console.log('[DEBUG] SHEET_ID length:', SHEET_ID ? SHEET_ID.length : 'null');
    console.log('[DEBUG] SHEET_ID charCodes:', SHEET_ID ? SHEET_ID.split('').map(c => c.charCodeAt(0)).join(',') : 'null');

    if (!SHEET_ID) {
      return res.status(400).json({ error: '시트 ID가 설정되지 않았습니다' });
    }

    if (!userName || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
    }

    // Sheets 초기화
    const sheetsAPI = await initializeSheets();

    // 첫 번째 시트의 이름 가져오기
    const spreadsheet = await sheetsAPI.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    const sheetName = spreadsheet.data.sheets[0].properties.title;

    const now = new Date().toLocaleString('ko-KR');
    const values = [[now, userName, checkIn, checkOut, guests]];

    await sheetsAPI.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `'${sheetName}'!A:E`,
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    res.status(200).json({ success: true, message: '예약 정보가 저장되었습니다' });
  } catch (error) {
    console.error('시트 저장 오류:', error);
    console.error('[DEBUG] Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.status,
      details: error.details
    });
    res.status(500).json({
      error: '데이터 저장 실패',
      details: error.message
    });
  }
};
