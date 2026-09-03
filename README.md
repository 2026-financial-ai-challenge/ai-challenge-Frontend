# 안심피싱 (Safety Phishing Call)

AI 기반 보이스피싱 실전 대응훈련 프론트엔드.

## 기술 스택

- Next.js 16 + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (훈련 세션 상태)
- TanStack Query (API 서버 상태)

## 실행

```bash
npm install
npm run dev
```

## API

브라우저는 same-origin `/v1`을 호출하고, Next rewrites가 `NEXT_PUBLIC_API_BASE_URL` 백엔드로 넘깁니다. 로컬 기본값은 `http://localhost:8000`입니다.

## 배포 (Vercel)

한 프로젝트에서 live와 staging을 나눕니다. Vercel 프로젝트를 두 개 만들 필요는 없습니다.

| 환경 | Git 브랜치 | Vercel 대상 | 용도 |
| --- | --- | --- | --- |
| Live | `main` | Production | 실제 이용자에게 보여주는 주소 |
| Staging | `develop` | Preview | 백엔드 연동·QA. PR 미리보기도 여기와 같은 Preview 계열 |

환경 변수는 Vercel 대시보드 또는 CLI에서 Production / Preview(브랜치 `develop`)에 따로 넣습니다. 환경마다 API URL만 다르게 두면 됩니다.

```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production --value https://api.example.com --yes --no-sensitive
vercel env add NEXT_PUBLIC_API_BASE_URL preview develop --value https://staging-api.example.com --yes --no-sensitive
```
