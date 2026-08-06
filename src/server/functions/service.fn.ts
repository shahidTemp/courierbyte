import { advance, deactivate, getKey, recordUse } from "@/server/lib/courierKeyPool";

async function checkCourier(phoneNumber: string) {
	const url = "https://api.bdcourier.com/courier-check";

	let key = await getKey();

	while (key) {
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${key.value}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phone: phoneNumber,
				}),
			});

			const data = await response.json();

			if (response.status === 429) {
				// provider says this key is spent for today → rotate to the next one
				key = await advance(key.id);
				continue;
			}

			if (response.status === 401 || response.status === 403) {
				await deactivate(key.id); // key revoked → drop it
				key = await getKey();
				continue;
			}

			if (!response.ok) throw data;

			await recordUse(key.id); // count today's request
			return data;
		} catch (error) {
			console.error("Courier Check Error:", error);
			throw error;
		}
	}

	throw new Error("All courier API keys are exhausted or inactive today");
}
