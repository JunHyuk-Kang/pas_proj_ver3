# Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하는 방법입니다.

## 사전 준비

1. GitHub 계정
2. Vercel 계정 (https://vercel.com)
3. OpenAI API 키

## 배포 단계

### 1. GitHub에 코드 푸시

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit for Vercel deployment"

# GitHub 리포지토리 생성 후 연결
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 푸시
git push -u origin main
```

### 2. Vercel에서 프로젝트 임포트

1. [Vercel](https://vercel.com)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 리포지토리 선택
4. Import 클릭

### 3. 환경 변수 설정

프로젝트 설정에서 Environment Variables 추가:

- `OPENAI_API_KEY`: OpenAI API 키 입력
- `NODE_ENV`: `production` 입력

### 4. 빌드 설정

Vercel이 자동으로 감지하지만, 수동 설정이 필요하면:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 5. Deploy 클릭

배포가 시작되면 2-3분 후 완료됩니다.

## 중요 사항

⚠️ **데이터베이스 관련**

현재 SQLite를 사용하고 있어 **데이터는 저장되지 않습니다**. Vercel은 Serverless 환경이라 파일 시스템 변경이 지속되지 않습니다.

UI만 확인하려면 문제없지만, 실제 데이터 저장이 필요하면:

1. **Vercel Postgres** (무료 티어 있음)
2. **Supabase** (무료 티어 있음)
3. **PlanetScale** (무료 티어 있음)

등의 외부 데이터베이스로 마이그레이션이 필요합니다.

## 배포 후 확인

- Vercel이 제공하는 URL로 접속 (예: `your-project.vercel.app`)
- UI가 정상적으로 표시되는지 확인
- 메시지 전송 시도 (OpenAI API 키가 설정되어 있으면 작동)

## 문제 해결

### 빌드 실패 시
- Vercel 대시보드의 Deployments → 실패한 배포 → View Build Logs 확인
- 환경 변수가 제대로 설정되었는지 확인

### API 호출 실패 시
- Environment Variables에 `OPENAI_API_KEY`가 설정되었는지 확인
- Vercel 대시보드의 Functions → Logs 확인

## 재배포

코드를 수정하고 GitHub에 푸시하면 자동으로 재배포됩니다:

```bash
git add .
git commit -m "Update message"
git push
```

## 커스텀 도메인 설정 (선택사항)

Vercel 대시보드 → Settings → Domains에서 커스텀 도메인 추가 가능합니다.
