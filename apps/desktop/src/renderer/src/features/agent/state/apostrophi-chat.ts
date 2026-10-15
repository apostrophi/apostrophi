import { Chat } from "@ai-sdk/react";
import type { AssistantMessage } from "@shared/assistant";
import { type ApostrophiUIMessage, toUIMessage } from "./apostrophi-messages";
import { apostrophiChatTransport } from "./chat-transport";

const sessions = new Map<string, Chat<ApostrophiUIMessage>>();

export function apostrophiChatSession(
  chatId: string,
  messages: ApostrophiUIMessage[] = [],
) {
  const existing = sessions.get(chatId);
  if (existing) return existing;
  const chat = new Chat<ApostrophiUIMessage>({
    id: chatId,
    transport: apostrophiChatTransport(),
    messages,
  });
  sessions.set(chatId, chat);
  return chat;
}

export function hydrateApostrophiChat(
  chatId: string,
  messages: AssistantMessage[],
) {
  const next = messages.map(toUIMessage);
  const existing = sessions.get(chatId);
  if (
    existing &&
    (existing.status === "submitted" || existing.status === "streaming")
  )
    return existing;
  if (existing) {
    existing.messages = next;
    return existing;
  }
  return apostrophiChatSession(chatId, next);
}
