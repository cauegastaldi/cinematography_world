import express from "express";
import mediaController from "../app/controllers/CinematographyMediaController";
import { check, validationResult } from "express-validator";
import verifyToken from "../app/middlewares/verifyToken";

const errorsFormatter = ({ msg }) => {
	return `${msg}`;
};

const router = express.Router();

router.get("/", mediaController.findAll);

router.get(
	"/:id",
	check("id")
		.exists()
		.withMessage("ID não pode ser nulo!")
		.isInt()
		.withMessage("ID deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("ID não pode ser negativo!"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();

			const media = await mediaController.findMediaById(req.params.id);

			if (media == null) {
				return res.status(400).json(null);
			}
			res.status(200).json(media);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

router.post(
	"/",
	verifyToken,
	check("name")
		.exists()
		.withMessage("Nome não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Nome não pode ser vazio!"),
	check("genre")
		.exists()
		.withMessage("Gênero não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Gênero não pode ser vazio!"),
	check("releaseYear")
		.exists()
		.withMessage("Ano de lançamento não pode ser nulo!")
		.isInt()
		.withMessage("Ano de lançamento deve ser um número inteiro!")
		.custom((releaseYear) => releaseYear > 0)
		.withMessage("Ano de lançamento não pode ser negativo!")
		.custom((releaseYear) => releaseYear.toString().length == 4)
		.withMessage("Ano de lançamento deve possuir 4 digitos"),
	check("director")
		.exists()
		.withMessage("Diretor não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Diretor não pode ser vazio!"),
	check("posterPath")
		.exists()
		.withMessage("Caminho do poster da mídia não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Caminho do poster da mídia não pode ser vazio!"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			mediaController.addMedia(req, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

router.put(
	"/:id",
	verifyToken,
	check("id")
		.exists()
		.withMessage("ID não pode ser nulo!")
		.isInt()
		.withMessage("ID deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("ID não pode ser negativo!"),
	check("name").optional().trim().notEmpty().withMessage("Nome não pode ser vazio!"),
	check("genre").optional().trim().notEmpty().withMessage("Gênero não pode ser vazio!"),
	check("releaseYear")
		.optional()
		.isInt()
		.withMessage("Ano de lançamento deve ser um número inteiro!")
		.custom((releaseYear) => releaseYear > 0)
		.withMessage("Ano de lançamento não pode ser negativo!")
		.custom((releaseYear) => releaseYear.toString().length == 4)
		.withMessage("Ano de lançamento deve possuir 4 digitos"),
	check("director").optional().trim().notEmpty().withMessage("Diretor não pode ser vazio!"),
	check("posterPath")
		.optional()
		.trim()
		.notEmpty()
		.withMessage("Caminho do poster da mídia não pode ser vazio!"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			mediaController.updateMedia(req, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

router.delete(
	"/:id",
	verifyToken,
	check("id")
		.exists()
		.withMessage("ID não pode ser nulo!")
		.isInt()
		.withMessage("ID deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("ID não pode ser negativo!"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			mediaController.deleteMedia(req, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

export default router;
