import Review from "../modules/Review";
import CinematographyMediaController from "./CinematographyMediaController";
import UserController from "./UserController";

function findAll(req, res) {
	Review.findAll().then((result) => res.json(result));
}

async function findReviewById(id) {
	return await Review.findByPk(id);
}

async function addReview(req, res) {
	const mediaId = req.body.mediaId;
	const userId = req.body.userId;
	const media = await CinematographyMediaController.findMediaById(mediaId);
	const user = await UserController.findUserById(userId);

	if (media == null && user == null) {
		return res.status(400).json({
			codigoErro: "ERRO_MIDIA_E_USUARIO_NAO_EXISTENTES",
			dadosErro: `Mídia e usuário não existentes! Por favor, informe uma mídia e usuário existentes.`,
		});
	} else if (media == null && user != null) {
		return res.status(400).json({
			codigoErro: "ERRO_MIDIA_NAO_EXISTENTE",
			dadosErro: `Mídia não existente! Por favor, informe uma mídia existente.`,
		});
	} else if (user == null) {
		return res.status(400).json({
			codigoErro: "ERRO_USUARIO_NAO_EXISTENTE",
			dadosErro: `Usuário não existente! Por favor, informe um usuário existente.`,
		});
	}

	const review = await Review.create({
		comment: req.body.comment,
		mediaScore: req.body.mediaScore,
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

	if (req.userId != review.userId) {
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

export default { findAll, findReviewById, addReview, updateReview, deleteReview };
