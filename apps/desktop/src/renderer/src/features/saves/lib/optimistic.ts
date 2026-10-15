export async function optimistic<T>(
  optimisticUpdate: () => void,
  rollback: () => void,
  run: () => Promise<T>,
): Promise<T | null> {
  optimisticUpdate();
  try {
    return await run();
  } catch (err) {
    console.warn("[apostrophi pool] tx failed, rolling back", err);
    rollback();
    return null;
  }
}
