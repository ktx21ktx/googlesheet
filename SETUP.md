# L'ESSENCE Hotel - Google Sheets 연동 설정

## 설정 단계

### 1. Google Cloud 프로젝트 생성 및 Sheets API 활성화

- [Google Cloud Console](https://console.cloud.google.com) 접속
- 새 프로젝트 생성
- "Google Sheets API" 검색 후 활성화

### 2. 서비스 계정 생성

#### 2-1. Google Cloud Console 접속 및 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 상단의 **프로젝트 선택** 드롭다운 클릭
3. **새 프로젝트** 클릭
4. 프로젝트 이름 입력 (예: `L'ESSENCE Hotel`)
5. **만들기** 클릭
6. 프로젝트 생성 완료 대기 (1-2분)

#### 2-2. Google Sheets API 활성화

1. 프로젝트 생성 완료 후, 상단 검색창에 **"Google Sheets API"** 입력
2. 검색 결과에서 **"Google Sheets API"** 클릭
3. **활성화** 버튼 클릭
4. API 활성화 완료 대기 (30초-1분)

#### 2-3. 서비스 계정 생성

1. 좌측 메뉴에서 **"IAM 및 관리자"** → **"서비스 계정"** 클릭
2. **"서비스 계정 만들기"** 클릭
3. 다음 정보 입력:
   - **서비스 계정 이름**: `l-essence-sheets` (또는 원하는 이름)
   - **서비스 계정 ID**: 자동 생성됨 (수정 가능)
   - **설명** (선택사항): `Google Sheets 예약 데이터 저장용`
4. **만들기 및 계속** 클릭
5. 권한 부여 (선택 사항)에서 **계속** 클릭
6. **완료** 클릭

#### 2-4. JSON 키 생성

1. 생성된 서비스 계정 목록에서 방금 만든 계정 클릭 (이메일 주소)
2. **"키"** 탭 클릭
3. **"키 추가"** → **"새 키 만들기"** 클릭
4. 팝업에서 **"JSON"** 선택
5. **"만들기"** 클릭
6. JSON 파일이 자동으로 다운로드됨

#### 2-5. 파일 위치 설정

1. 다운로드된 JSON 파일의 이름 확인 (예: `l-essence-hotel-...json`)
2. 파일을 현재 프로젝트 폴더에 이동
3. 파일 이름을 **`service-account-key.json`** 으로 변경

#### 2-6. 중요한 정보 확인 (나중에 필요)

다운로드한 JSON 파일을 텍스트 편집기로 열어서 다음 정보를 메모해두세요:

```json
{
  "type": "service_account",
  "project_id": "l-essence-hotel",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "l-essence-sheets@l-essence-hotel.iam.gserviceaccount.com",
  ...
}
```

**특히 `client_email` 주소가 중요합니다** - 이것을 다음 단계에서 Google Sheet에 공유해야 합니다.

#### 보안 주의사항 ⚠️

- JSON 파일을 절대 GitHub나 공개 장소에 업로드하지 마세요
- 프로젝트의 `.gitignore`에 `service-account-key.json`이 포함되어 있습니다
- 다른 사람과 공유할 때는 JSON 파일을 제외하고만 공유하세요

### 3. Google Sheet 생성 및 공유

- [Google Sheets](https://sheets.google.com) 접속
- 새 스프레드시트 생성 (또는 기존 시트 사용)
- 시트 URL에서 ID 복사:
  ```
  https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
  ```
- 시트에서 **"공유"** 클릭
- 서비스 계정 이메일 추가 (JSON 파일의 `client_email` 값)
- 권한: **편집자** 선택

### 4. 시트 헤더 설정

시트의 첫 번째 행에 다음 헤더 추가:

- A1: `Timestamp`
- B1: `Check-in`
- C1: `Check-out`
- D1: `Guests`

### 5. 백엔드 설정

**server.js** 수정:

```javascript
const SHEET_ID = 'YOUR_SHEET_ID'; // 3단계에서 복사한 ID 입력
```

또는 환경 변수 사용:

```bash
set SHEET_ID=YOUR_SHEET_ID  # Windows
export SHEET_ID=YOUR_SHEET_ID  # Mac/Linux
```

### 6. 의존성 설치 및 실행

```bash
npm install
npm start
```

서버가 포트 3000에서 실행됩니다.

## 사용법

1. `main.html`을 브라우저에서 열기
2. Check-in, Check-out, Guests 입력
3. "Check Availability" 버튼 클릭
4. Google Sheet에 자동 저장됨

## 문제 해결

### "시트 ID가 설정되지 않았습니다" 에러

- server.js에서 SHEET_ID 확인

### "서버 연결 실패" 에러

- `npm start`로 서버 실행 확인
- 포트 3000이 다른 프로세스에 사용 중인지 확인

### "권한 거부" 에러

- 서비스 계정 이메일이 Sheet에 공유되었는지 확인
- Google Cloud Console에서 권한 설정 재확인

## 배포 (Vercel/Heroku)

**package.json**에 이미 설정되어 있으므로:

```bash
npm start
```

환경 변수에서 다음 설정:

- `SHEET_ID`: Google Sheet ID
- `PORT`: 포트 (기본값: 3000)
