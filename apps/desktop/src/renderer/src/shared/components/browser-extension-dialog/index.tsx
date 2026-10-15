import { Button, Dialog } from "@apostrophi/ui";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import installPoster from "@/assets/extension-install.jpg";
import installVideo from "@/assets/extension-install.mp4";
import { errorCopy } from "@/shared/lib/error-copy";
import styles from "./styles.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function BrowserExtensionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function download(): Promise<void> {
    setStatus({ kind: "saving" });
    try {
      const result = await window.apostrophi.query("extension.install", {});
      setStatus(
        result.ok
          ? { kind: "saved" }
          : { kind: "error", message: result.error },
      );
    } catch (cause) {
      setStatus({
        kind: "error",
        message: errorCopy(
          cause,
          "Apostrophi couldn't save the extension. Try again.",
        ),
      });
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(next) => !next && setStatus({ kind: "idle" })}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup className={styles.popup}>
          <div className={styles.hero}>
            <div className={styles.window}>
              <video
                className={styles.video}
                src={installVideo}
                poster={installPoster}
                autoPlay={!reduceMotion}
                controls={reduceMotion ?? false}
                loop
                muted
                playsInline
                aria-label="Installing the Apostrophi extension from chrome://extensions"
              />
            </div>
          </div>
          <div className={styles.body}>
            <Dialog.Title className={styles.title}>
              Browser Extension
            </Dialog.Title>
            <Dialog.Description>
              Save pages and images from Chrome, Arc, Brave, or Edge into your
              library.
            </Dialog.Description>
            <ol className={styles.steps}>
              <li>
                Click Download to add an Apostrophi Extension folder to
                Downloads.
              </li>
              <li>
                Open <code>chrome://extensions</code> and turn on Developer
                mode.
              </li>
              <li>
                Click Load unpacked and choose the Apostrophi Extension folder.
              </li>
            </ol>
            {status.kind === "saved" ? (
              <p className={styles.status}>
                Apostrophi Extension is in your Downloads folder.
              </p>
            ) : null}
            {status.kind === "error" ? (
              <p className={styles.error}>{status.message}</p>
            ) : null}
            <div className={styles.actions}>
              <Button
                loading={status.kind === "saving"}
                onClick={() => void download()}
              >
                Download
              </Button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
