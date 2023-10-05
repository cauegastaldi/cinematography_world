import { resolve } from "path";
import Media from "../modules/CinematographyMedia";
import fs from "fs";
import UserController from "./UserController";
import UsersFavoriteMedias from "../modules/UserFavoriteMedias";
import User from "../modules/User";

async function findAll(req, res) {
	let result = await Media.findAll();
	result = result.map((media) => {
		return media.dataValues;
	});
	res.status(200).json(result);
}

async function findMediaById(id) {
	return await Media.findByPk(id);
}

function addMedia(req, res) {
	if (req.userType != "ADMIN") {
		return res.status(401).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Somente usuários administradores podem adicionar mídias.`,
		});
	}

	Media.create({
		name: req.body.name,
		releaseYear: req.body.releaseYear,
		genre: req.body.genre,
		director: req.body.director,
		posterPath: req.body.posterPath,
		trailerUrl: req.body.trailerUrl.trim(),
	}).then((result) => res.status(200).json(result));
}

async function updateMedia(req, res) {
	if (req.userType != "ADMIN") {
		return res.status(401).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Somente usuários administradores podem editar mídias.`,
		});
	}

	const media = await Media.findByPk(req.params.id);

	if (media == null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_NAO_ENCONTRADA",
			errorData: `Mídia de id = ${req.params.id} não encontrada! Por favor, informe uma mídia existente.`,
		});
	}

	const name = req.body.name;
	const releaseYear = req.body.releaseYear;
	const genre = req.body.genre;
	const director = req.body.director;
	const posterPath = req.body.posterPath;
	const trailerUrl = req.body.trailerUrl?.trim();

	if (name != null) media.name = name;

	if (releaseYear != null) media.releaseYear = releaseYear;

	if (genre != null) media.genre = genre;

	if (director != null) media.director = director;

	if (posterPath != null) {
		// exclui a imagem antiga da pasta "/uploads"
		fs.unlink(resolve(__dirname, `../../public${media.posterPath}`), (err) => {
			if (err) {
				console.log(err);
			}
		});
		media.posterPath = posterPath;
	}

	media.trailerUrl = trailerUrl;

	await media.save();

	return res.status(200).send({ msg: `Mídia atualizada com sucesso!` });
}

async function deleteMedia(req, res) {
	if (req.userType != "ADMIN") {
		return res.status(401).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Somente usuários administradores podem remover mídias.`,
		});
	}

	const media = await Media.findByPk(req.params.id);

	if (media == null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_NAO_ENCONTRADA",
			errorData: `Mídia de id = ${req.params.id} não encontrada! Por favor, informe uma mídia existente.`,
		});
	}

	await media.destroy();
	fs.unlink(resolve(__dirname, `../../public${media.posterPath}`), (err) => {
		if (err) {
			console.log(err);
		}
	});

	return res.status(200).send({ msg: "Mídia deletada com sucesso!" });
}

async function favoriteMedia(req, res) {
	const mediaId = req.params.mediaId;
	const media = await findMediaById(mediaId);
	const userId = req.userId;
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

	const userFavoriteMedia = await UsersFavoriteMedias.findOne({
		where: {
			mediaId: mediaId,
			userId: user.id,
		},
	});

	if (userFavoriteMedia !== null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_JA_FAVORITADA",
			errorData: `Mídia já favoritada!`,
		});
	}

	/*await UsersFavoriteMedias.create({
		userId: userId,
		mediaId: mediaId,
	});*/

	await media.addUsersWhoLiked(user);

	return res.status(200).send({ msg: "Mídia favoritada com sucesso!" });
}

async function unfavoriteMedia(req, res) {
	const mediaId = req.params.mediaId;
	const media = await findMediaById(mediaId);
	const userId = req.userId;
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

	const userFavoriteMedia = await UsersFavoriteMedias.findOne({
		where: {
			mediaId: mediaId,
			userId: user.id,
		},
	});

	if (userFavoriteMedia === null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_NAO_FAVORITADA",
			errorData: `Usuário não favoritou a mídia especificada!`,
		});
	}

	await userFavoriteMedia.destroy();

	return res.status(200).send({ msg: "Mídia desfavoritada com sucesso!" });
}

async function findUsersFavoriteMedias() {
	let result = await Media.findAll({
		include: { model: User, as: "usersWhoLiked", attributes: ["id", "username"] },
	});

	result = result.map((favoriteMedia) => {
		return favoriteMedia.dataValues;
	});

	result = result.filter((favoriteMedia) => {
		return favoriteMedia.usersWhoLiked.length > 0;
	});

	return result;
}

export default {
	findAll,
	findMediaById,
	addMedia,
	updateMedia,
	deleteMedia,
	favoriteMedia,
	unfavoriteMedia,
	findUsersFavoriteMedias,
};
