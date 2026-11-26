/**
 * Runs `task` once for overlapping callers: concurrent calls share the in-flight promise.
 * The slot clears when the task settles, so a later call starts a fresh run.
 */
export function singleFlight<T>(task: () => Promise<T>): () => Promise<T> {
  let inFlight: Promise<T> | null = null;

  return () => {
    if (inFlight === null) {
      inFlight = task().finally(() => {
        inFlight = null;
      });
    }
    return inFlight;
  };
}
