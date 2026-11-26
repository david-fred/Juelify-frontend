export type RefreshOutcome = 'ok' | 'unauthorized' | 'unavailable';

/**
 * 401 and 403 mean the refresh cookie or its CSRF token is no longer valid: the session is over.
 * No response (offline) or a 5xx is transient: keep the in-memory session and try again later.
 */
export function refreshOutcomeFromStatus(status: number | undefined): RefreshOutcome {
  return status === 401 || status === 403 ? 'unauthorized' : 'unavailable';
}
