/**
 * test.js — throwaway script to test the external BD Courier service.
 *
 * Run with:  node test.js   (loads .env itself, no build step needed)
 *
 * What it does, per phone number:
 *   1. Looks the number up in MongoDB (CourierCheck) first.
 *      - Hit  → serves the stored result, NO external call (same caching as production).
 *      - Miss → calls the external BD Courier API with the single key below.
 *   2. On success: upserts the result into MongoDB (so real user searches
 *      are served from your DB later) and prints the payload as the "response".
 *   3. On failure: prints the error and moves to the next number.
 *
 * Delete this file before deploying — it is for testing only.
 */

import mongoose from "mongoose";
import { readFileSync } from "node:fs";

// ─────────────────────────────────────────────────────────────
// 1. CONFIGURATION (EDIT ME)
// ─────────────────────────────────────────────────────────────

// Your BD Courier API key (paste the real one here before running)
const API_KEY = "REPLACE_WITH_YOUR_BDCOURIER_KEY";

const PROVIDER_URL = "https://api.bdcourier.com/courier-check";
const REVIEWS_URL = "https://fraudshield.bd/customer-reviews";

// Optional enrichment, mirrors production (never fails the check).
// Set to false to skip the reviews call entirely.
const FETCH_REVIEWS = true;

const COURIER_TIMEOUT_MS = 30_000;
const REVIEWS_TIMEOUT_MS = 10_000;

// 50 Bangladeshi mobile numbers to test (format: 01[3-9] + 8 digits).
// Replace with your own list if you have specific numbers in mind.
const PHONES = [
	"01712345678", "01823456789", "01934567890", "01645678901",
	"01556789012", "01367890123", "01478901234", "01789012345",
	"01890123456", "01901234567", "01612345670", "01523456781",
	"01334567892", "01445678903", "01756789014", "01867890125",
	"01978901236", "01689012347", "01590123458", "01301234569",
	"01412345680", "01723456791", "01834567802", "01945678913",
	"01656789024", "01567890135", "01378901246", "01489012357",
	"01790123468", "01801234579", "01912345680", "01623456791",
	"01534567802", "01345678913", "01456789024", "01767890135",
	"01878901246", "01989012357", "01690123468", "01501234579",
	"01312345680", "01423456791", "01734567802", "01845678913",
	"01956789024", "01667890135", "01578901246", "01389012357",
	"01490123468", "01901234579",
];

// ─────────────────────────────────────────────────────────────
// 2. LOAD .env (so plain `node test.js` works — no --env-file flag)
// ─────────────────────────────────────────────────────────────

try {
	process.loadEnvFile(".env");
} catch {
	try {
		for (const line of readFileSync(".env", "utf8").split("\n")) {
			const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
			if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
		}
	} catch {
		console.error("❌ Could not load .env — MONGODB_URI is required.");
		process.exit(1);
	}
}

// ─────────────────────────────────────────────────────────────
// 3. CourierCheck model (same schema as src/server/models/courierData.model.ts)
// ─────────────────────────────────────────────────────────────

const CourierCheckSchema = new mongoose.Schema(
	{
		phone: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		// Raw payload returned by the courier provider (arbitrary JSON).
		data: { type: mongoose.Schema.Types.Mixed, default: {} },
		// Raw customer reviews returned by the reviews provider.
		reports: { type: [mongoose.Schema.Types.Mixed], default: [] },
	},
	{ timestamps: true },
);

const CourierCheck =
	mongoose.models?.CourierCheck ||
	mongoose.model("CourierCheck", CourierCheckSchema);

// ─────────────────────────────────────────────────────────────
// 4. HELPERS
// ─────────────────────────────────────────────────────────────

/** Call the external BD Courier API. Throws on any failure. */
async function checkCourier(phone) {
	const response = await fetch(PROVIDER_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ phone }),
		signal: AbortSignal.timeout(COURIER_TIMEOUT_MS),
	});

	const data = await response.json();

	// Same success check as production (src/server/functions/service.fn.ts)
	if (!response.ok || data?.status !== "success") {
		const error = new Error(
			`Provider rejected (HTTP ${response.status}) — ${
				data?.message || data?.error || JSON.stringify(data).slice(0, 200)
			}`,
		);
		throw error;
	}

	return data;
}

/** Best-effort customer reviews lookup — never throws, never breaks the check. */
async function checkReviews(phone) {
	try {
		const response = await fetch(
			`${REVIEWS_URL}/${encodeURIComponent(phone)}`,
			{ method: "GET", signal: AbortSignal.timeout(REVIEWS_TIMEOUT_MS) },
		);
		if (!response.ok) return [];
		const payload = await response.json();
		return Array.isArray(payload?.data) ? payload.data : [];
	} catch {
		return [];
	}
}

/** Upsert a successful result so future searches are served from your DB. */
async function storeResult(phone, data, reports) {
	await CourierCheck.updateOne(
		{ phone },
		{ $set: { data, reports } },
		{ upsert: true },
	);
}

// ─────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────

const startedAt = Date.now();
const stats = { servedFromDb: 0, fetchedFresh: 0, failed: 0, failures: [] };

await mongoose.connect(process.env.MONGODB_URI, { authSource: "admin" });
console.log("✅ MongoDB connected");

for (const phone of PHONES) {
	try {
		// 1) Serve from DB first — never call the external API if we have it.
		const existing = await CourierCheck.findOne({ phone }).lean();
		if (existing?.data && Object.keys(existing.data).length > 0) {
			stats.servedFromDb += 1;
			console.log(`[CACHE ] ${phone} → served from DB (no external call)`);
			continue;
		}

		// 2) Cache miss → hit the external service (+ reviews in parallel).
		const [data, reports] = await Promise.all([
			checkCourier(phone),
			FETCH_REVIEWS ? checkReviews(phone) : Promise.resolve([]),
		]);

		// 3) Persist for future user searches, then "respond" with the payload.
		await storeResult(phone, data, reports);
		stats.fetchedFresh += 1;
		console.log(`[FRESH ] ${phone} → stored in DB ✅`);
		console.log(JSON.stringify({ phone, data, reports }, null, 2));
	} catch (error) {
		stats.failed += 1;
		stats.failures.push({ phone, error: error.message });
		console.error(`[FAIL  ] ${phone} → ${error.message}`);
	}
}

await mongoose.disconnect();

// ─────────────────────────────────────────────────────────────
// 6. SUMMARY
// ─────────────────────────────────────────────────────────────

const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
console.log("\n──────────────────────────────");
console.log("Summary");
console.log("──────────────────────────────");
console.log(`Total numbers      : ${PHONES.length}`);
console.log(`Served from DB     : ${stats.servedFromDb}`);
console.log(`Fetched fresh       : ${stats.fetchedFresh}`);
console.log(`Failed              : ${stats.failed}`);
console.log(`Elapsed             : ${elapsed}s`);
if (stats.failures.length > 0) {
	console.log("\nFailures:");
	for (const { phone, error } of stats.failures) {
		console.log(`  - ${phone}: ${error}`);
	}
}

if (stats.failed === PHONES.length) {
	console.error("All checks failed — check the API key and network.");
	process.exit(1);
}
