import { getKey, recordUse, reportFailure } from "@/server/lib/courierKeyPool";

export async function checkCourier(phoneNumber: string) {
	const url = "https://api.bdcourier.com/courier-check";

	const key = await getKey();
	if (!key)
		throw new Error("All courier API keys are exhausted or inactive today");

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key.value}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ phone: phoneNumber }),
	});

	let data: unknown;
	try {
		data = await response.json();
	} catch {
		await reportFailure(key.id);
		throw new Error("Courier provider returned an invalid response");
	}

	if (
		!response.ok ||
		typeof data !== "object" ||
		data === null ||
		!("status" in data) ||
		data.status !== "success"
	) {
		await reportFailure(key.id); // 3 consecutive errors → this key gets deactivated
		throw new Error("Courier provider rejected the request");
	}

	await recordUse(key.id);
	console.log(data);

	return data;
}
