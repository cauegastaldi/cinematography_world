import fs from "fs";
import Review from "../modules/Review";
import User from "../modules/User";
import passwordUtils from "../utils/User/passwordUtils";
import sequelize from "../../database/db";
import { resolve } from "path";

const DEFAULT_IMAGE_PATH = "/defaultImage/defaultUserImage.png";

async function findAll(req, res) {
	let result = await User.findAll();
	result = result.map((user) => {
		return {
			id: user.dataValues.id,
			username: user.dataValues.username,
			userType: user.dataValues.userType,
		};
	});
	res.status(200).json(result);
}

async function findUserById(id) {
	return await User.findByPk(id);
}

async function findUserByUsername(username) {
	return await User.findOne({
		where: sequelize.where(
			sequelize.fn("lower", sequelize.col("username")),
			sequelize.fn("lower", username)
		),
	});
}

async function addUser(req, res) {
	const username = req.body.username;
	const userType = req.body.userType;
	let imagePath = req.body.imagePath;

	if (userType == "ADMIN" && req.userType != "ADMIN") {
		return res.status(403).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Somente usuários administradores podem adicionar outros administradores.`,
		});
	}

	const uniqueUsername = await usernameIsUnique(username);
	if (!uniqueUsername) {
		return res.status(400).json({
			errorCode: "ERRO_USERNAME_EXISTENTE",
			errorData:
				"O nome de usuário escolhido já existe! Por favor, informe um novo nome de usuário",
		});
	}

	const password = await passwordUtils.hashPassword(req.body.password);

	if (imagePath == null) {
		imagePath = DEFAULT_IMAGE_PATH;
	}

	User.create({
		username: username,
		password: password,
		userType: userType,
		imagePath: imagePath,
	}).then((result) => res.status(200).json(result));
}

function findReviews(userId, res) {
	Review.findAll({ where: { userId: userId } }).then((response) => res.json(response));
}

async function updateUser(req, res) {
	const user = await User.findByPk(req.params.id);

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_ENCONTRADO",
			errorData: "Usuário não encontrado! Por favor, informe um usuário existente.",
		});
	}

	const username = req.body.username;
	let password = req.body.password;
	const imagePath = req.body.imagePath;

	if (username != null) {
		if (user.username !== username) {
			const uniqueUsername = await usernameIsUnique(username);
			if (!uniqueUsername) {
				return res.status(400).json({
					errorCode: "ERRO_USERNAME_EXISTENTE",
					errorData:
						"O nome de usuário escolhido já existe! Por favor, informe um novo nome de usuário",
				});
			}
		}
		user.username = username;
	}
	if (password != null) {
		user.password = await passwordUtils.hashPassword(req.body.password);
	}
	if (imagePath != null) {
		if (user.imagePath != DEFAULT_IMAGE_PATH) {
			// exclui a imagem antiga da pasta "/uploads"
			fs.unlink(resolve(__dirname, `../../public${user.imagePath}`), (err) => {
				if (err) {
					console.log(err);
				}
			});
		}
		user.imagePath = imagePath;
	} else {
		user.imagePath = DEFAULT_IMAGE_PATH;
	}

	await user.save();

	return res.status(200).send({ msg: `Usuário atualizado com sucesso!` });
}

async function deleteUser(req, res) {
	const user = await User.findByPk(req.params.id);

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_ENCONTRADO",
			errorData: `Usuário não encontrado! Por favor, informe um usuário existente.`,
		});
	}

	if (user.username === "caue") {
		return res.status(401).json({
			errorCode: "ERRO_NAO_PERMITIDO",
			errorData: `Não é possível excluir o administrador padrão do sistema.`,
		});
	}

	if (req.userType != "ADMIN" && req.userId != user.id) {
		return res.status(401).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Somente usuários administradores ou o dono da conta podem remover esse usuário.`,
		});
	}

	await user.destroy();

	if (user.imagePath != DEFAULT_IMAGE_PATH) {
		fs.unlink(resolve(__dirname, `../../public${user.imagePath}`), (err) => {
			if (err) {
				console.log(err);
			}
		});
	}

	return res.status(200).send({ msg: "Usuário deletado com sucesso!" });
}

async function usernameIsUnique(username) {
	const user = await User.findOne({
		where: {
			username: username,
		},
	});

	return user == null;
}

export default {
	findAll,
	findUserById,
	findReviews,
	findUserByUsername,
	addUser,
	updateUser,
	deleteUser,
};
