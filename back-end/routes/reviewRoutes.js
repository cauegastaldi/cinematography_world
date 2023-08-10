import express from "express";
import reviewController from "../app/controllers/ReviewController";
import { check, validationResult } from "express-validator";

const errorsFormatter = ({ msg }) => {
	return `${msg}`;
};

const router = express.Router();

router.get("/", reviewController.findAll);

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

			const review = await reviewController.findReviewById(req.params.id);

			if (review == null) {
				return res.status(400).json({
					errorCode: "ERRO_ANALISE_NAO_ENCONTRADA",
					errorData: `Análise não encontrada! Por favor, informe uma análise existente.`,
				});
			}

			res.status(200).json(review);
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
	check("comment")
		.exists()
		.withMessage("Comentário não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Comentário não pode ser vazio!"),
	check("mediaScore")
		.exists()
		.withMessage("Nota não pode ser nula!")
		.trim()
		.notEmpty()
		.withMessage("Nota não pode ser vazia!")
		.isFloat({ min: 0, max: 5 })
		.withMessage("Nota deve ser um número entre 0 e 5!"),
	check("mediaId")
		.exists()
		.withMessage("Id da mídia não pode ser nulo!")
		.isInt()
		.withMessage("Id da mídia deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("Id da mídia não pode ser negativo!"),
	check("userId")
		.exists()
		.withMessage("Id do usuário não pode ser nulo!")
		.isInt()
		.withMessage("Id do usuário deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("Id do usuário não pode ser negativo!"),

	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			reviewController.addReview(req, res);
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
	check("comment").optional().trim().notEmpty().withMessage("Comentário não pode ser vazio!"),
	check("mediaScore")
		.optional()
		.isInt()
		.withMessage("Nota deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("Nota não pode ser negativa!"),

	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			reviewController.updateReview(req, res);
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
			reviewController.deleteReview(req, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

export default router;
