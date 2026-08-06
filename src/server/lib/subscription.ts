import { userSubscription } from "@/server/models/subscription.model";

export async function expireSubscriptions() {
	await userSubscription.updateMany(
		{ status: "active", end_date: { $lte: new Date() } },
		{ $set: { status: "expired" } },
	);
}
