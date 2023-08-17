import express from "express";
import loginController from "../app/controllers/LoginController";
import { check, validationResult } from "express-validator";
import verifyToken from "../app/middlewares/verifyToken";

const errorsFormatter = ({ msg }) => {
	return `${msg}`;
};

const router = express.Router();

router.post(
	"/login",
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
			await loginController.login(req, res);
		} catch (error) {
			res.status(400).json({
				codigoErro: "ERRO_CAMPOS_INVALIDOS",
				dadosErro: error.mapped(),
			});
		}
	}
);

router.post("/logout", (req, res) => {
	res.clearCookie("token");
	res.status(200).send();
});

router.post("/loggedUser", verifyToken, (req, res) => {
	res.cookie("loggedUser", {
		username: req.username,
		userId: req.userId,
		userType: req.userType,
	});
	res.status(200).send();
});

export default router;
