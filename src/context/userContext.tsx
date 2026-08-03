import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { logoutUser, validateUser } from "@/server/functions/auth.fn";

type User = {
	_id: string;
	name: string;
	number: string;
	role: "user" | "admin" | "super_admin";
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

type AuthContextValue = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: Error | null;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	// `undefined` = initial validation is still in progress
	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [error, setError] = useState<Error | null>(null);

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
