async function checkCourier(phoneNumber: string) {
	const url = "https://api.bdcourier.com/courier-check";
	const apiKey = "YOUR_API_KEY";

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phone: phoneNumber,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			// If the API returned an error (e.g. 400, 401, 404)
			throw data;
		}

		return data;
	} catch (error) {
		console.error("Courier Check Error:", error);
		throw error;
	}
}

// --- How to use the function ---

async function handleRequest() {
	try {
		const info = await checkCourier("017xxxxxxxx");
		console.log(info);
	} catch (err) {
		console.log(err);
	}
}
