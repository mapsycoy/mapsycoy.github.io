---
title:
  ko: 해석이라는 이름 아래
  en: In the name of interpretation
slug: "9"
publishedAt: 2026-07-13
status: published
pinned: false
tag: Essay
series: child-ai
seriesOrder: 9
summary:
  ko: 모호성을 사물의 속성이 아닌 아이와 시스템의 관계로 보고, 아이에게 해석할 수 있다는 허가를 남기는 상호작용의 조건을 탐색합니다.
  en: Treating ambiguity as a relationship rather than an object, this essay asks how interaction can leave children with permission to interpret.
thumbnail: https://cdn.jsdelivr.net/gh/mapsycoy/mapsycoy-assets@3698d9c/uploads/blog/lepetitprince.webp
heroImage: https://cdn.jsdelivr.net/gh/mapsycoy/mapsycoy-assets@3698d9c/uploads/blog/lepetitprince.webp
heroImageCaption:
  en: www.lepetitprince.com
  ko: ""
contentBlocks:
  - type: text
    body:
      ko: >-
        지난 글에서 나는 하나의 규범에 도달했다.


        ***“아이에게 무엇을 느끼게 할 것인가가 아니라, 아이에게 무엇을 하도록 남겨둘 것인가.”***


        그런데 이 문장을 쓰고 나서, 나는 스스로에게 물어야 했다. 이 규범이 요구하는 **"의도적 모호성"**이란 정확히 무엇의 모호성인가. 침묵하는 상상 속 친구도, 유창한 AI 컴패니언도 어떤 의미에서는 모두 모호하다. 모호성이라는 말만으로는 좋은 설계와 나쁜 설계가 다시 한번 구별되지 않는다.


        이 문제를 이론화한 논문이 있다. 


        CHI 2003 속 Gaver, Beaver, Benford의 「*Ambiguity as a Resource for Design*」


        [Ambiguity as a Resource for Design](https://dl.acm.org/doi/10.1145/642611.642653)




        ---




        ## 모호성은 사물이 아니라 관계다


        Gaver 등이 가장 먼저 못박는 것은, 모호성이 사물[^1]의 속성이 아니라는 것이다.


        > ambiguity is an attribute of our interpretation of them


        부정확함(fuzziness)이나 불일치는 대상 자체의 속성이지만, **모호성은 그 대상을 해석하는 사람과 대상 사이의 관계에서만 발생한다.** 같은 인공물이라도 보는 사람의 기대와 정체성에 따라 모호할 수도, 명료할 수도 있다는 것이다.


        이 이동은 낯설지 않다. Wegner가 행위성을 "행동에 내재한 사실"이 아니라 "사후적으로 추론된 귀속"이라 말했을 때와 같은 구조를 하고 있기 때문이다. 두 이론 모두, 겉보기에 대상 쪽에 있는 것 같은 성질을 관찰자와 대상의 관계 쪽으로 옮겨놓는다. Gaver의 모호성과 Wegner의 행위성은, 서로 다른 학문에서 같은 인식론을 공유하는 셈이다.




        ---




        ## 세 가지 모호성, 세 가지 요구


        Gaver 등은 모호성을 세 층위로 나눈다.


        * **정보의 모호성**: 정보 자체가 불완전하거나 지나치게 확정적이어서 발생한다. 《모나리자》의 스푸마토(Sfumato) 기법이 입가의 경계를 흐려 표정을 확정하지 못하게 만드는 것처럼

        * **맥락의 모호성**: 하나의 대상이 양립 불가능한 해석 틀에 동시에 걸쳐 있을 때 발생한다. 포스트모더니즘 속 뒤샹의 《샘》이 변기이면서 동시에 예술 작품인 것처럼

        * **관계의 모호성**: 해석자 자신의 가치와 입장이 시험대에 오를 때 발생한다. 가장 사적인 인간의 성적 욕망을 완벽히 충족하는 기능적 공간 《라 배조드롬(La Bais-ô-Drôme)》 앞에서 관람자가 "나라면 이곳에 살고 싶은가"를 스스로에게 묻게 되는 것처럼


        이 세 유형은 서로 다른 해석 작업을 요구한다. 정보의 모호성은 진위를 스스로 판단하도록, 맥락의 모호성은 상충하는 의미를 통합하도록, 관계의 모호성은 자신의 가치관을 성찰하도록 만든다.


        논문은 마지막에 이렇게 정리한다. **모호성은 설계자에게 영감을 주는 자원이자, 사용자에 대한 깊은 존중의 표현이라는 것이다.**


        해법을 부과하지 않고 쟁점만 제시하는 것, 그것이 사용자에 대한 존중이라는 것. 이 문장은 지난 글의 규범과 표면적으로는 거의 겹친다.




        ---




        ## 아쉬웠던 점


        문제는 이 **"존중"**이 정확히 무엇을 가리키는가이다.


        Gaver 등이 다루는 사례들은 반복해서 사용될 수 있다. 논문이 이를 부정하지는 않는다. 다만 논문의 관심은 반복 속에서 사용자의 해석이 누적되어 시스템을 다시 구성하는가가 아니라, 한 순간에 발생하는 해석의 가능성 자체에 있다. 즉 반복적 상호작용을 전제로 한 설계는 이 논문의 분석 범위 밖에 남아 있다.


        뜻밖에도 저자는 이 공백을 논문 안에서 스스로 예견하고 있다. Home Health Monitor의 별자리 운세를 다루며, Gaver 등은 과잉해석이 아무 근거 없는 헛소리여서는 안 된다고 스스로 경고한다. 믿음을 유보하기 어려울 만큼은 그럴듯해야 한다는 것이다.


        과잉해석이 성공하려면 "믿을 수 있는 그럴듯함"의 문턱을 넘어야 한다는 것. 이들이 실패 사례로 든 것은 새의 지저귐이나 반려동물의 울음소리를 기계적으로 변환해 말하게 하려던 동물 언어 번역(Tweet-to-Text) 시스템 제안이었다. 흥미로운 것은, 이 경고가 오직 한 번의 마주침에서의 그럴듯함만을 다룬다는 점이다. "반복된 관계 속에서 그 해석이 정말로 무언가를 바꾸는가"는 다루지 않는다.


        이러한 공백은 아마도 논문이 쓰인 2003년 당시 AI 기술의 구현도와 무관하지 않을 것이다. 당시의 기술 환경을 고려하면, 사용자의 해석이 장기간 시스템 상태를 변화시키는 상호작용은 설계의 중심이 되기 어려웠을 것이다.


        그러니 사용자의 텍스트를 실시간으로 학습하고 맥락을 이어 붙이는 생성형 AI 시대의 상호작용 설계는 이 지점에서 달리 보아야 할 것이다.




        ---




        ## **그로부터 21년 후**


        이 공백이 2003년 기술의 한계 때문이었다면, 생성형 AI가 등장한 지금은 메워졌어야 한다. 


        실제로 Gaver 외 공저자 중 한 명인 Steve Benford는 21년 뒤 Sivertsen 등 연구진과 함께 자신의 이론을 스스로 갱신했다. (제1저자는 Benford가 아니지만, 편의를 위해 그의 이름을 사용하도록 하겠다.)


        [Machine Learning Processes as Sources of Ambiguity: Insights from AI Art](https://dl.acm.org/doi/10.1145/3613904.3642855)


        CHI 2024에서 Benford 등은 「*Machine Learning Processes as Sources of Ambiguity: Insights from AI Art*」에서 아홉 개의 AI 아트 작품을 분석하며, Gaver의 세 가지 모호성(정보/맥락/관계)만으로는 머신러닝을 다루기에 부족하다고 말한다. 그들이 제안하는 네 번째 유형은 '과정의 모호성'이다 — 데이터셋 구성, 모델 학습, 적용이라는 ML 파이프라인 자체가 모호하다는 것. 그리고 이 모호함은 관객만이 아니라 그것을 만든 아티스트 자신에게도 해당된다고 그들은 명시한다. 만드는 사람도 자신이 만든 시스템이 정확히 어떻게 작동할지 온전히 알지 못한다.


        이 논문은 한 걸음 더 나아가, HCI가 AI에 요구해온 '신뢰가능성'과 '설명가능성'에도 정면으로 질문을 던진다 


        불확실성을 감추지 말고 드러내라고, 그것이 오히려 사용자를 성찰로 이끈다고 그들은 주장한다. 이 주장은 언뜻 이 글이 걸어온 길과 같은 방향을 가리키는 것처럼 보인다 — 모호성을 없애지 말라는 것이니까.


        더욱 흥미로운 것은 이 논문의 서두다. 


        > With a few exceptions, Gaver and colleagues' framework has not been applied to AI or challenged in substantial ways.


        저자들은 Gaver의 프레임워크가 소수의 예외를 제외하면 AI에 적용되거나 실질적으로 도전받은 적이 거의 없었다고 스스로 인정한다.


        그런데 여기에는 짚어야 할 지점이 있다. 


        [Staying Open to Interpretation: Engaging Multiple Meanings in Design and Evaluation](https://dl.acm.org/doi/10.1145/1142405.1142422)


        DIS 2006 속 「*Staying Open to Interpretation: Engaging Multiple Meanings in Design and Evaluation*」에서 Gaver는 이미 이 문제의 한 축을 정확히 알고 있었다. (2006년의 Bill Gaver와 2003년의 William W. Gaver는 동일인이 공식 이름과 통칭을 혼용해 표기한 것뿐이다.) 


        **이 논문에서 그는 전통적 HCI가 디자이너의 의도대로 사용자가 시스템을 이해하는 '단일하고 권위 있는 해석'에 집착해온 것을 비판하며, 시스템과 사용자가 얽혀 들어가는 상호작용의 불확실성을 인정하고, 불완전함과 모호성을 디자인의 전략적 도구로 삼아야 한다고 주장했다.**


        더 나아가 그는 시스템이 여러 해석을 제안하는 것만으로는 부족하다고 말한다. 사용자가 "내가 해석해도 된다"는 허가(license)를 느껴야 한다는 것이다. 그 허가가 없다면 모호성은 풍부함이 아니라 혼란으로 읽힌다.


        즉, 명시적으로 다중 해석을 허용하는 시스템의 필요성을 언급한 것이다.


        결국 Benford 등이 2024년에 포착한 '만드는 이조차 온전히 알 수 없는 과정의 모호성'은, 일찍이 2006년 Gaver가 얘기했던 '디자이너의 통제를 벗어난 불확실성'이 AI 시대에 이르러 기술적 필연으로 발현된 것에 가깝다고 볼 수도 있겠다.




        ---




        ## **마무리하며**


        지난 글까지 나는 조건을 좀 더 단순하게 생각했다. 아이의 노동이 시스템에 반영되어야 한다는 것. 그런데 Gaver의 두 논문을 따라 읽고 나니, 그 앞에 조건이 하나 더 있었다. 아이가 애초에 "내가 해석해도 된다"고 느끼지 못하면, 반영할 노동 자체가 생기지 않는다. 허가가 먼저고, 노동이 다음이고, 반영은 그 뒤다.


        이 논문은 그 허가를 만드는 방법으로 두 가지를 든다.


        1. 시스템의 오차와 한계를 감추지 말고 드러낼 것(seamfulness)

        2. **스스로를 똑똑한 존재가 아니라 '낯선' 존재로 제시할 것(alien presence)**


        시스템이 "내 해석이 유일한 정답"이라고 주장하지 않을 때, 비로소 사람은 자기 해석을 만들어도 된다고 느낀다는 것이다.


        흥미로운 것은 이 두 번째 전략의 시발점이다. 논문은 seamfulness가 데이터를 감지하고 보여주는 기기에는 통하지만, 데이터로부터 복잡한 추론을 하고 반응하는 시스템에는 그대로 적용하기 어렵다고 말한다. Alien presence는 바로 그런 추론 시스템, 즉 AI를 위해 고안된 전략이었다.


        <mark>**낯선 존재.**</mark>


        이전에 내가 상상 속 친구에서 다뤘던 접근법과 같다.


        이미 20년 전에 답의 방향은 제시되어 있었던 셈이다. 그런데 오늘날 아이 앞에 놓인 생성형 AI들은 오히려 그 방향과 반대로 움직이는 것처럼 보인다. 사용자가 해석할 여지를 남기기보다, 가능한 한 매끄럽게 응답하는 방향으로 발전해 왔기 때문이다.


        **"그렇다면 아이에게 '해석해도 된다'는 허가는 어디에서 가장 강력하게 발생할까."**


        아마 다음 글은 이 질문에서 시작해야 할 것 같다.


        [^1]: 물질세계에 있는 모든 구체적이며 개별적인 존재를 통틀어 이르는 말' 등을 의미
      en: >-
        In my previous writing, I arrived at a certain norm:


        ***"Not what to make the child feel, but what to leave for the child to do."***


        Yet, having written this sentence, I had to ask myself: what exactly is the ambiguity of this **"intentional ambiguity"** demanded by this norm? Both a silent imaginary friend and a fluent AI companion are ambiguous in some sense. The term *ambiguity* alone fails to distinguish good design from bad design once again.


        There is a paper that theorized this very problem:


        Gaver, Beaver, and Benford’s 「*Ambiguity as a Resource for Design*」 in CHI 2003.


        [Ambiguity as a Resource for Design](https://dl.acm.org/doi/10.1145/642611.642653)




        ---




        ## Ambiguity is a Relationship, Not an Object


        The very first point Gaver et al. firmly establish is that ambiguity is not an inherent property of things.


        > ambiguity is an attribute of our interpretation of them


        While fuzziness or inconsistency may be properties of the object itself, **ambiguity arises solely from the relationship between the object and the person interpreting it.** The exact same artifact can be ambiguous or clear, depending on the viewer's expectations and identity.


        This shift feels familiar. It shares the same structural logic as when Wegner described agency not as a "fact inherent in action" but as an "authorship ascribed after the fact." Both theories displace a property that seemingly belongs to the object, relocating it into the relationship between the observer and the object. Gaver’s ambiguity and Wegner’s agency share the same epistemology, albeit in different disciplines.




        ---




        ## Three Ambiguities, Three Demands


        Gaver et al. classify ambiguity into three distinct levels:


        * **Ambiguity of information**: Arises when the information itself is incomplete or overly precise. Just as the *sfumato* technique in the *Mona Lisa* blurs the edges of the mouth, preventing the expression from being definitively fixed.

        * **Ambiguity of context**: Arises when a single object spans incompatible interpretative frameworks simultaneously. Just as Duchamp’s *Fountain* in postmodernism is a urinal yet concurrently a work of art.

        * **Ambiguity of relationship**: Arises when the interpreter’s own values and stances are put to the test. Just as a viewer standing before *La Bais-ô-Drôme*—a functional space perfectly fulfilling the most private human sexual desires—is compelled to ask themselves, "Would I want to live here?"


        These three types demand different interpretive work. Ambiguity of information prompts users to judge truth for themselves; ambiguity of context urges them to integrate conflicting meanings; and ambiguity of relationship forces them to reflect on their own values.


        The paper concludes with this summary: **ambiguity is a resource that inspires designers and serves as an expression of deep respect for users.**


        Presenting issues rather than imposing solutions, and recognizing that very act as respect for the user—this sentence almost perfectly overlaps on the surface with the norm from my previous writing.




        ---




        ## Limitations


        The problem lies in what exactly this **"respect"** refers to.


        The examples discussed by Gaver et al. can be used repeatedly. The paper does not deny this. However, their focus is not on whether the user's interpretation accumulates over repeated interactions to reconfigure the system, but rather on the very possibility of interpretation arising in a single moment. In other words, design that presupposes iterative relationships remains outside the analytical scope of this paper.


        This gap is, unexpectedly, foreshadowed within the paper itself. Discussing the horoscopes of the Home Health Monitor, Gaver et al. warn that over-interpretation must not be groundless nonsense. It must be plausible enough to suspend disbelief.


        For over-interpretation to succeed, it must cross the threshold of "credible plausibility." The failure case they cite was a proposed animal language translation (Tweet-to-Text) system that attempted to mechanically convert bird chirps or pet cries into human speech. What is intriguing is that this warning only addresses plausibility during a single encounter. It does not address whether that interpretation truly alters anything within a sustained, repeated relationship.


        This omission is likely not unrelated to the level of AI implementation back in 2003 when the paper was written. Considering the technological environment of the time, interactions where a user's interpretation alters the system's state over the long term could hardly be the centerpiece of design.


        Therefore, interaction design in the era of generative AI, which learns from user text in real-time and stitches contexts together, must be viewed differently from this point onward.




        ---




        ## **21 Years Later**


        If this gap was due to the technological limitations of 2003, it should have been filled by now, given the advent of generative AI.


        Indeed, 21 years later, Steve Benford—one of Gaver's co-authors—updated his own theory alongside Sivertsen and other researchers. (While Benford is not the primary author, I will refer to it as Benford et al. for convenience.)


        [Machine Learning Processes as Sources of Ambiguity: Insights from AI Art](https://dl.acm.org/doi/10.1145/3613904.3642855)


        In 「*Machine Learning Processes as Sources of Ambiguity: Insights from AI Art*」 at CHI 2024, Benford et al. analyze nine AI art pieces and argue that Gaver’s three ambiguities (information, context, relationship) are insufficient for dealing with machine learning. They propose a fourth type: 'ambiguity of process'—the idea that the ML pipeline itself, consisting of dataset curation, model training, and deployment, is ambiguous. Furthermore, they explicitly state that this ambiguity applies not only to the audience but to the artists themselves. The creators do not fully know how the systems they built will operate.


        This paper goes a step further, directly challenging the notions of 'trustworthiness' and 'explainability' that HCI has traditionally demanded of AI.


        They argue that rather than hiding uncertainty, revealing it is precisely what leads users to reflection. This argument seems to point in the same direction as the path this text has trodden—namely, not to eradicate ambiguity.


        Even more fascinating is the introduction of this paper:


        > With a few exceptions, Gaver and colleagues' framework has not been applied to AI or challenged in substantial ways.


        The authors themselves admit that, save for a few exceptions, Gaver’s framework has rarely been applied to or substantially challenged by AI.


        However, there is a point here that must be scrutinized.


        [Staying Open to Interpretation: Engaging Multiple Meanings in Design and Evaluation](https://dl.acm.org/doi/10.1145/1142405.1142422)


        In 「*Staying Open to Interpretation: Engaging Multiple Meanings in Design and Evaluation*」 at DIS 2006, Gaver was already keenly aware of one axis of this problem. (The Bill Gaver of 2006 and the William W. Gaver of 2003 are the same person, simply alternating between his official name and colloquial name.)


        **In this paper, he critiqued traditional HCI's obsession with a 'single, authoritative interpretation' where users understand the system exactly as the designer intended. Instead, he argued for acknowledging the uncertainty of interactions where system and user become entangled, advocating for incompleteness and ambiguity as strategic design tools.**


        Furthermore, he stated that it is not enough for a system to merely suggest multiple interpretations. The user must feel a "license" to interpret. Without that license, ambiguity is read not as richness, but as confusion.


        In short, he noted the necessity of systems that explicitly allow for multiple interpretations.


        Ultimately, the 'ambiguity of process, unknown even to the creator' captured by Benford et al. in 2024 can be seen as the technological manifestation of the 'uncertainty beyond the designer's control' that Gaver spoke of back in 2006, now realized as a technical inevitability in the age of AI.




        ---




        ## **In Conclusion**


        Until my previous text, I considered the conditions rather simply: that the child's labor must be reflected in the system. However, reading through Gaver’s two papers reveals a prerequisite condition: if the child does not feel the license to interpret in the first place, the very labor to be reflected will never emerge. License comes first, labor follows, and reflection comes last.


        The paper offers two strategies for constructing that license:


        1. Do not hide the system's errors and limitations; reveal them (seamfulness)

        2. **Present the system not as an intelligent entity, but as an alien presence**


        Only when a system refrains from claiming "my interpretation is the sole correct answer" do people finally feel they are allowed to construct their own interpretations.


        What is intriguing is the starting point of this second strategy. The paper notes that while *seamfulness* works for devices that sense and display data, it is difficult to apply directly to systems that perform complex reasoning and respond based on that data. An *alien presence* was a strategy conceived precisely for such reasoning systems—namely, AI.


        <mark>**An alien presence.**</mark>


        This aligns with the approach I previously explored regarding imaginary friends.


        The direction of the answer was already presented 20 years ago. Yet, the generative AIs placed before children today seem to move in the exact opposite direction. They have evolved to respond as seamlessly as possible, rather than leaving room for the user to interpret.


        **"If so, where does the license to interpret emerge most powerfully for a child?"**


        Perhaps the next piece of writing should begin with this question.
---
