import { Types } from "mongoose";
import { CourierKey } from "@/server/models/courierKey.model";

type CachedKey = {
	id: string;
	value: string;
	limit: number;
	count: number;
	date: string;
	failures: number; // consecutive errors — 3 means the key is dead
};

type PoolKey = { id: string; value: string };

const MAX_FAILURES = 3;

let keys: CachedKey[] = [];
let index = 0;
let loaded = false;

const today = () => new Date().toISOString().slice(0, 10);

/** (Re)load active keys from the DB into memory. Call after any admin change. */
async function reload(): Promise<void> {
	const docs = await CourierKey.find({ status: "active" })
		.select("+keyValue")
		.sort({ createdAt: 1 })
		.lean();

	keys = docs.map((d) => ({
		id: String(d._id),
		value: d.keyValue,
		limit: d.dailyLimit,
		count: d.date === today() ? d.count : 0,
		date: d.date,
		failures: 0,
	}));
	index = 0;
	loaded = true;
}

/**
 * The next key with remaining quota. The pool rotates on its own counter —
 * the provider never tells us a key is exhausted, so we decide at 50/day.
 */
async function getKey(): Promise<PoolKey | null> {
	if (!loaded) await reload();
	return nextUsable();
}

/** Count one successful request — in memory now, persisted to the DB. */
async function recordUse(id: string): Promise<void> {
	const key = keys.find((k) => k.id === id);
	if (key) {
		key.count += 1;
		key.failures = 0; // a success breaks the failure streak
	}

	const date = today();
	const res = await CourierKey.updateOne(
		{ _id: new Types.ObjectId(id), date },
		{ $inc: { count: 1 } },
	);
	if (res.modifiedCount === 0) {
		// counter belongs to yesterday → start fresh
		await CourierKey.updateOne(
			{ _id: new Types.ObjectId(id) },
			{ $set: { count: 1, date } },
		);
	}
}

/** A request failed on this key — 3 consecutive errors and the key is deactivated. */
async function reportFailure(id: string): Promise<void> {
	const key = keys.find((k) => k.id === id);
	if (!key) return;

	key.failures += 1;
	if (key.failures < MAX_FAILURES) return;

	await CourierKey.updateOne(
		{ _id: new Types.ObjectId(id) },
		{ $set: { status: "inactive" } },
	);
	await reload();
}

// --- helpers ---

function nextUsable(): PoolKey | null {
	for (let i = 0; i < keys.length; i++) {
		const key = keys[(index + i) % keys.length];
		if (isUsable(key)) {
			index = (index + i) % keys.length;
			return { id: key.id, value: key.value };
		}
	}
	return null;
}

function isUsable(key: CachedKey): boolean {
	if (key.date !== today()) {
		key.count = 0; // new day → quota is back
		key.failures = 0; // and a fresh failure streak
		key.date = today();
	}
	return key.count < key.limit;
}

export { getKey, recordUse, reportFailure, reload };
