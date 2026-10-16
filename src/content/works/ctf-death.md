---
title:
  ko: ""
  en: CTF-DEATH
year: "2025"
status: published
workType: independent
artistOrRole:
  ko: 제작자
  en: Maker
venue:
  ko: 국민대 조형대
  en: KMU Design
locationMap: seongbuk
contentBlocks:
  - type: video
    embed: <iframe title="vimeo-player"
      src="https://player.vimeo.com/video/1095203794?h=4823aa0c10" width="640"
      height="360" frameborder="0"
      referrerpolicy="strict-origin-when-cross-origin" allow="autoplay;
      fullscreen; picture-in-picture; clipboard-write; encrypted-media;
      web-share"   allowfullscreen></iframe>
  - type: text
    body:
      ko: >-
        **"신인류를 위한 시뮬레이션"**


        2025년 5월~6월경에 제작된 이 작업물은 LLM 기반의 역할 놀이(Role-playing) 구조, FLUX.1 Kontext 이미지 편집, Seedance 비디오 생성 기술, 그리고 바이브 코딩(Vibe coding)으로 구현한 간단한 웹 인터페이스를 결합한 프로젝트입니다.


        모델명: gpt-4o / Chat Completions API 사용


        * 세계관에 대한 간략한 설명은 인트로(Intro) 챕터에 포함됨.

        * 모든 크레딧은 클리어(Clear) 챕터에 기재되어 있음.
      en: >-
        **"Simulation for the New Humanity"**


        Created around May–June 2025, it combines an LLM-based role-playing structure, FLUX.1 Kontext image editing, Seedance video generation, and a simple web interface made through vibe coding. I see it less as a polished artwork and more as a small experiment in connecting the AI tools available at the time into one interactive experience.


        Model: gpt-4o / Using Chat Completions API


        * A brief explanation of the world-building is included in the Intro chapter.

        * All credits are listed in the Clear chapter.
  - type: statsLink
    ctaLabel:
      ko: ""
      en: View link
    url: https://ctf-death.vercel.app/
    title:
      ko: ""
      en: CTF-DEATH
    subtitle:
      ko: ""
      en: Simulation for the New Humanity
  - type: text
    body:
      ko: ※ GPT-4o 기반의 AI 롤플레잉 기능은 현재 정상 작동하지 않습니다. 아래 명령어로 클리어·실패 엔딩을 확인할 수 있습니다.
        (따옴표를 제외한 명령어만 입력)
      en: ※ The GPT-4o-based AI roleplay feature is currently not working properly.
        You can check the clear/fail endings using the commands below. (Enter
        commands only, excluding quotes)
  - type: text
    body:
      ko: |-
        ```python
        # 클리어 엔딩
        # 입력 후 약 3.5초 뒤 엔딩 영상으로 전환됩니다.
        "/admin_force_clear"

        # 실패 엔딩
        # 남은 시간이 5초로 변경된 뒤 실패 엔딩으로 전환됩니다.
        "/admin_force_fail"
        ```
      en: >-
        ```python

        # Clear ending

        # Approximately 3.5 seconds after entering, it will transition to the clear ending video.

        "/admin_force_clear"


        # Fail ending

        # The remaining time will change to 5 seconds, and once time runs out, it will transition to the fail ending.

        "/admin_force_fail"

        ```
tags:
  - AI
thumbnail: https://cdn.jsdelivr.net/gh/mapsycoy/mapsycoy-assets@3698d9c/uploads/works/ctfdeath.webp
---
