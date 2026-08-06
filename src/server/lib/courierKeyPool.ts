import { Types } from "mongoose";
import { CourierKey } from "@/server/models/courierKey.model";

type CachedKey = {
	id: string;
	value: string;
	limit: number;
	count: number;
	date: string;
};

type PoolKey = { id: string; value: string };

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
	}));
	index = 0;
	loaded = true;
}

/** Fast path: the current key if it still has quota, otherwise the next usable one. */
async function getKey(): Promise<PoolKey | null> {
	if (!loaded) await reload();
	return nextUsable();
}

/** The key that returned 429 is spent for today — persist it and return the next usable one. */
async function advance(failedId: string): Promise<PoolKey | null> {
	const failed = keys.find((k) => k.id === failedId);
	if (failed) {
		failed.count = failed.limit; // spent for today → skipped from now on
		await CourierKey.updateOne(
			{ _id: new Types.ObjectId(failedId) },
			{ $set: { count: failed.limit, date: today() } },
		);
	}

	return nextUsable();
}

/** Count one successful request — in memory now, persisted to the DB. */
async function recordUse(id: string): Promise<void> {
	const key = keys.find((k) => k.id === id);
	if (key) key.count += 1;

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

/** Mark a key inactive (401/403) and drop it from the pool. */
async function deactivate(id: string): Promise<void> {
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
		key.date = today();
	}
	return key.count < key.limit;
}

export { getKey, advance, recordUse, deactivate, reload };
