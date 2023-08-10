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
			await userController.findUserById(req, res);
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
			userController.addUser(user, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

export default router;
