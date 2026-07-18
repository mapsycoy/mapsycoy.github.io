---
title:
  ko: 문샷, 세계 최대 오픈 웨이트 모델 K3 가중치 27일 공개
  en: "Moonshot AI Dropping Kimi K3 Weights on July 27: The World’s Largest
    Open-Weight Model"
slug: "11"
publishedAt: 2026-07-19
status: published
pinned: false
tag: AI News
thumbnail: https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2FlrqUsUJocTIEaPB4SrQse%2Fe8773a218e398efc6759ca6044672f81%2FNuneybits_Vector_art_of_red_code_tsunami_over_servers_fear_of_C_1894f89b-b074-4e21-a0de-2f9a46cfdd32.webp%3Fw%3D1000%26q%3D100&w=2048&q=85
heroImage: https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2FlrqUsUJocTIEaPB4SrQse%2Fe8773a218e398efc6759ca6044672f81%2FNuneybits_Vector_art_of_red_code_tsunami_over_servers_fear_of_C_1894f89b-b074-4e21-a0de-2f9a46cfdd32.webp%3Fw%3D1000%26q%3D100&w=2048&q=85
heroImageCaption:
  en: "Credit: VentureBeat made with Midjourney"
  ko: "크레딧: VentureBeat (Midjourney 활용 이미지)"
contentBlocks:
  - type: text
    body:
      ko: >-
        ## **브리핑**


        [China’s Moonshot AI releases Kimi K3, the largest open-source model ever, rivaling top U.S. systems](https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems)


        중국 Moonshot AI가 지난 16일 출시한 Kimi K3의 전체 가중치를 오는 27일 공개한다. 2.8조개 매개변수를 가진 K3는 출시 시점 기준 **'역대 최대 규모의 오픈 웨이트 모델'**로, 기존 오픈 웨이트 최대 규모였던 DeepSeek(1.6조)의 두 배 가까운 크기다.


        성능 지표도 심상치 않다. Artificial Analysis 종합 지수에서 189개 모델 중 4위를 기록하며 Claude Opus 4.8, GPT-5.5와 동급으로 평가받았고, Arena 프론트엔드 코드 부문에서는 Claude Fable 5와 GPT-5.6 Sol을 제치고 1위에 올랐다. 폐쇄형 최상위 모델과의 격차가 '세대'가 아니라 '개월' 단위로 좁혀진 셈이다.


        시장의 반응은 2025년 초 DeepSeek 쇼크를 연상시킨다. 다만 아직은 유보가 필요하다. 공개 전까지 개발자들이 모델을 독립적으로 검증하거나 수정할 수 없기 때문에, 현재 벤치마크가 자체 발표 수준을 넘어 재현되는지는 27일 이후에야 판가름 난다.




        ---




        ## **이전에 K2를 다뤄본 입장에서는**


        [Grok4 vs KIMI K2 (六小虎) **∣** 맵시's AI 잡지식 저장소:티스토리](https://mapsycoy.tistory.com/7)


        정확히 1년 전, 나는 K2를 직접 테스트했었다. 당시 내 평가는 '불만족'이었다. 크롬 다이노 게임 하나 제대로 못 만들었고, 한국어는 어색했고, 출처는 죄다 중국 커뮤니티였으며, 중국 정부에 대해 물었을 때 "중립적"이라던 자기 소개와 달리 답을 회피했다. "개발분야에서 Claude를 뛰어넘었다"는 평가에 대해서도, 자국 내 사용자 통계로 부풀려진 것 아니냐고 의심했다.


        [중국의 "The Good-Enough" 전략, 그 안에 숨겨진 진짜 목적은? ∣ 맵시's AI 잡지식 저장소:티스토리](https://mapsycoy.tistory.com/38)


        그리고 지난 1월, 나는 이러한 중국의 행보를 "Good-Enough 전략"으로 정리했었다. 최고의 모델이 아닌 '준수한' 모델을 오픈 소스로 풀어 대규모 채택을 유도하고, 미국 기업들의 수익 구조 자체를 무너뜨리는 전략 말이다.


        그런데 K3는 이 프레임에서 한 발 더 나아간 것으로 보인다. '준수한' 수준이 아니라 프론티어 코앞까지 왔다고 주장하고, 가격도 중국 모델 특유의 초저가($0.x대)가 아닌, Anthropic 중위 모델에 근접한 수준($3/$15)을 책정했다. 반년 전의 분석이 맞다면, 이는 채택 유도 단계를 지나 본격적인 수익화에 들어가겠다는 신호로도 읽힌다.


        여기서 오해하면 안 되는 점은, '오픈 웨이트'와 '유료 API'는 별개의 상품이라는 것이다. 가중치 공개는 모델 파일 자체를 무료로 받아 자신의 장비에서 돌릴 수 있다는 뜻이고, $3/$15는 Moonshot이 자사 서버에서 대신 구동해 주는 API 서비스의 가격이다. 코드는 공짜지만 호스팅은 유료인 오픈소스 소프트웨어와 같은 구조로, 이전에 내가 Z.ai의 GLM 구독 사례에서 다뤘던 개념과 동일하다.


        다만 K3의 경우 이 구조가 사실상 API 쪽으로 기울어져 있다. 


        [Run Kimi K3 Today: The 1.4TB VRAM Reality | Glows.ai](https://glows.ai/article/run_kimi_k3_hardware_cost_guide_en)


        K3 가중치 용량만 약 1.4TB에 달할 것으로 추정되어 개인과 대부분의 조직에게 로컬 구동은 비현실적이기 때문이다. 자체 호스팅이 의미 있는 경우는 폐쇄망·데이터 주권 요구가 있거나, 자체 데이터로 파인튜닝을 하거나, 사용량이 API 단가를 넘어설 만큼 큰 일부 기업 정도로 좁혀진다.


        결국 수익은 API에서 나오고, 가중치 공개의 실질적 기능은 


        * "벤치마크를 직접 확인해 보라"는 검증 가능성

        * 타 클라우드 사업자들의 호스팅을 통한 생태계 확산


        에 있다고 보는 것이 타당하다.


        결국 관건은 검증이다. 만약 27일 가중치 공개 후에도 벤치마크 성능이 재현된다면, 고비용 API 구조를 유지해온 미국 AI 기업들은 "왜 이 가격을 내야 하는가"라는 유저들의 질문에 다시 답해야 할 것이다.
      en: >-
        ## **Briefing**


        [China’s Moonshot AI releases Kimi K3, the largest open-source model ever, rivaling top U.S. systems](https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems)


        China's Moonshot AI announced it will release the full weights of Kimi K3 on July 27th, following its initial launch on the 16th. Packing 2.8 trillion parameters, K3 stands as the **"largest open-weight model in history"** as of its release date—nearly doubling the size of the previous open-weight record holder, DeepSeek (1.6 trillion parameters).


        Its performance metrics are equally formidable. K3 ranked 4th out of 189 models on the Artificial Analysis composite index, putting it on par with Claude Opus 4.8 and GPT-5.5. Furthermore, it claimed the #1 spot in the Arena front-end code category, outperforming Claude Fable 5 and GPT-5.6 Sol. The gap between open-weight and top-tier proprietary models has seemingly narrowed from "generations" to mere "months."


        The market's reaction is reminiscent of the early 2025 "DeepSeek shock." However, a degree of skepticism is still warranted for now. Because developers cannot independently verify or modify the model until the official release, we will only find out after July 27th whether these benchmarks hold up beyond the company's self-reported claims.




        ---




        ## **From the Perspective of Someone Who Tried K2**


        [Grok4 vs KIMI K2 (六小虎) **∣** 맵시's AI 잡지식 저장소: Tistory](https://mapsycoy.tistory.com/7)


        Exactly one year ago, I tested K2 myself. My assessment at the time was "unsatisfactory." It couldn't even build a proper Chrome Dino game, its Korean phrasing was awkward, its sources were heavily drawn from Chinese online communities, and despite introducing itself as "neutral," it dodged questions regarding the Chinese government. I also suspected that the claims of it "surpassing Claude in development tasks" were likely inflated by domestic user statistics.


        [China's "The Good-Enough" Strategy: What is the Real Purpose Behind It? ∣ 맵시's AI 잡지식 저장소: Tistory](https://mapsycoy.tistory.com/38)


        Then this past January, I framed China's approach as a "Good-Enough Strategy"—releasing 'decent' models as open source to drive mass adoption and undermine the revenue structures of U.S. tech giants.


        However, K3 appears to take a step beyond this framework. Instead of aiming for just "good enough," it claims to be right at the frontier. Its pricing also departs from the typical ultra-low-cost range of Chinese models (sub-$1) and sits closer to Anthropic's mid-tier pricing ($3/$15). If my analysis from six months ago holds true, this signals a transition from driving adoption to full-scale monetization.


        To avoid confusion, it is important to note that "open weights" and "paid APIs" are distinct product models. Releasing the weights means you can download the model file for free to run on your own hardware, whereas the $3/$15 pricing applies to the API service hosted on Moonshot's own servers. This mirrors the structure of open-source software where the code is free but hosting is paid—a concept I previously covered regarding Z.ai's GLM subscription case.


        In the case of K3, however, this dynamic leans heavily toward the API side.


        [Run Kimi K3 Today: The 1.4TB VRAM Reality | Glows.ai](https://glows.ai/article/run_kimi_k3_hardware_cost_guide_en)


        With K3's weight capacity estimated at around 1.4TB, running it locally is unrealistic for individuals and most organizations. Self-hosting only becomes viable for a narrow subset of enterprises that require closed networks for data sovereignty, need to fine-tune the model with proprietary data, or have a usage volume massive enough to offset the API costs.


        Ultimately, revenue will come from the API, and the practical utility of releasing the weights boils down to:


        * Providing verification so users can "verify the benchmarks themselves"

        * Expanding the ecosystem through hosting by third-party cloud providers


        Verification remains the critical hurdle. If K3's benchmark performance is successfully replicated after the weights are released on the 27th, U.S. AI companies—which have maintained high-cost API structures—will once again face tough questions from users demanding to know exactly what they are paying for.
---
