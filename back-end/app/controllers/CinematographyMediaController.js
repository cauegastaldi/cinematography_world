import { resolve } from "path";
import Media from "../modules/CinematographyMedia";
import fs from "fs";

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

	if (name != null) media.name = name;

	if (releaseYear != null) media.releaseYear = releaseYear;

	if (genre != null) media.genre = genre;

	if (director != null) media.director = director;

	if (posterPath != null) media.posterPath = posterPath;

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

export default { findAll, findMediaById, addMedia, updateMedia, deleteMedia };
