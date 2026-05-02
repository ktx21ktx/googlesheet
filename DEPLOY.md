# Vercel 배포 가이드

L'ESSENCE 호텔 예약 시스템을 Vercel에 배포합니다.

## 📋 프로젝트 구조

```
project-root/
├── api/
│   └── reserve.js           # Serverless 함수 (예약 저장)
├── index.html               # 메인 페이지 (정적 파일)
├── public/
│   └── index.html           # 정적 파일 복사본
├── vercel.json              # Vercel 설정
├── package.json             # npm 패키지 설정
├── .env.sample              # 환경 변수 템플릿
├── .gitignore               # Git 제외 파일
└── README.md                # 프로젝트 설명
```

## 🚀 배포 방법 (2가지)

### 옵션 1: GitHub 자동 연동 배포 ⭐ (권장)

#### Step 1: Vercel 계정 생성

1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인

#### Step 2: 프로젝트 연동

1. Vercel 대시보드 → "New Project" 클릭
2. GitHub 저장소 선택: `ktx21ktx/googlesheet`
3. "Import" 클릭

#### Step 3: 프로젝트 설정

```
프로젝트명: essence-hotel
(소문자, 하이픈만 가능)
```

#### Step 4: 환경 변수 설정 📝

**Vercel 대시보드에서:**

```
Settings → Environment Variables
```

**두 가지 방법 중 선택:**

##### 🟦 방법 A: JSON 직접 저장 (추천) ⭐

```
NAME: GOOGLE_CREDENTIALS
VALUE: {JSON 파일 전체 내용}
ENVIRONMENT: Production
```

**JSON 얻는 방법:**
```
1. service-account-key.json 파일을 텍스트 에디터로 열기
2. 전체 내용 복사 (Ctrl+A → Ctrl+C)
3. Vercel "Value" 필드에 붙여넣기 (Ctrl+V)
```

**JSON 예시:**
```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "service@your-project.iam.gserviceaccount.com",
  ...
}
```

##### 🟦 방법 B: Base64 인코딩

**로컬에서 인코딩:**

Windows:
```bash
certutil -encode service-account-key.json temp.txt
# temp.txt 파일의 내용 복사
```

Mac/Linux:
```bash
base64 service-account-key.json
```

**Vercel에 설정:**
```
NAME: GOOGLE_CREDENTIALS_BASE64
VALUE: [Base64 인코딩된 내용]
ENVIRONMENT: Production
```

##### 📌 필수 환경 변수

반드시 설정해야 할 환경 변수:

```
✅ SHEET_ID: YOUR_GOOGLE_SHEET_ID
✅ GOOGLE_CREDENTIALS (JSON) 또는 GOOGLE_CREDENTIALS_BASE64
```

#### Step 5: 배포

```
1. 모든 환경 변수 입력 완료
2. "Deploy" 버튼 클릭
3. 배포 진행 대기 (1-2분)
```

**배포 상태 확인:**
```
Vercel 대시보드 → Deployments 탭
상태: "Ready" ✅ (배포 완료)
```

---

### 옵션 2: Vercel CLI 배포

#### 1단계: Vercel CLI 설치

```bash
npm install -g vercel
```

#### 2단계: Vercel 로그인

```bash
vercel login
```

#### 3단계: 배포

```bash
cd "c:\00 claude\20260501 홈피 구축"
vercel
```

**질문에 답변:**
```
? Set up and deploy "..."? [Y/n] Y
? Which scope? [your-username]
? Link to existing project? [y/N] N
? Project name? essence-hotel
? Which directory? ./
? Modify settings? [y/N] N
```

#### 4단계: 환경 변수 설정

```bash
vercel env add GOOGLE_CREDENTIALS
# JSON 파일 전체 내용 입력

vercel env add SHEET_ID
# Google Sheet ID 입력
```

#### 5단계: 프로덕션 배포

```bash
vercel --prod
```

---

## 📊 배포 후 확인

### 1단계: 웹사이트 접속

```
https://essence-hotel.vercel.app
```

(또는 Vercel에서 제공하는 프로젝트 URL)

### 2단계: 페이지 로드 확인

```
✅ 페이지 정상 로드
✅ 예약 폼 표시됨
✅ 헤더에 "L'ESSENCE" 로고 표시
```

### 3단계: 기능 테스트

**예약 폼 입력:**
```
이름: 테스트 사용자
입실일: 2026-06-01
퇴실일: 2026-06-10
인원수: 2명
```

**예약 제출:**
```
"예약 가능 여부 확인" 버튼 클릭
→ ✅ 성공 메시지 표시: "예약 요청이 접수되었습니다"
```

### 4단계: Google Sheet 확인

**Google Sheet 열기:**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

**확인 사항:**
```
✅ 새 행이 추가됨
✅ 시간 기록됨
✅ 사용자명 저장됨
✅ 입실일/퇴실일 저장됨
✅ 인원수 저장됨
```

---

## 🔧 Vercel 설정 상세

### vercel.json 설정

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/reserve.js",
      "use": "@vercel/node"
    },
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/reserve",
      "dest": "api/reserve.js",
      "methods": ["POST"]
    },
    {
      "src": "/(.*)",
      "dest": "index.html"
    }
  ]
}
```

**각 항목 설명:**
- `builds`: 빌드 설정
  - `api/reserve.js`: Node.js Serverless Function
  - `index.html`: 정적 파일
- `routes`: URL 라우팅
  - `/api/reserve`: POST 요청 → Serverless Function
  - `/*`: 나머지 요청 → index.html (프론트엔드)

### api/reserve.js 구조

```javascript
// Serverless 함수의 엔드포인트
module.exports = async (req, res) => {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 요청 처리
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '메서드가 허용되지 않습니다' });
  }

  try {
    // 1. 요청 데이터 검증
    const { userName, checkIn, checkOut, guests } = req.body;
    
    // 2. Google Sheets API 초기화
    // - GOOGLE_CREDENTIALS 환경 변수에서 인증 정보 읽기
    // - 또는 GOOGLE_CREDENTIALS_BASE64에서 Base64 디코딩
    
    // 3. 데이터 저장
    await sheetsAPI.spreadsheets.values.append({...});
    
    // 4. 응답
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: '저장 실패' });
  }
};
```

---

## ⚠️ 문제 해결

### 문제 1: "Cannot GET /" (404 에러)

**원인:** 정적 파일이 서빙되지 않음

**해결:**
```
1. Vercel 대시보드 → Deployments
2. 최신 배포의 "Logs" 탭 확인
3. 오류 메시지 확인
4. 라우팅 설정 재확인
```

### 문제 2: "데이터 저장 실패"

**원인:** 서비스 계정 인증 실패

**해결:**
```
1. Vercel Settings → Environment Variables
2. GOOGLE_CREDENTIALS 또는 GOOGLE_CREDENTIALS_BASE64 확인
3. 값이 올바르게 입력되었는지 확인
4. Redeploy 실행
```

**확인 체크리스트:**
```
✅ GOOGLE_CREDENTIALS (JSON 전체) 또는 GOOGLE_CREDENTIALS_BASE64 설정됨
✅ SHEET_ID 설정됨
✅ 서비스 계정 이메일이 Google Sheet에 공유됨 (편집자 권한)
```

### 문제 3: "SHEET_ID가 설정되지 않았습니다"

**원인:** 환경 변수 누락

**해결:**
```
1. Vercel Settings → Environment Variables
2. SHEET_ID 추가:
   NAME: SHEET_ID
   VALUE: [Google Sheet ID]
   ENVIRONMENT: Production
3. Redeploy
```

### 문제 4: 배포 실패

**원인:** 빌드 오류

**해결:**
```
1. Vercel 대시보드 → Deployments
2. 실패한 배포 클릭 → Logs 탭
3. 에러 메시지 확인
4. GitHub에서 수정 후 재푸시
```

---

## 🔄 배포 후 업데이트

### 코드 수정 후 배포

**GitHub 푸시:**
```bash
git add .
git commit -m "fix: description"
git push
```

**자동 배포:**
```
Vercel이 GitHub 푸시를 감지하면 자동으로 재배포
약 1-2분 후 완료
```

### 환경 변수 수정 후 배포

```
1. Vercel Settings → Environment Variables에서 수정
2. Deployments → 최신 배포 → "Redeploy" 클릭
3. 배포 완료 대기
```

---

## 📈 성능 최적화

### 배포 후 확인

```
Vercel Analytics:
- 페이지 로딩 속도 확인
- 주요 Web Vitals 확인
- 에러 로그 모니터링
```

### 캐싱 설정

```
vercel.json에 추가 가능:
"headers": [
  {
    "source": "/public/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=3600"
      }
    ]
  }
]
```

---

## 🎯 체크리스트

배포 전:
- [ ] service-account-key.json 준비
- [ ] SHEET_ID 확인
- [ ] GitHub 저장소 최신화

배포 중:
- [ ] Vercel 계정 생성
- [ ] 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 배포 실행

배포 후:
- [ ] 웹사이트 로드 확인
- [ ] 예약 폼 표시 확인
- [ ] 예약 제출 테스트
- [ ] Google Sheet 저장 확인

---

## 📞 지원

**문제 발생 시:**
1. Vercel 로그 확인
2. GitHub Issues에 문제 보고
3. 문서 다시 읽기

**유용한 링크:**
- Vercel 문서: https://vercel.com/docs
- GitHub: https://github.com/ktx21ktx/googlesheet
- Google Sheets API: https://developers.google.com/sheets

---

**배포 완료를 축하합니다! 🎉**

이제 완전히 자동화된 호텔 예약 시스템이 온라인에서 운영됩니다.

**배포 URL:** https://essence-hotel.vercel.app
