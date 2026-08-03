// @ts-nocheck

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { logoutUser, validateUser } from "@/server/functions/auth.fn";

const AuthContext = createContext(undefined);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(undefined);
	const [error, setError] = useState(null);

	const refreshUser = useCallback(async () => {
		try {
			const data = await validateUser();
			setUser(data ?? null);
			setError(null);
		} catch (err) {
			setUser(null);
			setError(
				err instanceof Error ? err : new Error("Authentication check failed"),
			);
		}
	}, []);

	useEffect(() => {
		void refreshUser();
	}, [refreshUser]);

	const logout = useCallback(async () => {
		try {
			await logoutUser();
		} catch (err) {
			console.error("Logout error:", err);
		} finally {
			setUser(null);
			setError(null);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user: user ?? null,
				isLoading: user === undefined,
				isAuthenticated: user != null,
				error,
				logout,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within a UserProvider");
	}

	return context;
};
