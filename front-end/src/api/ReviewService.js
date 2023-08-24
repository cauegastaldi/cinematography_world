import axios from "axios";

const baseUrl = "http://localhost:8000/reviews";

const createReview = async (data) => {
	const response = axios
		.post(`${baseUrl}`, data, { withCredentials: true })
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

const findAllMediaReviews = async (mediaId, setReviews) => {
	axios.get(`${baseUrl}/${mediaId}`).then((response) => {
		setReviews(response.data);
	});
};

const findReviewById = async (id, setReview) => {
	const response = axios
		.get(`${baseUrl}/${id}`)
		.then((response) => {
			setReview(response.data);
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

const updateReview = async (id, data) => {
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

const removeReview = async (id) => {
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

export default {
	createReview,
	updateReview,
	removeReview,
	findAllMediaReviews,
	findReviewById,
};
