import { createServerFn } from "@tanstack/react-start";
import { User } from "@/server/models/user.model";
import { useAppSession } from "@/utils/session";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
	const users = await User.find()
		.select("name number isActive role createdAt updatedAt")
		.lean();

	return JSON.parse(JSON.stringify(users)); // Mongoose ObjectId কে JSON এ convert করার জন্য
});
