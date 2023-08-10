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
			await reviewController.findReviewById(req, res);
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
		.isInt()
		.withMessage("Nota deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("Nota não pode ser negativa!"),
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

export default router;
