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

백엔드가 준비되기 전에는 `lib/mock.ts`를 사용합니다. 실제 연동 시 `.env.local`에서 `NEXT_PUBLIC_USE_MOCK=false`와 `NEXT_PUBLIC_API_BASE_URL`을 설정하면 `lib/api.ts`의 live 클라이언트로 전환됩니다.

## 배포 (Vercel)

한 프로젝트에서 live와 staging을 나눕니다. Vercel 프로젝트를 두 개 만들 필요는 없습니다.

| 환경 | Git 브랜치 | Vercel 대상 | 용도 |
| --- | --- | --- | --- |
| Live | `main` | Production | 실제 이용자에게 보여주는 주소 |
| Staging | `develop` | Preview | 백엔드 연동·QA. PR 미리보기도 여기와 같은 Preview 계열 |

환경 변수는 Vercel 대시보드 또는 CLI에서 Production / Preview(브랜치 `develop`)에 따로 넣습니다. 백엔드가 준비되면 mock을 끄고 환경마다 API URL만 다르게 두면 됩니다.

```bash
vercel env add NEXT_PUBLIC_USE_MOCK production --value false --yes --no-sensitive
vercel env add NEXT_PUBLIC_API_BASE_URL production --value https://api.example.com --yes --no-sensitive
vercel env add NEXT_PUBLIC_USE_MOCK preview develop --value false --yes --no-sensitive
vercel env add NEXT_PUBLIC_API_BASE_URL preview develop --value https://staging-api.example.com --yes --no-sensitive
```
