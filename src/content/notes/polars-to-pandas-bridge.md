---
title: Polars에서 pandas로 건너갈 때 확인할 것
date: 2026-08-14
topic: tooling
status: working
tags:
  - polars
  - pandas
  - python
source: Polars DataFrame.to_pandas API
---

## 질문

Polars에서 전처리한 데이터를 pandas 전용 분석 함수에 넘길 때 무엇이 달라지는가?

## 상황

Polars로 만든 작은 테이블을 pandas DataFrame만 받는 라이브러리에 전달해야 했다. 분석 설계와 무관한 도구 호환성 확인이다.

## 한 것

Arrow 확장 배열을 유지하는 경우와 기본 NumPy-backed 변환을 나눠 확인한다.

```python
import polars as pl

frame = pl.DataFrame({"group": ["a", "b"], "score": [1.0, None]})
pandas_frame = frame.to_pandas()
print(pandas_frame.dtypes)
```

```text
shape: (4, 8)
┌────────────┬────────────┬──────────────┬─────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ subject_id ┆ condition  ┆ score_before ┆ score_after ┆ change_score ┆ group_mean   ┆ centered     ┆ complete_row │
│ ---        ┆ ---        ┆ ---          ┆ ---         ┆ ---          ┆ ---          ┆ ---          ┆ ---          │
│ str        ┆ str        ┆ f64          ┆ f64         ┆ f64          ┆ f64          ┆ f64          ┆ bool         │
╞════════════╪════════════╪══════════════╪═════════════╪══════════════╪══════════════╪══════════════╪══════════════╡
│ s01        ┆ treatment  ┆ 41.0         ┆ 55.0        ┆ 14.0         ┆ 9.75         ┆ 4.25         ┆ true         │
└────────────┴────────────┴──────────────┴─────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

## 결과 문장

결측값이 있는 수치 열은 변환 뒤 dtype이 달라질 수 있으므로, 모델 입력 직전에 dtype과 결측값 표현을 다시 확인한다.

## 확신 없는 곳

`use_pyarrow_extension_array=True`가 모든 downstream 라이브러리에서 복사 없는 변환을 보장하는지는 확인하지 못했다.

## 다음

실제 분석 패키지 두 개에 같은 데이터를 넘겨 호환성과 메모리 사용량을 비교한다.
