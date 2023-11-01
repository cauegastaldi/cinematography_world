import axios from "axios";

const baseUrl = "http://localhost:8000/users";
const uploadUrl = "http://localhost:8000/upload/uploadUserImage";

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
		.post(`${baseUrl}/registerAdmin`, data, { withCredentials: true })
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

const findAllUsers = async () => {
	const response = axios.get(`${baseUrl}`).then((response) => {
		return response.data;
	});

	return response;
};

const findMediaReviews = async (userId, mediaId) => {
	axios.get(`${baseUrl}/${userId}/reviews`).then((response) => {
		if (response) {
			const mediaReviews = response.filter((review) => {
				return review.mediaId === mediaId;
			});
			return mediaReviews;
		}
	});
};

const findUserById = async (id) => {
	const response = axios
		.get(`${baseUrl}/${id}`)
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

const findUserByName = async (name) => {
	const response = axios
		.get(`${baseUrl}/name/${name}`)
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

const updateUser = async (id, data) => {
	const response = await axios
		.put(`${baseUrl}/${id}`, data, { withCredentials: true })
		.catch((error) => {
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
	const response = await axios
		.delete(`${baseUrl}/${id}`, { withCredentials: true })
		.catch((error) => {
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

const uploadUserImage = async (formData) => {
	const response = axios
		.post(`${uploadUrl}`, formData, { withCredentials: true })
		.then((response) => {
			return `${response.data.payload.url}`;
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

export default {
	createNormalUser,
	createAdminUser,
	updateUser,
	removeUser,
	findAllUsers,
	findUserById,
	findUserByName,
	findMediaReviews,
	uploadUserImage,
};
