# Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하는 방법을 설명합니다.

## 배포 옵션

### 옵션 1: GitHub 자동 연동 배포 (권장) ⭐

가장 간단한 방법입니다. Vercel이 GitHub과 자동으로 연동됩니다.

#### 단계:

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - "Sign Up" 클릭
   - GitHub 계정으로 로그인

2. **GitHub 저장소 연동**
   - Vercel 대시보드에서 "New Project" 클릭
   - GitHub 저장소 선택: `ktx21ktx/googlesheet`
   - "Import" 클릭

3. **환경 변수 설정** 📝

   Vercel에 배포하기 전에 환경 변수를 설정해야 합니다. 이는 프로덕션 환경에서 안전하게 민감한 정보를 관리하기 위함입니다.

   #### 3-1. 환경 변수 추가 화면 접근

   ```
   1. Vercel 대시보드 접속
   2. 프로젝트 선택 (또는 "Import" 후 자동으로 표시)
   3. "Environment Variables" 탭 클릭
      (또는 Settings → Environment Variables)
   ```

   #### 3-2. SHEET_ID 추가하기

   **SHEET_ID 값 찾기:**
   ```
   Google Sheet URL 예시:
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit#gid=0
                                      ↑ 이 부분이 SHEET_ID
   ```

   **Vercel에서 추가:**
   ```
   NAME: SHEET_ID
   VALUE: 1a2b3c4d5e6f7g8h9i0j (위에서 복사한 ID)
   ENVIRONMENT: Production (또는 All)
   
   → "Save" 클릭
   ```

   #### 3-3. PORT 추가하기

   **Vercel에서 추가:**
   ```
   NAME: PORT
   VALUE: 3000
   ENVIRONMENT: Production (또는 All)
   
   → "Save" 클릭
   ```

   **PORT 설명:**
   - 서버가 실행될 포트 번호
   - 기본값: 3000
   - 변경 필요 없음 (Vercel이 자동으로 관리)

   #### 3-4. 추가 필수 설정

   **service-account-key.json 처리:**

   Google Sheets API를 사용하려면 서비스 계정 인증이 필요합니다.

   **두 가지 방법:**

   **방법 1: Base64 인코딩 (권장)**
   ```
   1. service-account-key.json 파일 준비
   2. 파일을 Base64로 인코딩:
      - Windows: certutil -encode service-account-key.json temp.txt
      - Mac/Linux: base64 service-account-key.json
   
   3. Vercel에 추가:
      NAME: GOOGLE_CREDENTIALS_BASE64
      VALUE: [Base64로 인코딩된 내용]
      ENVIRONMENT: Production
   
   4. server.js 수정 (선택사항)
   ```

   **방법 2: 직접 지정 (간단)**
   ```
   1. Vercel Settings → General
   2. "Function Memory": 1024 MB 설정
   3. 서비스 계정 JSON을 프로젝트에 포함
      (단, .gitignore에 추가 필수)
   ```

   #### 3-5. 환경 변수 검증

   모든 환경 변수를 추가한 후 확인 사항:

   ```
   ✅ SHEET_ID: 25자의 Google Sheet ID
   ✅ PORT: 3000
   ✅ 서비스 계정: 설정 완료
   ```

   **확인 방법:**
   ```
   Vercel 대시보드 → Settings → Environment Variables
   → 위의 모든 항목이 표시되어야 함
   ```

4. **배포**
   - "Deploy" 클릭
   - 배포 완료 대기 (약 1-2분)

   **배포 진행 상황 확인:**
   ```
   1. Vercel 대시보드에서 "Deployments" 탭 클릭
   2. 최신 배포 항목의 상태 확인:
      - "Building" → 배포 중
      - "Ready" → 배포 완료 ✅
   ```

5. **완료!**
   - 배포된 URL 확인
   - 예: `https://googlesheet-ktx21ktx.vercel.app`

---

### 옵션 2: Vercel CLI로 배포

로컬에서 직접 배포하는 방법입니다.

#### 단계:

1. **Vercel CLI 설치**
   ```bash
   npm install -g vercel
   ```

2. **Vercel 로그인**
   ```bash
   vercel login
   ```
   - GitHub 계정으로 로그인

3. **프로젝트 디렉토리 이동**
   ```bash
   cd "c:\00 claude\20260501 홈피 구축"
   ```

4. **배포**
   ```bash
   vercel
   ```

5. **질문에 답변**
   ```
   ? Set up and deploy "..."? [Y/n] Y
   ? Which scope do you want to deploy to? (your-username)
   ? Link to existing project? [y/N] N
   ? What's your project's name? googlesheet
   ? In which directory is your code located? ./
   ? Want to modify these settings? [y/N] N
   ```

6. **환경 변수 설정**
   ```bash
   vercel env add SHEET_ID
   # YOUR_GOOGLE_SHEET_ID 입력
   
   vercel env add PORT
   # 3000 입력
   ```

7. **재배포**
   ```bash
   vercel --prod
   ```

---

## 배포 후 확인

### 1. 웹사이트 접속
```
https://your-project-name.vercel.app
```

### 2. 예약 폼 테스트
1. 이름 입력
2. 입실일 선택
3. 퇴실일 선택
4. 인원수 선택
5. "예약 가능 여부 확인" 클릭

### 3. Google Sheet 확인
예약 데이터가 Google Sheet에 저장되었는지 확인합니다.

---

## 문제 해결

### "SHEET_ID가 설정되지 않았습니다" 오류

**해결책:**
1. Vercel 대시보드 → Settings → Environment Variables
2. `SHEET_ID` 추가 또는 수정
3. Redeploy 실행

### "Permission denied" 오류

**해결책:**
1. Google Cloud Console 확인
2. 서비스 계정 이메일이 Google Sheet에 공유되었는지 확인
3. 권한: "편집자"로 설정

### API 요청 실패

**해결책:**
1. 브라우저 콘솔에서 네트워크 오류 확인
2. Vercel 로그 확인:
   ```bash
   vercel logs
   ```

---

## 고급 설정

### 자동 배포 설정

GitHub에 푸시하면 자동으로 배포됩니다:

1. Vercel 대시보드 → Settings → Git
2. "Deploy on every branch push" 활성화

### 커스텀 도메인 설정

1. Vercel 대시보드 → Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력
4. DNS 설정 완료

### 배포 미리보기

Pull Request를 생성하면 미리보기 URL이 자동 생성됩니다:
- Example: `https://googlesheet-ktx21ktx-pr-1.vercel.app`

---

## 프로덕션 URL

배포 완료 후:
- **기본 URL**: https://googlesheet.vercel.app (커스텀 도메인 설정 후)
- **Vercel URL**: https://googlesheet-ktx21ktx.vercel.app

---

## 로그 확인

배포 후 로그를 확인하려면:

```bash
vercel logs
```

또는 Vercel 대시보드에서 → "Deployments" → 최신 배포 클릭 → "Logs"

---

## 환경 변수 관리

### 개발 환경 (.env.local)
```
SHEET_ID=YOUR_SHEET_ID
PORT=3000
```

### 프로덕션 환경 (Vercel)
Vercel 대시보드에서 설정:
- `SHEET_ID`
- `PORT` (선택사항, 기본값 3000)

---

## 배포 비용

✅ **완전 무료**
- Vercel은 개인 프로젝트에 무료 호스팅 제공
- Google Sheets API도 무료

## 배포 후 다음 단계

1. **도메인 설정** (선택사항)
   - 커스텀 도메인 연결

2. **모니터링 설정** (선택사항)
   - Vercel Analytics 활성화

3. **성능 최적화** (선택사항)
   - 이미지 최적화
   - 캐싱 설정

---

## 문의

배포 중 문제가 생기면:
- Vercel 문서: https://vercel.com/docs
- GitHub Issues: https://github.com/ktx21ktx/googlesheet/issues

---

**배포 완료를 축하합니다! 🎉**
