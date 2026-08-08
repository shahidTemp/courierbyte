/**
 * Maximum age of an in-flight quota reservation before cleanup removes it.
 * This is longer than the courier provider timeout to allow settlement work
 * to finish without keeping abandoned reservations forever.
 */
export const PENDING_RESERVATION_TTL_MS = 2 * 60 * 1000;
