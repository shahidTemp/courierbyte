import type { CourierErrorCategory } from "@/server/lib/courierErrorCategories";
import { CourierErrorLog } from "@/server/models/courierErrorLog.model";

export type { CourierErrorCategory };

type SanitizedText = string | null | undefined;

const PHONE_IN_TEXT = /\b01[3-9]\d{8}\b/g;

/** Mask any 11-digit mobile numbers found inside free-form text (PII). */
const maskPhoneInText = (text: SanitizedText): SanitizedText =>
	typeof text === "string"
		? text.replace(PHONE_IN_TEXT, (match) => maskPhone(match))
		: text;

export type CourierErrorDetails = {
	category: CourierErrorCategory;
	/** The message checkCourier surfaced (shown to the end user). */
	message: string;
	/** Underlying cause: fetch failure, JSON parse error, … */
	detail?: string;
	/** The provider's own error text from its response body. */
	providerMessage?: string | null;
	httpStatus?: number | null;
	phone?: string;
	stack?: string;
	keyId?: string | null;
	keyDeactivated?: boolean;
};

/** Mask a phone number before logging (PII): 01712345678 → 017****5678 */
export const maskPhone = (phone: string): string => {
	const digits = phone.replace(/\D/g, "");
	if (digits.length < 7) return "••••••";
	return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
};

const MESSAGE_KEYS = [
	"message",
	"error",
	"error_message",
	"detail",
	"msg",
	"reason",
] as const;

/** Best-effort extraction of the provider's own error message from the body. */
export function extractProviderMessage(data: unknown): string | null {
	if (typeof data === "string") return data.slice(0, 200);
	if (typeof data !== "object" || data === null) return null;

	const record = data as Record<string, unknown>;
	for (const key of MESSAGE_KEYS) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) {
			return value.slice(0, 200);
		}
	}

	try {
		return JSON.stringify(data).slice(0, 200);
	} catch {
		return null;
	}
}

/**
 * Persist a courier provider failure for audit & debugging. Never throws —
 * logging must not take the fraud check down with it.
 */
export async function logCourierError(
	details: CourierErrorDetails,
): Promise<void> {
	try {
		await CourierErrorLog.create({
			keyId: details.keyId ?? null,
			category: details.category,
			httpStatus: details.httpStatus ?? null,
			message: details.message,
			// Provider text may echo the customer's number — mask it too.
			providerMessage: maskPhoneInText(details.providerMessage) ?? null,
			detail: maskPhoneInText(details.detail) ?? null,
			phone: details.phone ? maskPhone(details.phone) : null,
			stack: details.stack ?? null,
			keyDeactivated: details.keyDeactivated ?? false,
		});
	} catch (error) {
		console.error("Courier error log could not be persisted:", error);
	}
}
