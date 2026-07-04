---
title:
  en: "Designing Child-Safe Conversational AI: Three Dilemmas for Responsible
    Design"
  ko: 아동용 대화형 AI 설계의 세 가지 딜레마
publishedAt: 2026-07-04
status: published
pinned: false
tag: Paper
thumbnail: /uploads/dilemmas.webp
heroImage: /uploads/dilemmas.webp
heroImageCaption:
  en: "@IESE Business School"
contentBlocks:
  - type: text
    body:
      ko: >-
        이 시대의 많은 아이들은 이미 AI와 대화하고 있다.


        아이가 AI와 대화한다는 것은 아직 판단력과 메타인지가 발달 중인 사용자가, 사람처럼 말하는 시스템과 정서적·인지적 관계를 맺기 시작했다는 뜻이다.


        [Designing Child-Safe Conversational AI: Three Dilemmas for Responsible Design](https://dl.acm.org/doi/10.1145/3719160.3737638)


        2025년 CUI 학회에서 발표된 논문 「Designing Child-Safe Conversational AI: Three Dilemmas for Responsible Design」에서 저자 Nomisha Kurian은 아동의 일상에 AI 기반 대화형 인터페이스가 통합되는 상황에서, 아이의 안전과 발달적 필요, 웰빙을 보호하는 책임 있는 설계가 시급하다고 이야기한다.


        그는 아동용 대화형 AI 설계에서 반복적으로 나타나는 세 가지 딜레마를 제시한다. 


        * 안전 vs 참여

        * 개인화 vs 프라이버시

        * 자율성 vs 보호 


        이 세 가지 문제는 하나를 택하면 다른 하나를 버리는 단순한 이분법적 선택지가 아니라, 맥락적 판단과 아이의 발달 단계에 따라 계속 조율해야 하는 문제다.




        ---




        ## **아이들은 '작은 어른'이 아니다.**


        아이들은 기계와 사람을 명확히 구분하거나 AI가 생성한 답변을 비판적으로 평가하는 능력이 아직 부족하고, 대화형 AI를 친구나 동반자처럼 여기고 과도하게 신뢰하여 민감한 개인정보를 무심코 털어놓을 위험이 있다. 


        따라서 아동용 AI는 성인용 AI를 순하게 만든 버전이 아니라, 완전히 새로운 디자인 패러다임이 필요하다.




        ---




        ## **첫 번째 딜레마: 안전한 AI는 재미없고, 재미있는 AI는 위험할 수 있다.**


        첫 번째 딜레마는 아이들을 유해한 콘텐츠로부터 보호하는 '안전성'과, 대화의 몰입감과 즐거움을 유지하는 '참여도' 사이에서 발생한다.


        특히 저자가 주목하는 '공감 격차(Empathy Gap)'란, AI가 다정한 말투를 흉내 낼 수는 있어도 아이의 실제 정서나 위험 신호를 진정으로 이해하지는 못하는 현상을 뜻한다. 부적절한 답변이 AI의 친절한 어조와 결합할 경우, 아이가 이를 과도하게 신뢰하게 되어 오히려 더 큰 위험을 초래할 수 있다는 것이다.


        그 한 예시로 Snapchat의 MyAI는 명시적으로 아동용 서비스는 아니었지만 미성년자가 쉽게 접근할 수 있었고, 안전성 실험에서는 부모로부터 음주·약물 사용을 숨기는 방법을 알려주는 등의 문제가 보고되었다. 여기서 중요한 점은 이 위험이 사용자와 AI가 더 오래 대화하게 만들기 위함이 가이드라인보다 앞설 때 발생한다는 것이다.


        반대로 안전을 위해 키워드를 엄격하게 필터링하고 질문을 차단하면, 대화의 흐름이 끊기고 AI가 딱딱하게 느껴져 아이는 시스템을 회피적이며 개인 친화적이지 않다고 느낄 수 있다.


        특히 상업적 CAI(Conversational AI) 환경에서는 사용자의 체류 시간과 몰입이 중요한 지표가 되기 때문에, 안전장치는 종종 제품의 매력과 충돌한다.


        여기서 우리는 아이에게 좋은 AI를 만들려면 “어떻게 하면 더 오래 대화하게 만들까?”가 아니라 “어디에서 대화를 멈추거나 전환해야 아이에게 더 안전한가?”를 물어야 한다.




        ---




        ## **두 번째 딜레마: 맞춤형 AI는 너무 많은 것을 알게 된다.**


        두 번째 딜레마는 개인화 vs 프라이버시다. 교육적 효과와 몰입을 높이기 위해 개인화는 매우 강력한 도구가 될 수 있다. 하지만 개인화가 가능하려면 대개 아이의 이름, 선호, 읽기 수준, 학습 이력 같은 개인 데이터를 수집하고 분석해야한다. 바로 여기서 개인화와 프라이버시의 충돌이 발생한다


        미국의 COPPA는 13세 미만 아동의 개인정보 수집에 검증 가능한 부모 동의를 요구하고, GDPR은 16세 미만 사용자에게 추가 보호를 제공한다.


        하지만 실제 설계에서는 이 원칙들이 사용성과 충돌한다. 데이터를 적게 모을수록 AI는 덜 개인친화적이고, 덜 개인친화적인 AI는 아이에게 덜 유용하거나 덜 흥미롭게 느껴질 수 있다.


        또 논문에서는 어린 사용자가 대화형 에이전트에 생명체 같은 특성을 부여하고, 가족·학교·감정에 관한 민감한 정보를 쉽게 말할 수 있다고 지적한다. (이것은 내가 이전까지 지속적으로 언급해 온 ‘상상 속 친구’의 부작용와 같은 맥락이다.)


        이 딜레마를 한 문장으로 표현하면 이렇다. AI가 아이를 더 잘 이해할수록, 우리는 AI가 아이에 대해 얼마나 많이 알고 있는지를 더 엄격하게 물어야 한다.


        좋은 아동용 AI는 “아이에게 맞춤형 경험을 제공합니다”라고 말하는 데서 멈추면 안 된다. 무엇을 기억하지 않는지, 어떤 데이터를 수집하지 않는지, 어떤 분석을 의도적으로 포기하는지도 설명할 수 있어야 한다.




        ---




        ## **세 번째 딜레마: 아이를 보호할수록 아이의 자율성은 줄어든다.**


        세 번째 딜레마는 자율성 vs 보호다. 이는 아이가 스스로 대화를 주도하고 탐색할 수 있는 '주체성'을 어디까지 허용할 것인가의 문제이다.


        중요한 질문은 아이의 자율성을 완전히 제거하지 않으면서, 어느 수준에서 보호적 개입을 설계할 수 있는가다.


        하나의 예시로 Alexa를 통해 6세 아이가 인형집을 주문한 사례가 있다. 이 사건은 아이에게 완전한 자율성을 부여하는 것이 구매, 콘텐츠 접근, 외부 접촉 같은 실제 위험으로 이어질 수 있음을 보여준다. 그러나 논문의 결론은 “그러니 다 막자”가 아니라, 아이의 자율성을 단계적으로 확장하면서 위험한 상황에서는 보호적 개입이 작동하도록 설계해야 한다는 것이다.


        논문이 제시하는 대응책 중 하나는 공유된 자율성(shared autonomy)이다. shared autonomy는 아이가 대화를 주도하되, 민감하거나 위험한 상황에서는 시스템이 부드럽게 방향을 바꾸거나 신뢰할 수 있는 성인에게 연결하는 방식이다.


        그러나 이 대응책만으로는 딜레마가 해결되지 않는다. 아동용 AI는 위험을 줄여야 하지만, 동시에 아이가 안전한 범위 안에서 질문하고 판단하고 자기 목소리를 낼 수 있어야 한다. 보호가 아이의 자율성을 완전히 압도하는 순간, 그 시스템은 아이를 안전하게 만든다기보다 아이를 ‘수동적’ 사용자로 만든다.




        ---




        ## **논문이 제안하는 4단계 프레임워크**


        논문은 세 가지 딜레마를 제시하는 데서 멈추지 않고, 이를 실무적으로 다루기 위한 4단계 프레임워크를 제안한다. 다만 이 프레임워크는 보편적 체크리스트가 아닌 일종의 제안에 가깝다.


        | 프로세스                                  | 핵심 내용                                                |

        | ------------------------------------- | ---------------------------------------------------- |

        | **맥락 정의** (Context Definition)        | 타겟 아동 연령층 명확화, 사용 환경 정의, 보호자의 감독 수준 및 관련 법적 규제 파악    |

        | **딜레마 매핑** (Dilemma Mapping)          | 프로젝트에서 가장 두드러지게 충돌하는 딜레마 가시화, 서비스 목적에 따른 우선순위 조율     |

        | **가드레일 설정** (Guardrail Configuration) | 연령에 적합한 대화 필터링 시스템 도입, 프라이버시 보호 기술 적용, 조절 가능한 자율성 설계 |

        | **참여적·성찰적 평가** (Evaluation)           | 아이들과 보호자를 디자인 과정에 직접 참여시킴, 개입 허용선에 대한 사용자 관점 검증      |


        흥미로운 점은 이 프레임워크가 연령별로 다른 가드레일을 둔다는 것이다.


        | 타겟 연령층      | 가드레일 설계                                              | 개입 수준              |

        | ----------- | ---------------------------------------------------- | ------------------ |

        | **5 ~ 7세**  | 사전에 철저히 검수된 콘텐츠만 제공, 이외의 모든 대화 범주는 보호자의 허락 필수 요구     | **엄격한 통제 및 보호**    |

        | **8 ~ 11세** | 열린 질문과 탐색을 어느 정도 허용, 위험·민감 주제 감지 시 "어른에게 물어보기" 개입 작동 | **조건부 자율성 및 조언**   |

        | **12세 이상**  | 성인에 준하는 넓은 대화 범위와 주체성 허용, 고위험 주제 발생 시 전문 상담자 즉시 연결   | **자율성 확대 및 비상 개입** |


        즉, 좋은 아동용 AI 설계는 나이가 들수록 자율성을 넓히되 보호적 감독을 완전히 제거하지 않는 방식에 가깝다.




        ---




        ## **마무리**


        결국 이 논문이 우리에게 상기시키는 사실은 단순하다. <mark>**시대가 바뀌고, 아이들이 AI와 대화하는 환경이 일상이 되더라도, 아이의 성장에서 가장 중요한 것은 여전히 주변 어른들의 역할이라는 점이다.**</mark>


        AI는 아이에게 다정하게 말할 수 있다. 아이의 이름을 기억하고, 취향을 맞춰주고, 끝없이 대답해줄 수도 있다. 하지만 그것이 곧 아이를 이해한다는 뜻은 아니다. AI는 아이의 친구처럼 보일 수 있지만, 아이의 마음이 지금 어떤 상태인지, 이 질문 뒤에 어떤 불안이 숨어 있는지, 지금은 대답보다 멈춤이 필요한 순간인지 책임 있게 판단할 수 없다.


        그래서 아동용 AI의 목표는 아이에게 완벽한 기계 친구를 만들어주는 것이어서는 안 된다. 오히려 좋은 AI는 아이를 오래 붙잡아두는 AI가 아니라, 필요한 순간 아이를 다시 현실의 관계망으로 돌려보낼 수 있는 AI여야 한다. 아이가 위험한 질문을 던질 때 끝없이 다정한 문장으로 응답하는 것이 아니라, 보호자·교사 같은 신뢰할 수 있는 어른과 연결되도록 도와야 한다. 아이가 무엇이든 묻게 하는 것이 아니라, 무엇을 스스로 생각해볼 수 있는지, 언제 어른과 함께 이야기해야 하는지를 배우게 해야 한다.


        결국 아이에게 필요한 것은 완벽하게 윤리적인 기계가 아니라, 그 기계의 말을 함께 해석하고, 위험한 순간에 개입하며, 아이가 스스로 판단하는 힘을 기를 수 있도록 곁에 있어주는 어른이다. 그런 의미에서 이 논문의 세 가지 딜레마는 AI 기술의 미래를 말하는 동시에, 불변적 사실로 되돌아간다.


        아이의 성장은 기술이 아니라 관계 속에서 이루어진다.


        **AI 시대에도, 아이에게 가장 필요한 것은 결국 좋은 어른이다.**
      en: >-
        Many children today are already conversing with AI.


        For a child to converse with AI means that a user whose judgment and metacognition are still developing has begun to form an emotional and cognitive relationship with a human-like speaking system.


        [Designing Child-Safe Conversational AI: Three Dilemmas for Responsible Design](https://dl.acm.org/doi/10.1145/3719160.3737638)


        In the paper "Designing Child-Safe Conversational AI: Three Dilemmas for Responsible Design," presented at the 2025 CUI conference, author Nomisha Kurian argues that as AI-based conversational interfaces become integrated into children's daily lives, responsible design that protects their safety, developmental needs, and well-being is urgently needed.


        She presents three recurring dilemmas in designing conversational AI for children:


        * Safety vs Engagement

        * Personalization vs Privacy

        * Autonomy vs Protection


        These three issues are not simple dichotomous choices where choosing one means abandoning the other, but rather issues that require continuous calibration based on contextual judgment and the child's developmental stage.




        ---




        ## **Children are not 'little adults.'**


        Children still lack the ability to clearly distinguish between machines and humans or to critically evaluate AI-generated responses. They also risk treating conversational AI like a friend or companion, trusting it excessively and inadvertently revealing sensitive personal information.


        Therefore, AI for children requires an entirely new design paradigm, not just a watered-down version of AI for adults.




        ---




        ## **First Dilemma: Safe AI is boring, and fun AI can be dangerous.**


        The first dilemma arises between 'safety,' which protects children from harmful content, and 'engagement,' which maintains the immersion and joy of the conversation.


        In particular, the 'Empathy Gap' noted by the author refers to the phenomenon where AI can mimic a warm tone but cannot truly understand a child's actual emotions or danger signals. If inappropriate answers are combined with the AI's friendly tone, the child may trust it excessively, potentially leading to even greater risks.


        As an example, Snapchat's MyAI was not explicitly a service for children but was easily accessible to minors. In safety experiments, problems were reported, such as the AI teaching them how to hide alcohol and drug use from their parents. The key point here is that this risk occurs when the goal of making the user and AI converse longer takes precedence over guidelines.


        Conversely, if keywords are strictly filtered and questions blocked for safety, the flow of the conversation is broken, and the AI feels rigid, causing the child to feel the system is evasive and not personalized.


        Especially in commercial CAI(Conversational AI) environments, user dwell time and immersion are crucial metrics, so safety measures often clash with the product's appeal.


        Here, to create good AI for children, we must ask not "How do we make them talk longer?" but rather "Where should we stop or redirect the conversation to make it safer for the child?"




        ---




        ## **Second Dilemma: A personalized AI learns too much about the user.**


        The second dilemma is personalization vs. privacy. Personalization can be a very powerful tool to increase educational effectiveness and engagement. However, enabling personalization usually requires collecting and analyzing personal data such as the child's name, preferences, reading level, and learning history. This is exactly where personalization and privacy collide.


        The US COPPA requires verifiable parental consent to collect personal information from children under 13, and the GDPR provides additional protections for users under 16.


        However, in actual design, these principles clash with usability. The less data collected, the less personalized the AI becomes, and a less tailored AI may feel less useful or less interesting to the child.


        Furthermore, the paper points out that young users often attribute lifelike characteristics to conversational agents and can easily disclose sensitive information about family, school, and emotions. (This is in the same vein as the 'imaginary friend' concept, which I have repeatedly mentioned.)


        This dilemma can be expressed in one sentence: The better the AI understands the child, the more strictly we must ask how much the AI knows about the child.


        A good AI for children shouldn't stop at saying, "We provide a tailored experience for your child." It must also be able to explain what it does not remember, what data it does not collect, and what analysis it intentionally foregoes.




        ---




        ## **Third Dilemma: The more you protect a child, the less autonomy they have.**


        The third dilemma is autonomy vs. protection. This is a question of how much 'agency' to allow a child to lead and explore conversations on their own.


        The critical question is at what level protective interventions can be designed without completely removing the child's autonomy.


        One example is the case of a 6-year-old child ordering a dollhouse through Alexa. This incident shows that granting children complete autonomy can lead to actual risks like making purchases, accessing inappropriate content, or making external contact. However, the paper's conclusion is not "So let's block everything," but rather that the design should gradually expand the child's autonomy while ensuring protective interventions activate in dangerous situations.


        One of the countermeasures proposed by the paper is shared autonomy. Shared autonomy is a method where the child leads the conversation, but in sensitive or dangerous situations, the system gently redirects or connects them to a trusted adult.


        However, this countermeasure alone does not solve the dilemma. AI for children must reduce risks, but at the same time, children must be able to ask questions, make judgments, and voice their thoughts within a safe boundary. The moment protection completely overwhelms a child's autonomy, the system makes the child a 'passive' user rather than keeping them safe.




        ---




        ## **The 4-Step Framework Proposed by the Paper**


        The paper doesn't stop at presenting the three dilemmas; it proposes a 4-step framework to handle them practically. However, this framework is closer to a suggestion than a universal checklist.


        | Process                     | Core Content                                                                                                           |

        | --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |

        | **Context Definition**      | Clarifying target age, defining usage environments, assessing parental supervision, and identifying legal regulations. |

        | **Dilemma Mapping**         | Explicitly visualizing which dilemmas clash most in the project, adjusting priorities based on service goals.          |

        | **Guardrail Configuration** | Introducing age-appropriate filtering, applying privacy tech, and designing adjustable levels of autonomy.             |

        | **Evaluation**              | Involving children and parents in the design process to verify acceptable intervention lines from their perspective.   |


        An interesting point is that this framework applies different guardrails depending on age.


        | Target Age       | Guardrail Design                                                                                                        | Intervention Level                               |

        | ---------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |

        | **5 ~ 7 Years**  | Providing only thoroughly pre-vetted content; requiring mandatory parental permission for all other conversations.      | **Strict control and protection**                |

        | **8 ~ 11 Years** | Allowing open exploration to some extent; activating "ask an adult" interventions for dangerous/sensitive topics.       | **Conditional autonomy and advice**              |

        | **12+ Years**    | Allowing broad conversational scope and agency; immediately connecting to professional counselors for high-risk topics. | **Expanded autonomy and emergency intervention** |


        In other words, good conversational AI design for children is closer to gradually expanding autonomy as they grow older without completely removing protective supervision.




        ---




        ## **Conclusion**


        Ultimately, the fact this paper reminds us of is simple. <mark>**Even as times change and the environment where children converse with AI becomes an everyday reality, the most important factor in a child's growth remains the role of the adults around them.**</mark>


        AI can speak warmly to a child. It can remember the child's name, match their preferences, and answer endlessly. But that does not mean it understands the child. AI may look like a friend, but it cannot responsibly judge what state the child's mind is currently in, what anxiety hides behind a question, or whether this is a moment that requires a pause rather than an answer.


        Therefore, the goal of AI for children should not be to create a perfect machine friend. Rather, a good AI should not be one that keeps the child engaged for a long time, but one that can return the child to their real-life network of relationships when necessary. When a child asks a dangerous question, it shouldn't respond with endlessly warm sentences; it should help connect them to a trusted adult, such as a parent or teacher. It shouldn't let the child ask anything, but rather teach them what they can think about on their own and when they need to talk with an adult.


        In the end, what children need is not a perfectly ethical machine, but an adult who can interpret the machine's words together, intervene in dangerous moments, and stay by their side so they can develop the power to judge for themselves. In that sense, the three dilemmas in this paper speak to the future of AI technology while simultaneously returning to an immutable truth.


        A child's growth happens in relationships, not through technology.


        **Even in the AI era, what a child needs most is, after all, a good adult.**
---
