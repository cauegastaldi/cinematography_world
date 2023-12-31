import Review from "../modules/Review";
import UserLikeReview from "../modules/UserLikeReview";
import CinematographyMediaController from "./CinematographyMediaController";
import UserController from "./UserController";

async function findAll(req, res) {
	let result = await Review.findAll();
	result = result.map((review) => {
		return review.dataValues;
	});

	res.status(200).json(result);
}

async function findReviewById(id) {
	return await Review.findByPk(id);
}

async function findReviewsByMediaId(mediaId, res) {
	let result = await Review.findAll({
		where: {
			mediaId: mediaId,
		},
	});
	result = result.map((review) => {
		return review.dataValues;
	});

	res.status(200).json(result);
}

async function addReview(req, res) {
	const mediaId = req.body.mediaId;
	const userId = req.userId;
	const media = await CinematographyMediaController.findMediaById(mediaId);
	const user = await UserController.findUserById(userId);

	if (media == null && user == null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_E_USUARIO_NAO_EXISTENTES",
			errorData: `Mídia e usuário não existentes! Por favor, informe uma mídia e usuário existentes.`,
		});
	} else if (media == null && user != null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_NAO_EXISTENTE",
			errorData: `Mídia não existente! Por favor, informe uma mídia existente.`,
		});
	} else if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_EXISTENTE",
			errorData: `Usuário não existente! Por favor, informe um usuário existente.`,
		});
	}

	const publishDate = new Date().toLocaleDateString("pt-br");

	const review = await Review.create({
		comment: req.body.comment,
		mediaScore: req.body.mediaScore,
		publishDate: publishDate,
	});
	review.setMedia(media);
	review.setUser(user);
	return res.status(200).json(review);
}

async function updateReview(req, res) {
	const review = await Review.findByPk(req.params.id);

	if (review == null) {
		return res.status(400).json({
			errorCode: "ERRO_ANALISE_NAO_ENCONTRADA",
			errorData: `Análise de id = ${req.params.id} não encontrada! Por favor, informe uma análise existente.`,
		});
	}

	if (req.userId !== review.userId) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Esta análise pertence a outro usuário!`,
		});
	}

	const comment = req.body.comment;
	const mediaScore = req.body.mediaScore;

	if (comment != null) review.comment = comment;
	if (mediaScore != null) review.mediaScore = mediaScore;

	await review.save();

	return res.status(200).send({ msg: `Análise atualizada com sucesso!` });
}

async function deleteReview(req, res) {
	const review = await Review.findByPk(req.params.id);

	if (review == null) {
		return res.status(400).json({
			errorCode: "ERRO_ANALISE_NAO_ENCONTRADA",
			errorData: `Análise de id = ${req.params.id} não encontrada! Por favor, informe uma análise existente.`,
		});
	}

	await review.destroy();

	return res.status(200).send({ msg: "Análise deletada com sucesso!" });
}

async function likeReview(req, res) {
	const review = await Review.findByPk(req.params.id);
	const user = await UserController.findUserById(req.userId);

	if (review == null) {
		return res.status(400).json({
			errorCode: "ERRO_ANALISE_NAO_ENCONTRADA",
			errorData: `Análise de id = ${req.params.id} não encontrada! Por favor, informe uma análise existente.`,
		});
	}

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_EXISTENTE",
			errorData: `Usuário não existente! Por favor, informe um usuário existente.`,
		});
	}

	review.likes = review.likes + 1;

	await review.save();

	await UserLikeReview.create({
		userId: req.userId,
		reviewId: review.id,
	});

	res.sendStatus(200);
}

async function unlikeReview(req, res) {
	const review = await Review.findByPk(req.params.id);
	const user = await UserController.findUserById(req.userId);

	if (review == null) {
		return res.status(400).json({
			errorCode: "ERRO_ANALISE_NAO_ENCONTRADA",
			errorData: `Análise de id = ${req.params.id} não encontrada! Por favor, informe uma análise existente.`,
		});
	}

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_EXISTENTE",
			errorData: `Usuário não existente! Por favor, informe um usuário existente.`,
		});
	}

	const userLikeReview = await UserLikeReview.findOne({
		where: {
			reviewId: review.id,
			userId: user.id,
		},
	});

	if (userLikeReview === null) {
		return res.status(400).json({
			errorCode: "ERRO_CURTIDA_NAO_EXISTENTE",
			errorData: `Usuário não curtiu a análise especificada!`,
		});
	}

	review.likes = review.likes - 1;

	await review.save();
	await userLikeReview.destroy();

	return res.sendStatus(200);
}

async function findUsersWhoLiked(reviewId, res) {
	let result = await UserLikeReview.findAll({
		where: {
			reviewId: reviewId,
		},
	});
	result = result.map((userLikeReview) => {
		return userLikeReview.dataValues.userId;
	});

	res.status(200).json(result);
}

export default {
	findAll,
	findReviewById,
	findReviewsByMediaId,
	addReview,
	updateReview,
	deleteReview,
	likeReview,
	unlikeReview,
	findUsersWhoLiked,
};
