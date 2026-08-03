// @ts-nocheck

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { logoutUser, validateUser } from "@/server/functions/auth.fn";

const initialAuthState = {
	user: null,
	isFetching: true,
	error: null,
	isAuthenticated: false,
};

const Context = createContext(undefined);

const toError = (error, fallbackMessage) =>
	error instanceof Error ? error : new Error(fallbackMessage);

export const UserProvider = ({ children }) => {
	const [authState, setAuthState] = useState(initialAuthState);
	const isMountedRef = useRef(false);
	const requestIdRef = useRef(0);

	const refreshUser = useCallback(async () => {
		const requestId = ++requestIdRef.current;

		try {
			const data = await validateUser();

			if (!isMountedRef.current || requestId !== requestIdRef.current) {
				return;
			}

			const user = data ?? null;
			setAuthState({
				user,
				isFetching: false,
				error: null,
				isAuthenticated: user !== null,
			});
		} catch (error) {
			if (!isMountedRef.current || requestId !== requestIdRef.current) {
				return;
			}

			setAuthState({
				user: null,
				isFetching: false,
				error: toError(error, "Authentication check failed"),
				isAuthenticated: false,
			});
		}
	}, []);

	useEffect(() => {
		isMountedRef.current = true;
		void refreshUser();

		return () => {
			isMountedRef.current = false;
			requestIdRef.current += 1;
		};
	}, [refreshUser]);

	const setAuthenticatedUser = useCallback((user) => {
		requestIdRef.current += 1;
		setAuthState({
			user,
			isFetching: false,
			error: null,
			isAuthenticated: user !== null,
		});
	}, []);

	const logout = useCallback(async () => {
		requestIdRef.current += 1;
		let logoutError = null;

		try {
			await logoutUser();
		} catch (error) {
			logoutError = toError(error, "Logout failed");
			console.error("Logout error:", logoutError);
		} finally {
			if (isMountedRef.current) {
				setAuthState({
					user: null,
					isFetching: false,
					error: logoutError,
					isAuthenticated: false,
				});
			}
		}
	}, []);

	return (
		<Context.Provider
			value={{
				user: authState.user,
				isLoading: authState.isFetching,
				isAuthenticated: authState.isAuthenticated,
				error: authState.error,
				logout,
				refreshUser,
				setAuthenticatedUser,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(Context);

	if (context === undefined) {
		throw new Error("useAuth must be used within a UserProvider");
	}

	return context;
};
