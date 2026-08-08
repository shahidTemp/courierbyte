/**
 * In-memory TTL cache for courier check results.
 *
 * The app runs as a single pm2 fork instance, so a process-local Map is a
 * consistent (and free) tier in front of the persisted `CourierCheck`
 * collection. A miss falls back to Mongo, and fresh results are written to
 * both tiers. Entries expire after a bounded TTL — the Mongo copy remains the
 * durable source for older results.
 */

type CachedCheck = {
	data: Record<string, unknown>;
	reports: unknown[];
};

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ENTRIES = 10_000;

// Map preserves insertion order, so the first key is always the oldest entry.
const cache = new Map<string, CachedCheck & { expiresAt: number }>();

export function getCachedCheck(phone: string): CachedCheck | null {
	const entry = cache.get(phone);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		cache.delete(phone);
		return null;
	}
	// Sliding expiry: every hit extends the entry's life.
	entry.expiresAt = Date.now() + TTL_MS;
	return { data: entry.data, reports: entry.reports };
}

export function setCachedCheck(
	phone: string,
	data: Record<string, unknown>,
	reports: unknown[],
): void {
	// Empty payloads are never cached (they mean "no data" downstream).
	if (!data || Object.keys(data).length === 0) return;

	if (cache.size >= MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest !== undefined) cache.delete(oldest);
	}

	cache.set(phone, { data, reports, expiresAt: Date.now() + TTL_MS });
}
