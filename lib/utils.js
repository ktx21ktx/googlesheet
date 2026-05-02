function getKoreanTime() {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreanTime = new Date(utcTime + (9 * 60 * 60 * 1000));

  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getDate()).padStart(2, '0');
  const hours = String(koreanTime.getHours()).padStart(2, '0');
  const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
  const seconds = String(koreanTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatKoreanDateTime(date = new Date()) {
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
  const koreanTime = new Date(utcTime + (9 * 60 * 60 * 1000));
  return koreanTime.toLocaleString('ko-KR');
}

module.exports = { getKoreanTime, formatKoreanDateTime };
