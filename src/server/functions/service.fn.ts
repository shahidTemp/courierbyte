import { getKey, recordUse, reportFailure } from "@/server/lib/courierKeyPool";

async function checkCourier(phoneNumber: string) {
	const url = "https://api.bdcourier.com/courier-check";

	const key = await getKey();
	if (!key) throw new Error("All courier API keys are exhausted or inactive today");

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key.value}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ phone: phoneNumber }),
	});

	const data = await response.json();

	if (data.status !== "success") {
		await reportFailure(key.id); // 3 consecutive errors → this key gets deactivated
		throw data;
	}

	await recordUse(key.id);
	return data;
}
