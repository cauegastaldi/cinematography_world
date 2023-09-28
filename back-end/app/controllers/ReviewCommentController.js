import ReviewComment from "../modules/ReviewComment";
import UserLikeComment from "../modules/UserLikeComment";
import UserController from "./UserController";
import ReviewController from "./ReviewController";

async function findCommentsOfReview(reviewId, res) {
	let result = await ReviewComment.findAll({
		where: {
			reviewId: reviewId,
		},
		include: "user",
	});
	result = result.map((reviewComment) => {
		return reviewComment.dataValues;
	});

	res.status(200).json(result);
}

async function likeReviewComment(req, res) {
	const reviewComment = await ReviewComment.findByPk(req.params.id);
	const user = await UserController.findUserById(req.userId);

	if (reviewComment == null) {
		return res.status(400).json({
			errorCode: "ERRO_COMENTARIO_NAO_ENCONTRADO",
			errorData: `Comentário de id = ${req.params.id} não encontrado! Por favor, informe um comentário existente.`,
		});
	}

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_EXISTENTE",
			errorData: `Usuário não existente! Por favor, informe um usuário existente.`,
		});
	}

	reviewComment.likes = reviewComment.likes + 1;

	await reviewComment.save();

	await UserLikeComment.create({
		userId: req.userId,
		reviewCommentId: reviewComment.id,
	});

	res.sendStatus(200);
}

async function unlikeReviewComment(req, res) {
	const reviewComment = await ReviewComment.findByPk(req.params.id);
	const user = await UserController.findUserById(req.userId);

	if (reviewComment == null) {
		return res.status(400).json({
			errorCode: "ERRO_COMENTARIO_NAO_ENCONTRADO",
			errorData: `Comentário de id = ${req.params.id} não encontrado! Por favor, informe um comentário existente.`,
		});
	}

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_EXISTENTE",
			errorData: `Usuário não existente! Por favor, informe um usuário existente.`,
		});
	}

	const userLikeComment = await UserLikeComment.findOne({
		where: {
			reviewCommentId: reviewComment.id,
			userId: user.id,
		},
	});

	if (userLikeComment === null) {
		return res.status(400).json({
			errorCode: "ERRO_CURTIDA_NAO_EXISTENTE",
			errorData: `Usuário não curtiu o comentário especificado!`,
		});
	}

	reviewComment.likes = reviewComment.likes - 1;

	await reviewComment.save();
	await userLikeComment.destroy();

	return res.sendStatus(200);
}

async function findUsersWhoLikedComment(reviewCommentId, res) {
	let result = await UserLikeComment.findAll({
		where: {
			reviewCommentId: reviewCommentId,
		},
	});
	result = result.map((userLikeComment) => {
		return userLikeComment.dataValues.userId;
	});

	res.status(200).json(result);
}

async function commentReview(req, res) {
	const userId = req.userId;
	const reviewId = req.params.id;
	const review = await ReviewController.findReviewById(reviewId);
	const user = await UserController.findUserById(userId);

	if (review == null && user == null) {
		return res.status(400).json({
			errorCode: "ERRO_ANALISE_E_USUARIO_NAO_EXISTENTES",
			errorData: `Análise e usuário não existentes! Por favor, informe uma análise e usuário existentes.`,
		});
	} else if (review == null && user != null) {
		return res.status(400).json({
			errorCode: "ERRO_ANALISE_NAO_EXISTENTE",
			errorData: `Análise não existente! Por favor, informe uma análise existente.`,
		});
	} else if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_EXISTENTE",
			errorData: `Usuário não existente! Por favor, informe um usuário existente.`,
		});
	}

	const publishDate = new Date().toLocaleDateString("pt-br");

	const reviewComment = await ReviewComment.create({
		comment: req.body.comment,
		publishDate: publishDate,
	});

	reviewComment.setReview(review);
	reviewComment.setUser(user);
	return res.status(200).json(reviewComment);
}

async function updateReviewComment(req, res) {
	const reviewComment = await ReviewComment.findByPk(req.params.id);

	if (reviewComment == null) {
		return res.status(400).json({
			errorCode: "ERRO_COMENTARIO_DE_ANALISE_NAO_ENCONTRADO",
			errorData: `Comentário de id = ${req.params.id} não encontrado! Por favor, informe um comentário existente.`,
		});
	}

	if (req.userId !== reviewComment.userId) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Este comentário pertence a outro usuário!`,
		});
	}

	const comment = req.body.comment;

	if (comment != null) reviewComment.comment = comment;

	await reviewComment.save();

	return res.status(200).send({ msg: `Comentário atualizado com sucesso!` });
}

async function deleteReviewComment(req, res) {
	const reviewComment = await ReviewComment.findByPk(req.params.id);

	if (reviewComment == null) {
		return res.status(400).json({
			errorCode: "ERRO_COMENTARIO_DE_ANALISE_NAO_ENCONTRADO",
			errorData: `Comentário de id = ${req.params.id} não encontrado! Por favor, informe um comentário existente.`,
		});
	}

	await reviewComment.destroy();

	UserLikeComment.destroy({
		where: {
			reviewCommentId: reviewComment.id,
		},
	});

	return res.status(200).send({ msg: "Comeentário deletado com sucesso!" });
}

export default {
	commentReview,
	updateReviewComment,
	deleteReviewComment,
	findCommentsOfReview,
	findUsersWhoLikedComment,
	likeReviewComment,
	unlikeReviewComment,
};
