import type {
  AssistantActivity,
  AssistantChange,
  AssistantMessage,
  AssistantMetadata,
  AssistantQuestion,
  AssistantResultSet,
  AssistantSource,
  AssistantToolStep,
} from "@shared/assistant";
import type { UIMessage } from "ai";
import { z } from "zod";

export type ApostrophiDataParts = {
  "apostrophi-activity": { activity: AssistantActivity };
  "apostrophi-sources": AssistantSource[];
  "apostrophi-results": AssistantResultSet[];
  "apostrophi-steps": AssistantToolStep[];
  "apostrophi-question": AssistantQuestion;
  "apostrophi-review": { changes: AssistantChange[] };
};

export type ApostrophiUIMessage = UIMessage<
  AssistantMetadata | null,
  ApostrophiDataParts
>;

const textPart = z.object({ type: z.literal("text"), text: z.string() });

export function messageText(message: ApostrophiUIMessage) {
  return message.parts
    .flatMap((part) => {
      const parsed = textPart.safeParse(part);
      return parsed.success ? [parsed.data.text] : [];
    })
    .join("");
}

export function toUIMessage(message: AssistantMessage): ApostrophiUIMessage {
  const parts: ApostrophiUIMessage["parts"] = message.content
    ? [{ type: "text", text: message.content }]
    : [];
  if (message.metadata?.question)
    parts.push({
      type: "data-apostrophi-question",
      data: message.metadata.question,
    });
  if (message.metadata?.changes?.length)
    parts.push({
      type: "data-apostrophi-review",
      data: { changes: message.metadata.changes },
    });
  if (message.metadata?.sources?.length)
    parts.push({
      type: "data-apostrophi-sources",
      data: message.metadata.sources,
    });
  if (message.metadata?.results?.length)
    parts.push({
      type: "data-apostrophi-results",
      data: message.metadata.results,
    });
  if (message.metadata?.steps?.length)
    parts.push({ type: "data-apostrophi-steps", data: message.metadata.steps });
  return {
    id: message.id,
    role: message.role === "user" ? "user" : "assistant",
    parts,
    metadata: message.metadata,
  };
}

export function partData<Name extends keyof ApostrophiDataParts>(
  message: ApostrophiUIMessage,
  name: Name,
): ApostrophiDataParts[Name] | undefined {
  const type = `data-${name}`;
  const part = message.parts.findLast((part) => part.type === type);
  if (!part) return;
  const parsed = z.object({ data: z.unknown() }).safeParse(part);
  if (!parsed.success) return;
  /** SAFETY: UIMessage data parts are typed by ApostrophiDataParts. */
  return parsed.data.data as ApostrophiDataParts[Name];
}

export function fromUIMessage(
  message: ApostrophiUIMessage,
  chatId: string,
): AssistantMessage {
  const question = partData(message, "apostrophi-question");
  const review = partData(message, "apostrophi-review");
  const sources = partData(message, "apostrophi-sources");
  const results = partData(message, "apostrophi-results");
  const steps = partData(message, "apostrophi-steps");
  const metadata = {
    ...message.metadata,
    question: question ?? message.metadata?.question,
    changes: review?.changes ?? message.metadata?.changes,
    sources: sources ?? message.metadata?.sources,
    results: results ?? message.metadata?.results,
    steps: steps ?? message.metadata?.steps,
  };
  return {
    id: message.id,
    chatId,
    role: message.role === "user" ? "user" : "assistant",
    content: messageText(message),
    metadata:
      metadata.question ||
      metadata.changes ||
      metadata.sources ||
      metadata.results ||
      metadata.steps ||
      metadata.attachments
        ? metadata
        : (message.metadata ?? null),
  };
}
