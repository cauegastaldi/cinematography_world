import fs from "fs";
import userController from "./UserController";
import jwt from "jsonwebtoken";
import passwordUtils from "../utils/User/passwordUtils";
import { resolve } from "path";

async function credentialsMatch(username, password) {
	const user = await userController.findUserByUsername(username);

	if (user == null) return false;

	return await passwordUtils.comparePasswords(password, user.password);
}

async function login(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	if (!(await credentialsMatch(username, password))) {
		return res.status(400).json({
			codigoErro: "ERRO_CREDENCIAIS_INVALIDAS",
			dadosErro: `Usuário ou senha incorretos!`,
		});
	}

	const user = await userController.findUserByUsername(username);

	const privateKey = fs.readFileSync(resolve(__dirname, "../keys_jwt/private.key"), "utf-8");

	const token = jwt.sign({ userId: user.id, username, userType: user.userType }, privateKey, {
		algorithm: "RS256",
	});

	res.status(200).json({ auth: true, token: token });
}

export default { login };
