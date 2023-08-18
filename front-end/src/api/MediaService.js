import axios from "axios";

const baseUrl = "http://localhost:8000/medias";
const uploadUrl = "http://localhost:8000/upload";

const createMedia = async (data) => {
	const response = axios
		.post(`${baseUrl}`, data)
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

const uploadMediaPoster = async (formData) => {
	const response = axios
		.post(`${uploadUrl}`, formData)
		.then((response) => {
			return `http://localhost:8000${response.data.payload.url}`;
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

const findAllMedias = async (setData) => {
	axios.get(`${baseUrl}`).then((response) => {
		setData(response.data.users);
	});
};

const findOneMedia = async (id) => {
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

const updateMedia = async (id, data) => {
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

const removeMedia = async (id) => {
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

export default {
	createMedia,
	updateMedia,
	removeMedia,
	findAllMedias,
	findOneMedia,
	uploadMediaPoster,
};
