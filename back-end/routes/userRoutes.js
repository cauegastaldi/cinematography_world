import express from "express";
import userController from "../app/controllers/UserController";
import { check, validationResult } from "express-validator";
import verifyToken from "../app/middlewares/verifyToken";

const errorsFormatter = ({ msg }) => {
	return `${msg}`;
};

const router = express.Router();

router.get("/", userController.findAll);

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

			const user = await userController.findUserById(req.params.id);

			if (user == null) {
				return res.status(400).json(null);
			}

			res.status(200).json(user);
		} catch (error) {
			res.status(400).json({
				errorCode: "ERRO_CAMPOS_INVALIDOS",
				errorData: error.mapped(),
			});
		}
	}
);

router.get(
	"/:userId/reviews",
	check("userId")
		.exists()
		.withMessage("userId não pode ser nulo!")
		.isInt()
		.withMessage("userId deve ser um número inteiro!")
		.custom((id) => id > 0)
		.withMessage("userId não pode ser negativo!"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();

			userController.findReviews(req.params.userId, res);
		} catch (error) {
			res.status(400).json({
				errorCode: "ERRO_CAMPOS_INVALIDOS",
				errorData: error.mapped(),
			});
		}
	}
);

router.get(
	"/name/:name",
	check("name")
		.exists()
		.withMessage("Nome não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Nome não pode ser vazio!"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();

			const user = await userController.findUserByUsername(req.params.name);

			if (user == null) {
				return res.status(400).json({
					errorCode: "ERRO_USUARIO_NAO_ENCONTRADO",
					errorData: "Usuário não encontrado! Por favor, informe um usuário existente.",
				});
			}

			res.status(200).json(user);
		} catch (error) {
			res.status(400).json({
				errorCode: "ERRO_CAMPOS_INVALIDOS",
				errorData: error.mapped(),
			});
		}
	}
);

router.post(
	"/registerAdmin",
	verifyToken,
	check("username")
		.exists()
		.withMessage("Usuário não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Usuário não pode ser vazio!"),
	check("password")
		.exists()
		.withMessage("Senha não pode ser nula!")
		.trim()
		.notEmpty()
		.withMessage("Senha não pode ser vazia!"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			req.body.userType = "ADMIN";
			userController.addUser(req, res);
		} catch (error) {
			res.status(400).json({
				errorCode: "ERRO_CAMPOS_INVALIDOS",
				errorData: error.mapped(),
			});
		}
	}
);

router.post(
	"/registerUser",
	check("username")
		.exists()
		.withMessage("Usuário não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Usuário não pode ser vazio!"),
	check("password")
		.exists()
		.withMessage("Senha não pode ser nula!")
		.trim()
		.notEmpty()
		.withMessage("Senha não pode ser vazia!"),

	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			req.body.userType = "NORMAL";
			userController.addUser(req, res);
		} catch (error) {
			res.status(400).json({
				errorCode: "ERRO_CAMPOS_INVALIDOS",
				errorData: error.mapped(),
			});
		}
	}
);

router.put(
	"/:id",
	verifyToken,
	check("username")
		.optional()
		.trim()
		.notEmpty()
		.withMessage("Nome de usuário não pode ser vazio!"),
	check("password").optional().trim().notEmpty().withMessage("Senha não pode ser vazia!"),

	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();

			userController.updateUser(req, res);
		} catch (error) {
			res.status(400).json({
				errorCode: "ERRO_CAMPOS_INVALIDOS",
				errorData: error.mapped(),
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
			userController.deleteUser(req, res);
		} catch (error) {
			res.status(400).json({
				errorCode: "ERRO_CAMPOS_INVALIDOS",
				errorData: error.mapped(),
			});
		}
	}
);

export default router;
