import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser, validateUser } from "@/server/functions/auth.fn";

const Context = createContext();

export const UserProvider = ({ children }) => {
	const I_S = {
		user: null,
		isFeatching: true,
		error: false,
		islogin: false,
	};

	const [user, setUser] = useState(I_S);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const data = validateUser();
				setUser({
					user: data,
					isFeatching: false,
					error: false,
					islogin: true,
				});
			} catch (err) {
				setUser({
					user: null,
					isFeatching: false,
					error: err,
					islogin: false,
				});
			}
		};

		checkAuth();
	}, []);

	const logout = async () => {
		try {
			logoutUser();
		} catch (err) {
			console.error("Logout error:", err);
		} finally {
			setUser({
				user: null,
				isFeatching: false,
				error: false,
				islogin: false,
			});
		}
	};

	return (
		<Context.Provider
			value={{
				user: user.user,
				setUser,
				logout,
				isLoading: user.isFeatching,
				isAuthenticated: user.islogin,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(Context);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const setContext = () => useContext(Context);
