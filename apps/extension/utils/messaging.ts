import type { Source } from "@apostrophi/schema/db";
import { defineExtensionMessaging } from "@webext-core/messaging";
import type { ProbeResult } from "./probe";
import type {
  ApostrophiCapturePayload,
  ApostrophiLogEntry,
  PushSessionResult,
} from "./types";

interface ApostrophiProtocol {
  capture(payload: ApostrophiCapturePayload): boolean;
  pushSession(source: Source): PushSessionResult;
  openApostrophi(path: string | undefined): boolean;
  log(entry: ApostrophiLogEntry): void;
  probe(): ProbeResult;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ApostrophiProtocol>();
