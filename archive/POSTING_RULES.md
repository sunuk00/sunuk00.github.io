# 게시글 작성 규칙 (빠른 참고용)

`archive`에서 임시 작성할 때 이 문서만 보고 그대로 맞추면 됩니다.

## 1) 가장 중요한 Front Matter 규칙

게시글 `.md` 파일 맨 위에는 반드시 아래 형식이 있어야 합니다.

```yml
---
title: "Diffusion Model"
tags:
    - Computer Vision
date: "2026-02-23"
---
```

필수:
- `title` (비우면 안 됨)
- `date` (비우면 안 됨, 형식: `YYYY-MM-DD`)

권장:
- `tags`는 리스트 형식으로 작성

## 2) 선택 항목

### `thumbnail`
대표 이미지를 쓰고 싶을 때:

```yml
thumbnail: "/assets/img/thumbnail/sample.png"
```

### `bookmark`
사이드바에서 해당 글을 바로 보이게 하고 싶을 때:

```yml
bookmark: true
```

### `nav_order`
왼쪽 카테고리(사이드바) 정렬 순서를 직접 지정하고 싶을 때 사용합니다.

```yml
---
nav_order: 1
---
```

- 숫자가 작을수록 위에 표시됩니다.
- 이 값은 **카테고리 폴더의 `index.md`**에 넣는 것을 권장합니다.
- `nav_order`를 안 쓰면 기존 URL(폴더/파일명) 기준 정렬이 적용됩니다.

## 3) 파일/폴더 규칙

- 게시 대상 파일은 `_pages` 아래에 있어야 함
- 카테고리 폴더에는 `index.md`가 있어야 함
- `index.md` 내용은 아래 2줄만

```yml
---
---
```

예시:

```text
_pages/
  index.md
  Papers/
    index.md
    2026-02-23-Diffusion.md
```

## 4) 임시 작성(archive) → 게시 순서

1. `archive/` 또는 `archive/카테고리명/`에서 초안 작성
2. 발행할 때 `_pages/<카테고리>/`로 파일 이동
3. 파일 맨 위 Front Matter 필수값(`title`, `date`) 최종 확인
4. 필요하면 `tags`, `thumbnail`, `bookmark` 추가

## 5) 자주 나는 실수 체크

- `---` 구분선 빠뜨림
- `date` 형식 오류 (`2026/02/23` 같은 형식)
- `tags`를 문자열 1줄로 씀 (리스트로 작성해야 안전)
- 카테고리 폴더에 `index.md` 없음
- 카테고리 순서를 바꾸고 싶은데 `index.md`에 `nav_order`를 안 넣음
- 오탈자: 예) `Diffusion Modlel` → `Diffusion Model`

## 6) 바로 복붙용 템플릿

```yml
---
title: "제목 입력"
tags:
    - 태그1
    - 태그2
date: "YYYY-MM-DD"
# thumbnail: "/assets/img/thumbnail/sample.png"
# bookmark: true
---

# 첫 번째 헤더

본문 작성...
```
