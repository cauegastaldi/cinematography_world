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
	const response = await axios.get(`${baseUrl}/${mediaId}`);

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

const findReviewComments = async (reviewId, setReviewComments) => {
	const response = axios
		.get(`${baseUrl}/reviewComments/${reviewId}`)
		.then((response) => {
			setReviewComments(response.data);
		})
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

const likeReview = async (id) => {
	const response = await axios
		.post(`${baseUrl}/like/${id}`, null, { withCredentials: true })
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

const unlikeReview = async (id) => {
	const response = await axios
		.post(`${baseUrl}/unlike/${id}`, null, { withCredentials: true })
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

const findUsersWhoLikedReview = async (id) => {
	const response = await axios
		.get(`${baseUrl}/likes/${id}`)
		.then((response) => {
			return response.data;
		})
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

const commentReview = async (id, data) => {
	const response = await axios
		.post(`${baseUrl}/commentReview/${id}`, data, { withCredentials: true })
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

const updateReviewComment = async (id, data) => {
	const response = await axios
		.put(`${baseUrl}/reviewComment/${id}`, data, { withCredentials: true })
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

const removeReviewComment = async (id) => {
	const response = await axios
		.delete(`${baseUrl}/reviewComment/${id}`, { withCredentials: true })
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

const likeReviewComment = async (id) => {
	const response = await axios
		.post(`${baseUrl}/reviewComment/like/${id}`, null, { withCredentials: true })
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

const unlikeReviewComment = async (id) => {
	const response = await axios
		.post(`${baseUrl}/reviewComment/unlike/${id}`, null, { withCredentials: true })
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

const findUsersWhoLikedReviewComment = async (id) => {
	const response = await axios
		.get(`${baseUrl}/reviewComment/likes/${id}`)
		.then((response) => {
			return response.data;
		})
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
	likeReview,
	unlikeReview,
	findUsersWhoLikedReview,
	commentReview,
	removeReviewComment,
	updateReviewComment,
	findReviewComments,
	likeReviewComment,
	unlikeReviewComment,
	findUsersWhoLikedReviewComment,
};
