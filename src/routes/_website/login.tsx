// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SignIn from "@/components/auth/signin";
import SignUp from "@/components/auth/signup";

export const Route = createFileRoute("/_website/login")({
	component: Login,
});

function Login() {
	const [showSignUp, setShowSignUp] = useState(false);

	return showSignUp ? (
		<SignUp onLogin={() => setShowSignUp(false)} />
	) : (
		<SignIn onSignUp={() => setShowSignUp(true)} />
	);
}
