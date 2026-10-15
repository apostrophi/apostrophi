export function stopAssistant(chatId: string | null, requestId: string | null) {
  if (!chatId || !requestId) return;
  void window.apostrophi.query("agent.stop", { chatId, requestId });
}
