import { createFileRoute } from "@tanstack/react-router";
import SignIn from "@/components/auth/signin";

export const Route = createFileRoute("/_website/login")({
	component: Login,
});

function Login() {
	return <SignIn />;
}
