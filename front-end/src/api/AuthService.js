import axios from "axios";

const baseUrl = "http://localhost:8000/auth/";

const login = async (username, password) => {
	const response = await axios
		.post(
			`${baseUrl}/login`,
			{ username: username, password: password },
			{ withCredentials: true, credentials: "include" }
		)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			if (error.response) {
				return { errors: error.response.data.errorData };
			} else if (error.request) {
				console.error(error.request);
			} else {
				console.error(error.message);
			}
		});

	return response;
};

const logout = async () => {
	const response = await axios
		.post(`${baseUrl}/logout`, undefined, { withCredentials: true })
		.then((response) => {
			return response.status;
		})
		.catch((error) => {
			if (error.response) {
				return { errors: error.response.data.msg };
			} else if (error.request) {
				console.error(error.request);
			} else {
				console.error(error.message);
			}
		});

	return response;
};

const verifyIfUserIsLoggedIn = async () => {
	const response = await axios
		.post(`${baseUrl}/loggedUser`, undefined, { withCredentials: true })
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			if (error.response) {
				return { errors: error.response.data.msg };
			} else if (error.request) {
				console.error(error.request);
			} else {
				console.error(error.message);
			}
		});

	return response;
};

export default { login, verifyIfUserIsLoggedIn, logout };
