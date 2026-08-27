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

// ─────────────────────────────────────────────────────────────
// 1. CONFIGURATION (EDIT ME)
// ─────────────────────────────────────────────────────────────

// Your BD Courier API key (paste the real one here before running)
const API_KEY = "MkFzo6IozL1CMnuGKSQFu2Hk0jlAeRr2zy3q4l40GpwE4NIFueJhZSzvBMvP";

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
  "01646240868",
  "01581587833",
  "01711584987",
  "01779665842",
  "01949421241",
  "01836554365",
  "01722846917",
  "01755909298",
  "01860006999",
  "01402715439",
  "01712600406",
  "01767981016",
  "01755418385",
  "01533351833",
  "01712325227",
  "01711930935",
  "01780059189",
  "01715956276",
  "01870233657",
  "01712121684",
  "01727337099",
  "01618899329",
  "01915699700",
  "01917793714",
  "01959361475",
  "01816942779",
  "01813659865",
  "01557427955",
  "01627966723",
  "01706000684",
  "01628331233",
  "01714707686",
  "01709332399",
  "01713616474",
  "01616728697",
  "01617109582",
  "01820654719",
  "01737033559",
  "01868889108",
  "01754760234",
  "01711576835",
  "01848630178",
  "01719582350",
  "01711941863",
  "01714636084",
  "01976102649",
  "01711749242",
  "01749402786",
  "01723586873",
];



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

await mongoose.connect("mongodb://127.0.0.1:27017/courierByte", { authSource: "admin" });
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