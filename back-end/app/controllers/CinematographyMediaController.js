import Media from "../modules/CinematographyMedia";

function findAll(req, res) {
	Media.findAll().then((result) => res.json(result));
}

async function findMediaById(req, res) {
	const media = await Media.findByPk(req.params.id);

	if (media == null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_NAO_ENCONTRADA",
			errorData: `Mídia de id = ${id} não encontrada! Por favor, informe uma mídia existente.`,
		});
	}

	res.status(200).json(media);
}

function addMedia(req, res) {
	Media.create({
		name: req.body.name,
		releaseYear: req.body.releaseYear,
		genre: req.body.genre,
		director: req.body.director,
	}).then((result) => res.status(200).json(result));
}

async function updateMedia(req, res) {
	await Media.update(
		{
			name: req.body.name,
			releaseYear: req.body.releaseYear,
			genre: req.body.genre,
			director: req.body.director,
		},
		{
			where: {
				id: req.params.id,
			},
		}
	);

	return res.status(200).send({ msg: `Mídia atualizada com sucesso!` });
}

async function deleteMedia(req, res) {
	const media = await Media.findByPk(req.params.id);

	if (media == null) {
		return res.status(400).json({
			errorCode: "ERRO_MIDIA_NAO_ENCONTRADA",
			errorData: `Mídia de id = ${id} não encontrada! Por favor, informe uma mídia existente.`,
		});
	}

	await media.destroy();

	return res.status(200).send({ msg: "Mídia deletada com sucesso!" });
}

export default { findAll, findMediaById, addMedia, updateMedia, deleteMedia };
