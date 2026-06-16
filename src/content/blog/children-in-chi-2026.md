---
title: Children in CHI 2026
publishedAt: 2026-06-16
status: published
pinned: false
tag: Paper
thumbnail: /uploads/chi26.png
heroImage: /uploads/chi26.png
heroImageCaption: ACM CHI 2026
---
> Since I've recently revamped my website, I'd like to cover CHI 2026 papers as the first post in the 'paper' category.

[CHI '26: Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems](https://dl.acm.org/doi/proceedings/10.1145/3772318)

Looking broadly at CHI 2026, research dealing with children and AI has clearly emerged from various angles compared to the previous year. Generative AI, self-representation, creative collaboration, AI literacy, self-reporting, family and safety, accessibility research, etc...

Within these studies, a child is a learner, a creator, a family member, a platform user, and sometimes a vulnerable subject needing protection.

<mark>The important takeaway is that CHI 2026 does not treat children as a single, monolithic user group.</mark> However, if we narrow the criteria for this article to research on typically developing children under 13 in South Korea, the scope becomes much tighter.

| Criteria             | Description                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Target of Interest   | Typically developing children under 13                                                                 |
| Comparison Targets   | Adolescents, K-12, parents/family, special needs children, accessibility, safety, AI literacy research |
| Domestic Research    | 'Design' research conducted by institutions in South Korea                                             |
| Award-winning Papers | CHI 2026 Best Paper / Honorable Mention                                                                |



---



| Category                       | Paper                              | Judgment based on Criteria                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core Match                     | FutureMe / “I Can Be Anything!”    | A CHI 2026 full paper by researchers from a domestic institution. It deals with generative AI-based self-representation, future imagination, and career imagination for children aged 7–11. It is closest to the core interest of this post as it is not classified as research on special needs or clinical groups. |
| Outside Criteria but Important | When Scaffolding Breaks            | A study centered around KAIST on LLM writing support in South Korean middle school classrooms. CHI 2026 Best Paper. Important as domestic AI/education research, but the target is 8th-grade middle school students, so it is not a case centered on typically developing children under 13.                         |
| Excluded                       | Endless Swipes and Recommendations | CHI 2026 Honorable Mention. Research including authors from institutions like KAIST and Samsung, dealing with the impact of children's short-form video platform usage on context switching and working memory. Excluded as it is not design-related research.                                                       |
| Excluded                       | Stories Left Unsaid                | A study dealing with the issues of identity disclosure and stigma experienced by North Korean defector mothers raising children in South Korea. Excluded because it is neither a study on general children-AI interaction under 13 nor design-related research.                                                      |
| Excluded                       | Autiverse                          | AI journaling research for autistic youth involving NAVER AI Lab, SKKU, and NAVER Cloud. It deviates from the criteria of typically developing children.                                                                                                                                                             |
| Auxiliary Case                 | HabitTune                          | CHI 2026 Extended Abstracts. Deals with generative AI song-based habit formation for families of children aged 3–6. Kept only as an auxiliary case since it is not a full paper.                                                                                                                                     |

Below are the award-winning papers from the studies above.

*(*Note that* ｢*Endless Swipes and Recommendations*｣ *won an Honorable Mention, but is not included here as it significantly deviates from the criteria.)*

| Award      | Paper                                                                                           | Meaning within the Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Best Paper | KAIST DxD Lab's flow of AI research on children and youth: AACessTalk → When Scaffolding Breaks | A flow extending from AACessTalk at CHI 2025 to When Scaffolding Breaks at CHI 2026. AACessTalk was conducted jointly by institutions including Prof. Hwajung Hong's research team at KAIST and NAVER AI Lab, winning the CHI 2025 Best Paper. When Scaffolding Breaks is confirmed as a CHI 2026 Best Paper. These are strong achievements in domestic AI research for children and youth, but they differ from the criteria as they are situated in the contexts of special needs accessibility and secondary education, respectively. |

What is noteworthy here is the trajectory of AI research on children and adolescents centered around KAIST's DxD Lab. 

[DxD Lab](https://dxd-lab.github.io/)

At CHI 2025, Prof. Hwajung Hong's team at the DxD Lab won the Best Paper award for ｢*AACessTalk*｣. ｢*AACessTalk*｣ was an AI-mediated communication system designed to assist communication between minimally verbal autistic children and their parents. And at CHI 2026, ｢*When Scaffolding Breaks*｣, a collaborative study centered at KAIST with the participation of DxD Lab members, won the Best Paper award again. This study deployed an LLM-based writing support tool in South Korean middle school English classes for six weeks, examining both the benefits and side effects that AI scaffolds create for students.

These two studies differ in both target and context. ｢*AACessTalk*｣ deals with special needs children and parent-child communication, while ｢*When Scaffolding Breaks*｣ demonstrated that an LLM-based scaffold in a middle school classroom could cause dependency and decreased motivation in low-proficiency students.

However, their focus lies on accessibility for special needs children, parent-child communication, secondary education environments, and the side effects of learning support. My target is slightly further away from that. **There is still not much research where typically developing children under 13 appear as independent agents who imagine and interpret alongside AI.**



---



The paper closest to these criteria was ｢***FutureMe***｣. 

[FutureMe / “I Can Be Anything!”](https://dl.acm.org/doi/10.1145/3772318.3790985)

**｢*FutureMe*｣helps children aged 7–11 connect their current selves with future career possibilities through generative AI. This paper is a rare example where domestic researchers simultaneously addressed children under 13, generative AI, agency, and imagination.** 

However, this paper did not win an award.

According to the CHI 2026 Papers guidelines, an accepted paper must excel in originality, significance, validity, research quality, and presentation clarity. Therefore, from a CHI award perspective, it is possible that a larger-scale validation, long-term deployment, strong methodological contribution, or theoretical impact extending across the broader HCI field was relatively more expected.

The qualitative study involving 17 children in that research was sufficient to draw in-depth insights, but it might have been seen as lacking in scale by some reviewers who believe in the necessity of proving statistical significance or universality.

Another reason could be the lack of longitudinal tracking data on whether the children still felt connected to their future selves weeks or months after using ｢*FutureMe*｣, and whether it actually led to learning motivation.

Lastly, we cannot ignore the possibility that extremely strict ethical standards were applied to the ｢*FutureMe*｣ process, which involves taking input photos of children's actual faces and synthesizing them using AI.

Ultimately, this paper is the closest prior research to my own, but at the same time, it shows the benchmark I must surpass in the future.



---



#### Wrapping Up

How do children appear in domestic CHI 2026 research?

We see the child as a student receiving learning support, a user influenced by a platform, and a protected member within family relationships. However, the child who discovers how their own thoughts create changes within an AI system, interprets those changes, and translates them into the next action is not yet fully visible.

Looking at it differently, I might be lucky.

**CHI 2026 did not give a complete answer to my question, but it made my question more precise.** The empty space I am looking for is not an absence of research on children. It is a gap in how the imagination and agency of typically developing children under 13 can be addressed within domestic research. And that is probably the exact point I want to look deeper into within HCI.
