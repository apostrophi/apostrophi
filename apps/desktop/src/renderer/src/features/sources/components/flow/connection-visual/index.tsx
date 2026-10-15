import { IconCheck, IconXmark } from "@apostrophi/icons";
import type { Source } from "@apostrophi/schema/db";
import { BrandTile } from "@/features/sources/components/sync-monitor-source-tile";
import apostrophiIcon from "@/generated/app-icon-previews/aqua.png";
import styles from "./styles.module.css";

export type ConnectionState = "idle" | "waiting" | "connected" | "failed";

interface ConnectionVisualProps {
  source: Source;
  state: ConnectionState;
}

const DOTS = [0, 1, 2, 3, 4, 5, 6] as const;

export function ConnectionVisual({ source, state }: ConnectionVisualProps) {
  const ended = state === "connected" || state === "failed";
  return (
    <div className={styles.visual} data-state={state} aria-hidden="true">
      <span className={styles.step} data-side="apostrophi">
        <span className={styles.icon}>
          <img src={apostrophiIcon} alt="" />
        </span>
      </span>
      <span className={styles.dots}>
        {DOTS.map((index) => (
          <span
            key={index}
            className={styles.dot}
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}
      </span>
      <span className={styles.step} data-side="source">
        <svg className={styles.spinner} viewBox="0 0 56 56" aria-hidden="true">
          <rect x="1" y="1" width="54" height="54" rx="15" pathLength="100" />
        </svg>
        <span className={styles.icon}>
          <BrandTile source={source} size={40} />
        </span>
      </span>
      {ended ? (
        <span
          className={styles.result}
          data-glow-origin={state === "connected" || undefined}
        >
          {state === "connected" ? (
            <IconCheck strokeWidth={2.5} />
          ) : (
            <IconXmark strokeWidth={2.5} />
          )}
        </span>
      ) : null}
    </div>
  );
}
