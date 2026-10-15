import { homedir } from "node:os";
import { join } from "node:path";

/** Chrome native-host connect path; keep in lockstep with `apostrophi-native-host.c`. */
export function nativeSocketPath(): string {
  if (process.env.APOSTROPHI_SANDBOX)
    return join(process.env.APOSTROPHI_SANDBOX, "native.sock");
  return join(
    homedir(),
    "Library/Application Support/Apostrophi",
    "native.sock",
  );
}
