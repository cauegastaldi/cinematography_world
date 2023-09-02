import express from "express";
import reviewController from "../app/controllers/ReviewController";
import { check, validationResult } from "express-validator";
import verifyToken from "../app/middlewares/verifyToken";

const errorsFormatter = ({ msg }) => {
	return `${msg}`;
};

const router = express.Router();

router.get("/", reviewController.findAll);

router.get(
	"/likes/:reviewId",
	check("reviewId")
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
			reviewController.findUsersWhoLiked(req.params.reviewId, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

router.get(
	"/:mediaId",
	check("mediaId")
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
			reviewController.findReviewsByMediaId(req.params.mediaId, res);
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

router.post(
	"/like/:id",
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

			await reviewController.likeReview(req, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

router.post(
	"/unlike/:id",
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

			await reviewController.unlikeReview(req, res);
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
	check("comment").optional().trim().notEmpty().withMessage("Comentário não pode ser vazio!"),
	check("mediaScore")
		.optional()
		.trim()
		.notEmpty()
		.withMessage("Nota não pode ser vazia!")
		.isFloat({ min: 0, max: 5 })
		.withMessage("Nota deve ser um número entre 0 e 5!"),

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
