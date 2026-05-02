const config = require('../lib/config');
const { initializeSheets, appendReservation } = require('../lib/sheetService');
const { getUserMessage } = require('../lib/errors');

module.exports = async (req, res) => {
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
    config.validate();

    const { userName, checkIn, checkOut, guests } = req.body;

    if (!userName || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
    }

    const sheetsAPI = await initializeSheets();

    const timestamp = new Date().toISOString();
    const data = { timestamp, userName, checkIn, checkOut, guests };

    await appendReservation(sheetsAPI, config.SHEET_ID, data);

    res.status(200).json({ success: true, message: '예약 정보가 저장되었습니다' });
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
};
