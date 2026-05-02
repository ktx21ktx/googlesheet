function getKoreanTime() {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreanTime = new Date(utcTime + (9 * 60 * 60 * 1000));
  return koreanTime.toISOString();
}

function formatKoreanDateTime(date = new Date()) {
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
  const koreanTime = new Date(utcTime + (9 * 60 * 60 * 1000));
  return koreanTime.toLocaleString('ko-KR');
}

module.exports = { getKoreanTime, formatKoreanDateTime };
