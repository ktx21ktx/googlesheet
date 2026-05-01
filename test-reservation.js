require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const GOOGLE_CREDENTIALS = path.join(__dirname, 'service-account-key.json');
const SHEET_ID = process.env.SHEET_ID;

// 테스트 더미 데이터
const testData = [
  {
    timestamp: new Date().toLocaleString('ko-KR'),
    checkIn: '2024-10-12',
    checkOut: '2024-10-18',
    guests: '02 Adults'
  },
  {
    timestamp: new Date().toLocaleString('ko-KR'),
    checkIn: '2024-11-01',
    checkOut: '2024-11-05',
    guests: '04 Adults'
  },
  {
    timestamp: new Date().toLocaleString('ko-KR'),
    checkIn: '2024-12-20',
    checkOut: '2024-12-27',
    guests: '03 Adults'
  }
];

async function testGoogleSheets() {
  try {
    console.log('🔧 Google Sheets API 테스트 시작...\n');

    if (!SHEET_ID) {
      throw new Error('❌ SHEET_ID가 설정되지 않았습니다. .env 또는 .env.local 파일을 확인하세요.');
    }

    console.log(`📋 Sheet ID: ${SHEET_ID}\n`);

    // Google Sheets API 인증
    const auth = new google.auth.GoogleAuth({
      keyFile: GOOGLE_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1단계: 시트 메타데이터 확인
    console.log('📌 Step 1: 시트 정보 확인 중...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    const sheetName = spreadsheet.data.sheets[0].properties.title;
    console.log(`✅ 시트 제목: ${spreadsheet.data.properties.title}`);
    console.log(`✅ 시트명 (탭): ${sheetName}`);
    console.log(`✅ 시트 ID: ${spreadsheet.data.spreadsheetId}\n`);

    // 2단계: 헤더 확인 또는 생성
    console.log('📌 Step 2: 헤더 확인 중...');
    const headerRange = `'${sheetName}'!A1:D1`;

    const headerValues = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: headerRange,
    });

    const hasHeader = headerValues.data.values && headerValues.data.values.length > 0;

    if (!hasHeader) {
      console.log('⚠️  헤더가 없습니다. 헤더를 생성합니다...');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: headerRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Timestamp', 'Check-in', 'Check-out', 'Guests']]
        }
      });
      console.log('✅ 헤더 생성 완료\n');
    } else {
      console.log(`✅ 기존 헤더 확인됨: ${headerValues.data.values[0].join(', ')}\n`);
    }

    // 3단계: 테스트 데이터 추가
    console.log('📌 Step 3: 테스트 데이터 추가 중...');
    const rows = testData.map(data => [
      data.timestamp,
      data.checkIn,
      data.checkOut,
      data.guests
    ]);

    const appendRange = `'${sheetName}'!A:D`;
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: appendRange,
      valueInputOption: 'USER_ENTERED',
      resource: { values: rows },
    });

    console.log(`✅ ${testData.length}개의 테스트 데이터 추가 완료\n`);

    // 4단계: 저장된 데이터 확인
    console.log('📌 Step 4: 저장된 데이터 확인 중...');
    const allValuesRange = `'${sheetName}'!A:D`;
    const allValues = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: allValuesRange,
    });

    if (allValues.data.values) {
      console.log(`✅ 총 ${allValues.data.values.length}개 행 (헤더 포함)\n`);
      console.log('📊 데이터 내용:');
      console.table(allValues.data.values);
    }

    console.log('\n✅ 테스트 완료! Google Sheets 연동이 정상작동합니다.\n');
    console.log('📱 다음 단계:');
    console.log('1. npm start 실행하여 서버 시작');
    console.log('2. main.html을 브라우저에서 열기');
    console.log('3. 예약 정보 입력 후 "Check Availability" 버튼 클릭');
    console.log('4. Google Sheet에 자동으로 저장되는지 확인');

  } catch (error) {
    console.error('\n❌ 테스트 실패:\n');

    if (error.message.includes('ENOENT') || error.message.includes('service-account-key.json')) {
      console.error('❌ service-account-key.json 파일을 찾을 수 없습니다.');
      console.error('   SETUP.md의 2단계를 따라 JSON 키 파일을 다운로드하세요.');
    } else if (error.message.includes('Permission denied') || error.message.includes('accessDenied')) {
      console.error('❌ 권한 거부 오류입니다.');
      console.error('   SETUP.md의 3단계에서 서비스 계정 이메일을 Sheet에 공유했는지 확인하세요.');
    } else if (error.message.includes('SHEET_ID')) {
      console.error('❌ SHEET_ID가 설정되지 않았습니다.');
      console.error('   .env 또는 .env.local 파일의 SHEET_ID를 확인하세요.');
    } else {
      console.error(`오류: ${error.message}`);
      console.error('\n🔍 디버깅 정보:');
      console.error(`오류 코드: ${error.code}`);
      console.error(`오류 상태: ${error.status}`);
    }
    process.exit(1);
  }
}

testGoogleSheets();
