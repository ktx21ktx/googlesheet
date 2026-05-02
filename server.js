const express = require('express');
const cors = require('cors');
const config = require('./lib/config');
const { initializeSheets, appendReservation } = require('./lib/sheetService');
const { getUserMessage } = require('./lib/errors');
const { getKoreanTime } = require('./lib/utils');

const isValidEmail = (email) => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/reserve', async (req, res) => {
  try {
    config.validate();

    const { userName, checkIn, checkOut, guests, email } = req.body;

    if (!userName || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: '유효한 이메일 형식을 입력해주세요' });
    }

    const sheetsAPI = await initializeSheets();

    const timestamp = getKoreanTime();
    const data = { timestamp, userName, checkIn, checkOut, guests, email };

    await appendReservation(sheetsAPI, config.SHEET_ID, data);

    res.json({ success: true, message: '예약 정보가 저장되었습니다' });
  } catch (error) {
    const message = error.message || '';
    const isDev = config.isDevelopment();

    if (isDev) {
      console.error('[ERROR] 시트 저장 실패:', message);
    }

    const userMessage = getUserMessage(error);

    res.status(500).json({
      error: '데이터 저장 실패',
      message: userMessage
    });
  }
});

app.listen(config.PORT, () => {
  console.log(`🚀 서버 시작: http://localhost:${config.PORT}`);
});
