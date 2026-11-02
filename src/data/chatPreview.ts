import type { Language } from "../utils/i18n";

// Local UI only. Server controls grounding, credentials and spend limits.
export function getChatPreview(lang: Language) {
  const ko = lang === "ko";
  return {
    title: ko ? "이곳의 이야기를 들려드릴게요." : "Let me share the stories of this place.",
    promptLabel: ko ? "궁금한 점" : "Your question",
    placeholder: ko ? "글이나 작업에 관한 질문을 적어보세요" : "Ask a question about the writing or work",
    submit: ko ? "보내기" : "Send",
    keyboard: ko ? "Enter 보내기 · Shift+Enter 줄바꿈" : "Enter to send · Shift+Enter for a new line",
    you: ko ? "질문" : "Question",
    noticeLabel: ko ? "안내" : "Status",
    empty: ko ? "질문을 적어주세요." : "Write a question.",
    unavailable: ko ? "아직 실제 AI가 연결되지 않았습니다." : "The AI service is not connected yet.",
    pending: ko ? "답변을 요청하고 있습니다." : "Requesting a response.",
    cancel: ko ? "답변 요청 취소" : "Cancel response",
    cancelled: ko ? "요청을 중단했습니다." : "The request has been stopped.",
    failed: ko ? "응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요." : "The response service could not be reached. Please try again later.",
    provisional: ko ? "진행 중인 공개 노트" : "Public working note",
    limit: ko ? "현재 대화의 요청 한도에 도달했습니다." : "This conversation has reached its request limit.",
  };
}
