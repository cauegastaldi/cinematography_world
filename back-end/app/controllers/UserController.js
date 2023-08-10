import User from "../modules/User";
import bcryptjs from "bcryptjs";
import passwordUtils from "../utils/User/passwordUtils";

function findAll(req, res) {
	User.findAll().then((result) => res.json(result));
}

async function findUserById(id) {
	return await User.findByPk(id);
}

async function findUserByUsername(username) {
	return await User.findOne({
		where: {
			username: username,
		},
	});
}

async function addUser(req, res) {
	const username = req.body.username;
	const userType = req.body.userType;

	if (userType == "ADMIN" && req.userType != "ADMIN") {
		return res.status(401).json({
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

	User.create({
		username: username,
		password: password,
		userType: userType,
	}).then((result) => res.status(200).json(result));
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

	if (username != null) {
		const uniqueUsername = await usernameIsUnique(username);
		if (!uniqueUsername) {
			return res.status(400).json({
				errorCode: "ERRO_USERNAME_EXISTENTE",
				errorData:
					"O nome de usuário escolhido já existe! Por favor, informe um novo nome de usuário",
			});
		}
		user.username = username;
	}
	if (password != null) {
		user.password = await passwordUtils.hashPassword(req.body.password);
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

	if (req.userType != "ADMIN" && req.userId != user.id) {
		return res.status(401).json({
			errorCode: "ERRO_USUARIO_NAO_AUTORIZADO",
			errorData: `Somente usuários administradores ou o dono da conta podem remover esse usuário.`,
		});
	}

	await user.destroy();

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

export default { findAll, findUserById, findUserByUsername, addUser, updateUser, deleteUser };
