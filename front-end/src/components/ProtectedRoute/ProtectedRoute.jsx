import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, isAdminRoute }) => {
	const { user } = useAuth();
	const [authed, setAuthed] = useState(user !== null);

	useEffect(() => {
		if (isAdminRoute) {
			setAuthed(user?.userType === "ADMIN");
		}
	}, []);

	return authed ? (
		children
	) : (
		<Navigate
			to="/"
			replace
		/>
	);
};

export default ProtectedRoute;
