# Vercel 배포 완전 가이드
## Google Sheets API를 사용한 Serverless 함수 배포

---

## 목차
1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [로컬 개발](#로컬-개발)
4. [Vercel 배포](#vercel-배포)
5. [환경 변수 설정](#환경-변수-설정)
6. [문제 해결](#문제-해결)
7. [보안 체크리스트](#보안-체크리스트)
8. [자주 묻는 질문](#자주-묻는-질문)

---

## 개요

이 가이드는 **Google Sheets API**를 사용하는 Serverless 함수를 **Vercel에 배포**하는 완전한 과정을 설명합니다.

### 아키텍처
```
프론트엔드 (HTML/JS)
    ↓
Vercel Serverless Function (Node.js)
    ↓
Google Cloud Service Account
    ↓
Google Sheets API
    ↓
Google Spreadsheet
```

---

## 사전 준비

### 1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. **새 프로젝트 생성**
   - 프로젝트명: `[YOUR_PROJECT_NAME]`
3. **Google Sheets API 활성화**
   - API 및 서비스 → API 라이브러리
   - "Google Sheets API" 검색 및 활성화

### 2. 서비스 계정 생성

1. **IAM 및 관리자 → 서비스 계정**
2. **서비스 계정 만들기**
   - 이름: `google-sheets`
   - 설명: `For Google Sheets API access`
3. **역할 할당** (건너뛰기 가능, 나중에 설정)

### 3. 서비스 계정 키 생성

1. 생성한 서비스 계정 클릭
2. **키 탭 → 키 추가 → 새 키 만들기**
3. **JSON 형식 선택**
4. **생성** → JSON 파일 자동 다운로드

⚠️ **중요**: 이 파일은 매우 민감한 정보입니다!

### 4. Google Sheet 공유

1. [Google Sheets](https://sheets.google.com) 열기
2. 새 스프레드시트 생성
3. **공유 버튼** → 사람 초대
4. 이전 단계의 서비스 계정 이메일 입력
   - 형식: `google-sheets@[PROJECT_ID].iam.gserviceaccount.com`
5. 권한: **편집자**
6. **공유** 클릭

---

## 로컬 개발

### 1. 프로젝트 구조

```
project-root/
├── api/
│   └── reserve.js           # Serverless 함수
├── index.html               # 프론트엔드
├── package.json
├── .env                     # 로컬 환경 변수 (git 제외)
├── .gitignore
├── .gitattributes
├── service-account-key.json # 서비스 계정 JSON (git 제외)
└── vercel.json             # Vercel 설정
```

### 2. 환경 변수 설정 (.env)

```env
# Google Sheets API
SHEET_ID=YOUR_GOOGLE_SHEET_ID

# PORT (로컬 테스트용)
PORT=3000
```

### 3. .gitignore 설정

```
node_modules/
.env
.env.local
.env.*.local
*.log
.DS_Store
service-account-key.json
.vercel/
creds_base64.txt
```

### 4. .gitattributes 설정 (JSON 손상 방지)

```
*.json binary
service-account-key.json binary
```

### 5. 로컬 테스트

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 서버 실행
node server.js

# 3. http://localhost:3000 접속
# 4. 폼 제출 테스트
```

---

## Vercel 배포

### 1. Vercel 계정 생성

1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 회원가입

### 2. 프로젝트 연동

1. **대시보드 → 새 프로젝트**
2. **GitHub 저장소 선택**
3. **Import** 클릭

### 3. vercel.json 설정

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

### 4. 초기 배포

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

Vercel이 자동으로 감지하고 배포합니다.

---

## 환경 변수 설정

### ⚠️ 가장 중요한 부분!

#### **올바른 방법 (웹 대시보드)**

1. **Vercel 대시보드 → Settings → Environment Variables**
2. **"Add Environment Variable" 클릭**

#### SHEET_ID (선택적, .env에서도 가능)
```
NAME: SHEET_ID
VALUE: YOUR_GOOGLE_SHEET_ID
ENVIRONMENT: Production, Preview
```

#### GOOGLE_CREDENTIALS (필수)

1. **로컬 service-account-key.json 파일 열기**
2. **전체 JSON 내용 복사**
3. Vercel 환경 변수 추가:
   ```
   NAME: GOOGLE_CREDENTIALS
   VALUE: [전체 JSON 붙여넣기]
   ENVIRONMENT: Production, Preview, Development
   ```

#### 예시 (JSON 형식)
```json
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "google-sheets@my-project.iam.gserviceaccount.com",
  ...
}
```

### API 방식 (권장하지 않음)

```javascript
// ⚠️ API 방식은 충돌 오류 발생 가능
// 첫 설정만 가능, 업데이트는 실패
```

### 배포 후

1. **Deployments 탭에서 최신 배포 확인**
2. **상태가 "Ready"이면 성공**
3. **웹사이트 접속해서 테스트**

---

## 문제 해결

### 1. "Invalid JWT Signature" 오류

**원인:**
- 서비스 계정 키가 비활성화됨
- GitHub에 노출되어 Google이 자동으로 비활성화

**해결:**
```
1. Google Cloud Console 접속
2. IAM 및 관리자 → 서비스 계정
3. google-sheets 계정의 키 탭 확인
4. 상태가 "Disabled"면 새로운 키 생성
5. Vercel에서 GOOGLE_CREDENTIALS 업데이트
```

### 2. "Cannot GET /" (404 에러)

**원인:**
- 정적 파일이 서빙되지 않음
- vercel.json 라우팅 설정 오류

**해결:**
```json
// vercel.json에서 마지막 route 확인
{
  "src": "/(.*)",
  "dest": "index.html"
}
```

### 3. "시트 저장 실패" 오류

**원인 (우선순위 순):**

1. **GOOGLE_CREDENTIALS 미설정**
   - Vercel 환경 변수 확인

2. **서비스 계정 미공유**
   - Google Sheet 공유 설정 확인
   - 편집자 권한 확인

3. **SHEET_ID 오류**
   - 스프레드시트 URL에서 ID 확인
   - 백틱이나 특수문자 없는지 확인

4. **Google Sheets API 미활성화**
   - Google Cloud Console에서 API 활성화 확인

**해결:**
```bash
# 1. 환경 변수 확인
Vercel Dashboard → Settings → Environment Variables

# 2. 서비스 계정 권한 확인
Google Sheet → 공유 → 편집자 권한 있는지 확인

# 3. Vercel 로그 확인
Deployments → 최신 배포 → Logs
```

### 4. "파일을 찾을 수 없음" 오류

**원인:**
- service-account-key.json이 배포되지 않음
- API에서 환경 변수 읽기 실패

**해결:**
```
환경 변수 사용 권장:
- 파일 저장 대신 GOOGLE_CREDENTIALS 환경 변수 사용
- .gitignore에 service-account-key.json 추가
```

### 5. 환경 변수 업데이트 후 적용 안 됨

**원인:**
- 환경 변수 변경 후 재배포 필요

**해결:**
```
1. Vercel Dashboard에서 Environment Variables 수정
2. Deployments → 최신 배포 클릭
3. 우측 메뉴 (⋯) → "Redeploy" 클릭
4. 배포 완료 대기 (1-2분)
```

---

## 보안 체크리스트

### ✅ 필수 사항

- [ ] `service-account-key.json`을 `.gitignore`에 추가
- [ ] `.gitattributes`에 `*.json binary` 설정 (파일 손상 방지)
- [ ] GitHub에 노출된 키 있는지 확인
  ```bash
  git log --all -p | grep "private_key"
  ```
- [ ] 노출된 키는 Google Cloud에서 즉시 비활성화
- [ ] Vercel에서 "Sensitive" 환경 변수 설정 확인
- [ ] GitHub push protection 활성화 (선택)

### ⚠️ 공개 저장소인 경우

```
1. 절대 service-account-key.json 커밋 금지
2. GOOGLE_CREDENTIALS는 JSON 전체 텍스트
   (파일 경로 아님)
3. 정기적으로 새로운 키 생성 (월 1회)
```

---

## 자주 묻는 질문

### Q1: service-account-key.json은 어디에 저장?

**A:** 
- **로컬 개발**: 프로젝트 루트 (`.gitignore`에 추가)
- **Vercel**: 환경 변수 `GOOGLE_CREDENTIALS`로 JSON 전체 저장

### Q2: 파일과 환경 변수 중 뭘 써야 하나?

**A:** **환경 변수 권장**
```
✅ 환경 변수 (권장)
   - 보안 > 파일
   - Vercel 대시보드에서 관리
   - 노출 위험 낮음

❌ 파일 (비권장)
   - Git에서 손상될 수 있음
   - 실수로 커밋될 위험
   - 유지보수 어려움
```

### Q3: 키를 실수로 GitHub에 올렸어요

**A:** 긴급 조치:
```
1. 즉시 서비스 계정 키 비활성화
   - Google Cloud Console → 서비스 계정 → 키
2. 새로운 키 생성
3. Vercel에서 GOOGLE_CREDENTIALS 업데이트
4. Git 히스토리에서 제거
   ```bash
   git rm --cached service-account-key.json
   git commit -m "Remove exposed key"
   git push
   ```
```

### Q4: "Invalid JWT Signature" 계속 발생

**A:** 체크리스트:
```
1. ☐ 서비스 계정 키 상태 확인
   - Google Cloud Console → 키 상태 "Enabled" 확인
2. ☐ GOOGLE_CREDENTIALS 형식 확인
   - JSON 전체가 환경 변수에 저장되었는지 확인
3. ☐ 서비스 계정 공유 확인
   - Google Sheet에 편집자로 추가되었는지 확인
4. ☐ Vercel 로그 확인
   - private_key 길이가 1700+ 바이트인지 확인
```

### Q5: 로컬에서는 작동하는데 Vercel에서는 안 됨

**A:** 원인:
```
1. 환경 변수 미설정 (GOOGLE_CREDENTIALS)
   - Vercel Settings에서 확인

2. Vercel 로그 확인
   - Deployments → 최신 배포 → Logs
   - DEBUG 메시지 확인

3. 환경 변수 업데이트 후 재배포 필요
   - Deployments → Redeploy
```

### Q6: Base64 인코딩이 필요한가?

**A:** **필요 없음** (Vercel은 일반 JSON 권장)
```
❌ Base64 인코딩
   - 복잡함
   - 줄바꿈 문제
   - 디코딩 오류

✅ JSON 직접 저장
   - 간단함
   - 더 안정적
```

---

## 디버깅 팁

### 1. 로컬에서 환경 변수 테스트

```javascript
console.log('[DEBUG] GOOGLE_CREDENTIALS:', 
  process.env.GOOGLE_CREDENTIALS ? '설정됨' : '없음');
console.log('[DEBUG] SHEET_ID:', 
  process.env.SHEET_ID ? '설정됨' : '없음');
```

### 2. Vercel 로그 확인

```bash
# CLI로 실시간 로그 보기
vercel logs [deployment-url]

# 또는 웹 대시보드
Deployments → 배포 선택 → Logs 탭
```

### 3. 환경 변수 검증

```javascript
// api/reserve.js
if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error('GOOGLE_CREDENTIALS 환경 변수 없음');
}

if (!process.env.SHEET_ID) {
  throw new Error('SHEET_ID 환경 변수 없음');
}

// 파싱 테스트
try {
  const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  console.log('[DEBUG] Service Account:', creds.client_email);
} catch (err) {
  console.error('[ERROR] JSON 파싱 실패:', err.message);
}
```

---

## 체크리스트 (배포 전)

### 로컬 개발
- [ ] `.env` 파일 생성
- [ ] `SHEET_ID` 설정
- [ ] `service-account-key.json` 다운로드 및 배치
- [ ] `npm install` 실행
- [ ] `node server.js` 테스트
- [ ] 폼 제출 테스트 (Google Sheet 데이터 확인)

### Vercel 배포
- [ ] GitHub 저장소 생성
- [ ] `.gitignore`에 `service-account-key.json` 추가
- [ ] `.gitattributes` 설정
- [ ] `vercel.json` 생성
- [ ] GitHub에 푸시
- [ ] Vercel에서 자동 배포 확인

### 환경 변수 설정
- [ ] VERCEL 대시보드에서 `SHEET_ID` 추가
- [ ] VERCEL 대시보드에서 `GOOGLE_CREDENTIALS` 추가
- [ ] JSON 전체 내용 (파일 경로 아님)
- [ ] "Sensitive" 표시 확인

### 최종 테스트
- [ ] Vercel URL 접속
- [ ] 페이지 로드 확인
- [ ] 폼 작성 후 제출
- [ ] Google Sheet에 데이터 저장 확인
- [ ] Vercel Logs에서 오류 확인

---

## 참고 자료

- [Vercel Documentation](https://vercel.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Node.js on Vercel](https://vercel.com/docs/functions/runtimes/node-js)

---

**마지막 업데이트**: 2026-05-02
**작성자**: Claude Haiku 4.5
