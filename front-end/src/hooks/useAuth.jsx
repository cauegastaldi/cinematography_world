import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import AuthService from "../api/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
	const [user, setUser] = useLocalStorage("user", userData);

	// call this function when you want to authenticate the user
	const login = async (data) => {
		setUser(data);
	};

	// call this function to sign out logged in user
	const logout = () => {
		setUser(null);
	};

	const isAuthed = async () => {
		const response = await AuthService.verifyIfUserIsLoggedIn();
		if (response.errors) {
			logout();
		}
	};

	const refreshData = async (data) => {
		setUser({ ...user, ...data });
	};

	useEffect(() => {
		isAuthed();
	}, []);

	const value = useMemo(
		() => ({
			user,
			login,
			logout,
			refreshData,
		}),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
