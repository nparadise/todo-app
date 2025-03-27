# React Todo App

리액트를 이용한 Todo 웹 어플리케이션

## 기술 스택

- **프론트엔드**: React, TypeScript
- **번들러**: Vite
- **스타일링**: Tailwind CSS
- **데이터 저장소**: IndexedDB (idb 라이브러리 사용)

## 주요 기능

1. **할 일 관리**

   - 할 일 추가, 수정, 삭제
   - 완료 상태 업데이트

2. **데이터 저장 및 불러오기**

   - IndexedDB를 이용한 로컬 데이터 저장
   - 할 일 목록을 Base64 형식으로 내보내기
   - Base64 형식의 데이터를 가져와 IndexedDB에 저장

3. **UI/UX**

   - 반응형 웹 디자인 (모든 기기 크기 지원)
   - 다크 모드 지원 (사용자 브라우저 설정에 따라 자동 적용)

## 프로젝트 구조

- `src/components`: UI 컴포넌트
- `src/hooks`: 커스텀 훅
- `src/libs`: IndexedDB 관련 로직 및 타입 정의

## 설치 및 실행

1. **프로젝트 클론**

   ```bash
   git clone https://github.com/your-repo/todo-app.git
   cd todo-app
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```

4. **애플리케이션 빌드**
   ```bash
   npm run dev
   ```
