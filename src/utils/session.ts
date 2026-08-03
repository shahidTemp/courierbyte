// @ts-nocheck
import { useSession } from "@tanstack/react-start/server";
import { env } from "@/lib/env";

export function useAppSession() {
	return useSession({
		name: "app-session",
		password: env.JWT_SECRET, // কমপক্ষে ৩২ ক্যারেক্টার
		cookie: {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60, // ৭ দিন পর cookie নিজে থেকেই invalid হয়ে যাবে
		},
	});
}
