# 배리어프리 학습 도우미 챗봇

Vite + Netlify 환경에서 개발된 특수교육용 학습 도우미 챗봇입니다.

## 기능

1. **교과서 이미지 분석**: GPT-4o Vision을 사용하여 교과서 이미지에서 핵심 개념을 추출하고 점자와 수어 설명을 제공합니다.
2. **학습 챗봇**: 이미지 분석 내용을 바탕으로 학습 질문에 답변하는 챗봇 기능
3. **Firebase 연동**: 채팅 기록을 Firebase Firestore에 저장

## 설정 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_OPENAI_API_KEY=your-actual-api-key-here
```

**중요**: Vite에서는 클라이언트에서 접근 가능한 환경 변수는 반드시 `VITE_` 접두사를 사용해야 합니다.

### 2. Firebase 설정 (선택사항)

`index.html` 파일의 Firebase 설정 부분을 본인의 Firebase 프로젝트 정보로 수정하세요:

```javascript
const firebaseConfig = {
    apiKey: "본인의_FIREBASE_API_KEY",
    authDomain: "본인의_PROJECT_ID.firebaseapp.com",
    projectId: "본인의_PROJECT_ID",
    storageBucket: "본인의_PROJECT_ID.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};
```

Firebase를 사용하지 않으려면 해당 부분을 주석 처리하거나 설정을 비워두면 됩니다.

### 3. Netlify 배포 시 환경 변수 설정

Netlify 대시보드에서:
1. Site settings → Environment variables
2. `VITE_OPENAI_API_KEY` 변수를 추가하고 실제 API Key 값을 입력

## 개발

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 파일 구조

```
├── index.html          # 메인 HTML 파일
├── src/
│   └── api.js         # GPT API 호출 함수
├── .env               # 환경 변수 (git에 커밋하지 않음)
└── vite.config.js     # Vite 설정
```

## 주의사항

- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- Netlify에 배포할 때는 반드시 Netlify 대시보드에서 환경 변수를 설정해야 합니다.
- API Key는 클라이언트 사이드에서 노출되므로, 프로덕션 환경에서는 서버 사이드에서 API를 호출하는 것을 권장합니다.

