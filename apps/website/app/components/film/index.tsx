import styles from "./styles.module.css";

export function Film() {
  return (
    <section className={styles.film} aria-label="Apostrophi launch video">
      <video
        className={styles.video}
        src="/video/apostrophi.mp4"
        poster="/video/apostrophi-poster.jpg"
        width={1600}
        height={900}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </section>
  );
}
