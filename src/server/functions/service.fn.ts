import {
	type CourierErrorCategory,
	extractProviderMessage,
	logCourierError,
} from "@/server/lib/courierErrorLog";
import { getKey, recordUse, reportFailure } from "@/server/lib/courierKeyPool";

const PROVIDER_URL = "https://api.bdcourier.com/courier-check";
// const REVIEWS_URL = "https://checkreviewsbd.com/customer-reviews";
const REVIEWS_URL = "https://fraudshield.bd/customer-reviews";

/** How long to wait for the optional reviews lookup before giving up. */
const REVIEWS_TIMEOUT_MS = 10_000;

function isSuccessPayload(data: unknown): boolean {
	return (
		typeof data === "object" &&
		data !== null &&
		"status" in data &&
		(data as { status?: unknown }).status === "success"
	);
}

/** Map a provider HTTP status to a failure category. */
function categorizeFailure(status: number): CourierErrorCategory {
	if (status === 401 || status === 403) return "AUTH_FAILED";
	if (status === 429) return "RATE_LIMITED";
	return "PROVIDER_REJECTED";
}

export async function checkCourier(phoneNumber: string) {
	const key = await getKey();
	if (!key) {
		await logCourierError({
			category: "KEYS_EXHAUSTED",
			message: "All courier API keys are exhausted or inactive today",
			phone: phoneNumber,
		});
		throw new Error("All courier API keys are exhausted or inactive today");
	}

	let response: Response;
	try {
		response = await fetch(PROVIDER_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key.value}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ phone: phoneNumber }),
		});
	} catch (error) {
		await reportFailure(key.id, {
			category: "NETWORK_ERROR",
			message: "Courier provider is unreachable",
			detail: error instanceof Error ? error.message : "Unknown network error",
			stack: error instanceof Error ? error.stack : undefined,
			phone: phoneNumber,
		});
		throw error;
	}

	let data: unknown;
	try {
		data = await response.json();
	} catch (error) {
		await reportFailure(key.id, {
			category: "INVALID_RESPONSE",
			httpStatus: response.status,
			message: "Courier provider returned an invalid response",
			detail:
				error instanceof Error ? error.message : "Response was not valid JSON",
			stack: error instanceof Error ? error.stack : undefined,
			phone: phoneNumber,
		});
		throw new Error("Courier provider returned an invalid response", {
			cause: error,
		});
	}

	if (!response.ok || !isSuccessPayload(data)) {
		const category = categorizeFailure(response.status);
		// 3 consecutive errors → this key gets deactivated
		await reportFailure(key.id, {
			category,
			httpStatus: response.status,
			message: "Courier provider rejected the request",
			providerMessage: extractProviderMessage(data),
			phone: phoneNumber,
		});
		throw new Error("Courier provider rejected the request");
	}

	await recordUse(key.id);

	return data;
}

/**
 * Best-effort lookup of customer reviews for a phone number.
 *
 * Unlike {@link checkCourier}, this call is optional: any failure (network
 * error, timeout, non-OK status, invalid payload) resolves to an empty array
 * so it can never break the main courier check flow.
 */
export async function checkReviews(phoneNumber: string): Promise<unknown[]> {
	try {
		const response = await fetch(
			`${REVIEWS_URL}/${encodeURIComponent(phoneNumber)}`,
			{
				method: "GET",
				signal: AbortSignal.timeout(REVIEWS_TIMEOUT_MS),
			},
		);
		if (!response.ok) return [];

		const payload: unknown = await response.json();
		const data = (payload as { data?: unknown })?.data;
		return Array.isArray(data) ? data : [];
	} catch {
		return [];
	}
}
