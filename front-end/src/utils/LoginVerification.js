import AuthService from "../api/AuthService";

const verifyAndLogoutIfNecessary = async (authHook, setIsLoading, setIsUserAllowed) => {
	const user = authHook.user;
	if (user != null);
	{
		const response = await AuthService.verifyIfUserIsLoggedIn();

		if (response.errors) {
			authHook.logout();
			setIsUserAllowed(false);
		}
		setIsLoading(false);
	}
};

export default { verifyAndLogoutIfNecessary };
