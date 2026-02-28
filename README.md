# 2026 휴가 계산기

연차 1~20일, 언제 쓰면 가장 이득인지 자동 계산해드립니다.

**Live:** https://vacation-calculator-git-109084028527.asia-northeast3.run.app

## 주요 기능

- 연차 일수별 최적 휴가 구간 자동 추천
- 공휴일·주말 연계 계산으로 최대 연속 휴일 확인
- 직접 날짜 지정하여 개별 계산 가능

## 기술 스택

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Framer Motion
- Gemini AI API
- Cloud Run (asia-northeast3)

## 로컬 실행

```bash
npm install
```

`.env.local`에 Gemini API 키 설정:

```
GEMINI_API_KEY=your_api_key
```

```bash
npm run dev
```

http://localhost:3000 에서 확인
