import axios from "axios";

const baseUrl = "http://localhost:8000/users";

const createNormalUser = async (data) => {
	const response = axios
		.post(`${baseUrl}/registerUser`, data)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			if (error.response) {
				return { errors: error.response.data };
			} else if (error.request) {
				console.error(error.request);
			} else {
				console.error(error.message);
			}
		});
	return response;
};

const createAdminUser = async (data) => {
	const response = axios
		.post(`${baseUrl}/registerAdmin`, data)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			if (error.response) {
				return { errors: error.response.data };
			} else if (error.request) {
				console.error(error.request);
			} else {
				console.error(error.message);
			}
		});
	return response;
};

const findAllUsers = async (setData) => {
	axios.get(`${baseUrl}`).then((response) => {
		setData(response.data.users);
	});
};

const findOneUser = async (id) => {
	const response = axios
		.get(`${baseUrl}/${id}`)
		.then((response) => {
			return response.data.user;
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

const updateUser = async (id, data) => {
	const response = await axios.put(`${baseUrl}/${id}`, data).catch((error) => {
		if (error.response) {
			return { errors: error.response.data.errorData };
		} else if (error.request) {
			console.error(error.request);
			return {};
		} else {
			console.error(error.message);
			return {};
		}
	});
	return response;
};

const removeUser = async (id) => {
	const response = await axios.delete(`${baseUrl}/${id}`).catch((error) => {
		if (error.response) {
			return { error: error.response.data };
		} else if (error.request) {
			console.error(error.request);
			return {};
		} else {
			console.error(error.message);
			return {};
		}
	});

	return response;
};

export default { createNormalUser, createAdminUser, updateUser, removeUser };
