import express from "express";
import userController from "../app/controllers/UserController";
import { check, validationResult } from "express-validator";

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
				return res.status(400).json({
					errorCode: "ERRO_USUARIO_NAO_ENCONTRADO",
					errorData: "Usuário não encontrado! Por favor, informe um usuário existente.",
				});
			}

			res.status(200).json(user);
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
	check("userType")
		.exists()
		.withMessage("Tipo de usuário não pode ser nulo!")
		.trim()
		.notEmpty()
		.withMessage("Tipo de usuário não pode ser vazia!")
		.isIn(["ADMIN", "NORMAL"])
		.withMessage("Tipo de usuário precisa ser 'ADMIN' ou 'NORMAL'"),
	async (req, res) => {
		const result = validationResult(req).formatWith(errorsFormatter);
		try {
			result.throw();
			const username = req.body.username;
			const password = req.body.password;
			const userType = req.body.userType;
			const user = { username: username, password: password, userType: userType };
			userController.addUser(req, res);
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
			userController.deleteUser(req, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

export default router;
