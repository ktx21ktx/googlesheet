# L'ESSENCE Hotel - Reservation System

럭셔리 호텔 예약 시스템으로 Google Sheets 연동을 통해 예약 정보를 자동으로 저장합니다.

## 주요 기능

✨ **완전 한글화 UI**
- 럭셀리한 호텔 웹사이트
- 반응형 디자인 (모바일/데스크톱 지원)
- 세련된 예약 폼

📝 **예약 정보 저장**
- 사용자명, 입실일, 퇴실일, 인원수 수집
- Google Sheets API를 통한 자동 저장
- 서비스 계정 기반 보안

🔧 **백엔드 서버**
- Express.js 기반
- Node.js 런타임
- RESTful API

## 프로젝트 구조

```
.
├── main.html                 # 프론트엔드 (호텔 웹사이트)
├── server.js                 # Express 백엔드 서버
├── package.json              # npm 의존성
├── .env.sample              # 환경 변수 템플릿
├── .gitignore               # Git 제외 파일
├── SETUP.md                 # 상세 설정 가이드
├── test-reservation.js      # 더미 데이터 테스트
├── verify-data.js           # Google Sheet 데이터 확인
├── check-latest.js          # 최신 예약 데이터 확인
└── update-header.js         # 시트 헤더 업데이트
```

## 빠른 시작

### 1. Google Cloud 설정

[SETUP.md](./SETUP.md)를 참고하여 Google Cloud 프로젝트 생성 및 서비스 계정 설정

### 2. 파일 준비

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.sample .env
# .env 파일에 SHEET_ID 입력
```

### 3. 서비스 계정 키 다운로드

- Google Cloud Console에서 JSON 키 다운로드
- 프로젝트 폴더에 `service-account-key.json` 저장

### 4. 서버 실행

```bash
npm start
```

서버가 포트 3000에서 실행됩니다: http://localhost:3000/main.html

## 사용 방법

1. **브라우저에서 main.html 열기**
2. **예약 정보 입력**
   - 이름: 성함 입력
   - 입실일: 날짜 선택
   - 퇴실일: 날짜 선택
   - 인원수: 인원 선택
3. **"예약 가능 여부 확인" 버튼 클릭**
4. **성공 알림 표시**
5. **Google Sheet에 자동 저장**

## 테스트

### 더미 데이터로 테스트
```bash
npm test
```

### 저장된 데이터 확인
```bash
node verify-data.js
```

### 최신 예약 조회
```bash
node check-latest.js
```

## 환경 변수

```bash
SHEET_ID=YOUR_GOOGLE_SHEET_ID
PORT=3000
```

## 필수 의존성

- `express` - 웹 서버
- `googleapis` - Google Sheets API
- `cors` - CORS 처리
- `dotenv` - 환경 변수 관리

## 배포

### Vercel/Heroku 배포

1. GitHub 저장소 연결
2. 환경 변수 설정:
   - `SHEET_ID`: Google Sheet ID
   - `PORT`: 3000
3. 배포 실행

## 보안

⚠️ **중요:**
- `service-account-key.json` 절대 공개 금지
- `.env` 파일 Git에 업로드 금지
- `.gitignore`에 이미 설정됨

## 기술 스택

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Google Sheets
- **API**: Google Sheets API v4

## 파일 설명

### main.html
럭셀리 호텔 웹사이트 프론트엔드
- 반응형 레이아웃
- 예약 폼
- 호텔 소개 및 객실 정보

### server.js
Express 백엔드 서버
- `/api/reserve` 엔드포인트
- Google Sheets API 통합
- 환경 변수 설정

### SETUP.md
Google Cloud 설정 가이드
- 프로젝트 생성
- Sheets API 활성화
- 서비스 계정 생성
- JSON 키 다운로드

## 연락처

📧 ktx21ktx@gmail.com

## 라이선스

MIT

---

**Created with ❤️ using Claude**
