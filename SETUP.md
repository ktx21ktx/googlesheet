# L'ESSENCE Hotel - Google Sheets 연동 설정 가이드

## 목차
1. [Google Cloud 설정](#google-cloud-설정)
2. [서비스 계정 생성](#서비스-계정-생성)
3. [Google Sheet 설정](#google-sheet-설정)
4. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
5. [Vercel 배포](#vercel-배포)
6. [문제 해결](#문제-해결)

---

## Google Cloud 설정

### 1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 상단의 **프로젝트 선택** 드롭다운 클릭
3. **새 프로젝트** 클릭
4. 프로젝트 이름 입력 (예: `L'ESSENCE Hotel`)
5. **만들기** 클릭
6. 프로젝트 생성 완료 대기 (1-2분)

### 2. Google Sheets API 활성화

1. 프로젝트 생성 완료 후, 상단 검색창에 **"Google Sheets API"** 입력
2. 검색 결과에서 **"Google Sheets API"** 클릭
3. **활성화** 버튼 클릭
4. API 활성화 완료 대기 (30초-1분)

---

## 서비스 계정 생성

### 1. 서비스 계정 만들기

1. 좌측 메뉴에서 **"IAM 및 관리자"** → **"서비스 계정"** 클릭
2. **"서비스 계정 만들기"** 클릭
3. 다음 정보 입력:
   - **서비스 계정 이름**: `l-essence-sheets`
   - **서비스 계정 ID**: 자동 생성됨 (수정 가능)
   - **설명** (선택사항): `예약 데이터 저장용`
4. **만들기 및 계속** 클릭
5. 권한 부여 (선택 사항)에서 **계속** 클릭
6. **완료** 클릭

### 2. JSON 키 생성

1. 생성된 서비스 계정 목록에서 방금 만든 계정 클릭 (이메일 주소)
2. **"키"** 탭 클릭
3. **"키 추가"** → **"새 키 만들기"** 클릭
4. 팝업에서 **"JSON"** 선택
5. **"만들기"** 클릭
6. JSON 파일이 자동으로 다운로드됨

### 3. JSON 파일 설정 (로컬 개발용)

1. 다운로드된 JSON 파일을 프로젝트 루트 폴더에 이동
2. 파일 이름을 **`service-account-key.json`** 으로 변경
3. 파일의 `client_email` 값을 메모 (Google Sheet 공유 시 필요)

⚠️ **보안 주의사항**
- JSON 파일을 절대 GitHub에 업로드하지 마세요
- `.gitignore`에 이미 `service-account-key.json`이 등록되어 있습니다
- 다른 사람과 코드를 공유할 때는 JSON 파일을 제외하고만 공유하세요

---

## Google Sheet 설정

### 1. 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com) 접속
2. **"새로운 스프레드시트"** 또는 기존 시트 사용
3. 시트 이름을 `예약 데이터` 또는 원하는 이름으로 변경

### 2. 시트 ID 복사

1. 시트 URL 확인: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
2. 대괄호 안의 ID 복사
3. 메모: 나중에 환경 변수에 설정할 때 필요합니다

### 3. 헤더 설정

시트의 첫 번째 행(A1-G1)에 다음 헤더 추가:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Name | Check-in | Check-out | Guests | Email | Phone |

- A1: `Timestamp` (예약 시간)
- B1: `Name` (예약자명)
- C1: `Check-in` (체크인 날짜)
- D1: `Check-out` (체크아웃 날짜)
- E1: `Guests` (인원수)
- F1: `Email` (이메일, 선택사항)
- G1: `Phone` (전화번호, 선택사항)

### 4. 서비스 계정에 공유 권한 부여

1. Sheet에서 **"공유"** 버튼 클릭 (우상단)
2. 서비스 계정 이메일 주소 입력 (JSON 파일의 `client_email`)
   - 예: `l-essence-sheets@l-essence-hotel.iam.gserviceaccount.com`
3. 권한: **편집자** 선택
4. **공유** 클릭

---

## 로컬 개발 환경 설정

### 1. Node.js 설치

- [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 설치
- 설치 확인: `node --version`

### 2. 환경 변수 설정

#### Windows (Command Prompt)
```cmd
set SHEET_ID=YOUR_SHEET_ID
set NODE_ENV=development
```

#### Windows (PowerShell)
```powershell
$env:SHEET_ID="YOUR_SHEET_ID"
$env:NODE_ENV="development"
```

#### Mac/Linux
```bash
export SHEET_ID=YOUR_SHEET_ID
export NODE_ENV=development
```

또는 프로젝트 루트에 `.env` 파일 생성:
```
SHEET_ID=YOUR_SHEET_ID
NODE_ENV=development
PORT=3000
```

### 3. 의존성 설치

```bash
npm install
```

### 4. 로컬 서버 실행

```bash
npm start
```

또는

```bash
node server.js
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 5. 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. 예약 양식 작성:
   - **예약자명** (필수): 한글/영문 입력
   - **체크인** (필수): 오늘 또는 미래 날짜
   - **체크아웃** (필수): 체크인보다 이후 날짜
   - **인원수** (필수): 숫자 입력
   - **이메일** (선택): 유효한 이메일 형식 (예: test@example.com)
   - **전화번호** (선택): 유효한 전화 형식 (예: 010-1234-5678)
3. **예약** 버튼 클릭
4. "예약 정보가 저장되었습니다" 메시지 확인
5. Google Sheet에서 데이터 저장 확인

---

## Vercel 배포

### 1. GitHub 저장소 생성

1. [GitHub](https://github.com) 접속 후 로그인
2. **"새 저장소 만들기"** 클릭
3. 저장소 이름 입력 (예: `essence-hotel`)
4. **저장소 만들기** 클릭

### 2. 로컬 코드 GitHub에 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/essence-hotel.git
git push -u origin main
```

⚠️ `service-account-key.json`이 `.gitignore`에 포함되어 있는지 확인하세요.

### 3. Vercel에 연결 및 배포

1. [Vercel](https://vercel.com) 접속 후 GitHub 계정으로 로그인
2. **"새 프로젝트"** 클릭
3. 저장소 선택 (`essence-hotel`)
4. **"Import"** 클릭

### 4. 환경 변수 설정

1. Vercel 대시보드에서 프로젝트 선택
2. **"Settings"** → **"Environment Variables"** 클릭
3. 다음 환경 변수 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `SHEET_ID` | YOUR_SHEET_ID | Google Sheet ID |
| `GOOGLE_CREDENTIALS` | `{...}` | 서비스 계정 JSON 전체 내용 |

**GOOGLE_CREDENTIALS 추가 방법:**
1. `service-account-key.json` 파일을 텍스트 편집기로 열기
2. 전체 JSON 내용 복사
3. Vercel 환경 변수에 붙여넣기

⚠️ 개행 문자 때문에 오류가 발생할 수 있습니다. 이 경우 다음 명령으로 Base64 인코딩:

```bash
# Mac/Linux
cat service-account-key.json | base64 -w 0

# Windows (PowerShell)
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("service-account-key.json"))
```

그 후 `GOOGLE_CREDENTIALS_BASE64`에 저장하세요.

### 5. 배포 확인

1. Vercel 대시보드에서 배포 로그 확인
2. 배포 완료 후 **"Visit"** 클릭하여 라이브 사이트 접속
3. 예약 양식 테스트

---

## 문제 해결

### "CREDENTIALS_NOT_FOUND" 에러

**원인:** 환경 변수가 설정되지 않음

**해결:**
- 로컬: `SHEET_ID` 및 JSON 파일(`service-account-key.json`) 확인
- Vercel: 환경 변수 설정 재확인

### "INVALID_CREDENTIALS_JSON" 에러

**원인:** JSON 형식이 잘못됨

**해결:**
- JSON 파일 형식 재확인
- 개행 문자 문제 시 Base64 인코딩 사용

### "권한 거부" (403 에러)

**원인:** 서비스 계정에 Sheet 접근 권한 없음

**해결:**
1. Google Sheet를 열기
2. 서비스 계정 이메일이 **편집자** 권한으로 공유되어 있는지 확인
3. 권한이 없으면 다시 공유

### "시트 ID가 설정되지 않았습니다"

**원인:** `SHEET_ID` 환경 변수가 비어있음

**해결:**
- Google Sheet URL에서 ID 복사: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
- 환경 변수에 설정

### 로컬 서버가 시작되지 않음

**원인:** 포트 3000이 사용 중이거나 의존성 설치 오류

**해결:**
```bash
# 의존성 재설치
npm install

# 다른 포트 사용 (예: 3001)
set PORT=3001
npm start
```

### Vercel 배포 후 데이터가 저장되지 않음

**원인:** 환경 변수 누락 또는 Google Cloud 권한 문제

**해결:**
1. Vercel 배포 로그에서 에러 메시지 확인
2. 환경 변수 재설정
3. Google Sheet 공유 권한 재확인

---

## 주요 파일 설명

| 파일 | 설명 |
|------|------|
| `index.html` | 예약 양식 프론트엔드 |
| `server.js` | 로컬 개발용 Express 서버 |
| `api/reserve.js` | Vercel 서버리스 함수 (POST /api/reserve) |
| `lib/config.js` | 환경 변수 관리 |
| `lib/sheetService.js` | Google Sheets API 래퍼 |
| `lib/utils.js` | 유틸리티 함수 (한국 시간) |
| `lib/errors.js` | 에러 처리 및 메시지 |
| `service-account-key.json` | Google 서비스 계정 키 (Git에 업로드 안함) |

---

## 배포 체크리스트

로컬에서 완벽히 작동하는지 확인한 후 배포하세요:

- [ ] 로컬 `npm start` 정상 작동
- [ ] 예약 양식 작성 및 제출 정상
- [ ] Google Sheet에 데이터 저장 확인
- [ ] 이메일/전화번호 입력 및 검증 정상
- [ ] GitHub 저장소에 코드 푸시 (`service-account-key.json` 제외)
- [ ] Vercel 환경 변수 설정 완료
- [ ] Vercel 배포 완료 및 라이브 사이트 테스트
- [ ] 본번 Google Sheet에 접근 가능 확인

---

## 참고 사항

### 한국 시간 적용
- 서버는 모든 타임스탬프를 한국 시간(UTC+9)으로 기록합니다
- 형식: `YYYY-MM-DD HH:mm:ss` (예: 2026-05-02 14:33:00)

### 필드 검증
- **예약자명**: 필수 (한글/영문/숫자)
- **체크인**: 필수 (YYYY-MM-DD 형식)
- **체크아웃**: 필수 (체크인보다 이후 날짜)
- **인원수**: 필수 (양의 정수)
- **이메일**: 선택 (유효한 이메일 형식)
- **전화번호**: 선택 (숫자, 하이픈, 괄호 포함 가능)

### 자동 날짜 초기화
- 페이지 로드 시 **체크인**은 오늘 날짜로 자동 설정
- **체크아웃**은 오늘 + 7일로 자동 설정
- 체크인 날짜 변경 시 체크아웃도 자동으로 1주일 뒤로 업데이트
