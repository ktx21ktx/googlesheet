const errorMessages = {
  'SHEET_NOT_FOUND': '예약 정보를 저장할 수 없습니다.',
  'INVALID_CREDENTIALS': '서버 인증 오류',
  'CREDENTIALS_NOT_FOUND': '서버 설정 오류',
  'INVALID_CREDENTIALS_JSON': '인증 정보 형식 오류',
  'INVALID_BASE64_CREDENTIALS': 'Base64 디코딩 실패',
  'NETWORK_ERROR': '일시적 오류 발생. 다시 시도해주세요.',
  'MISSING_SHEET_ID': '시스템 설정이 필요합니다.',
  'SHEET_ID_MISSING': '시스템 설정이 필요합니다.',
  'SHEET_ID_INVALID': '시스템 설정 오류',
};

function getUserMessage(error) {
  if (typeof error === 'string') {
    return errorMessages[error] || '서버 오류 발생';
  }

  if (error.code) {
    return errorMessages[error.code] || '서버 오류 발생';
  }

  const errorType = error.message?.split(':')[0];
  return errorMessages[errorType] || '서버 오류 발생';
}

function maskSensitiveData(obj) {
  const cloned = JSON.parse(JSON.stringify(obj));
  if (cloned.SHEET_ID) {
    const id = cloned.SHEET_ID;
    cloned.SHEET_ID = id.substring(0, 6) + '...' + id.substring(id.length - 4);
  }
  return cloned;
}

module.exports = { errorMessages, getUserMessage, maskSensitiveData };
