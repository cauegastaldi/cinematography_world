import User from "../modules/User";

function findAll(req, res) {
	User.findAll().then((result) => res.json(result));
}

async function findUserById(req, res) {
	const user = await User.findByPk(req.params.id);

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_ENCONTRADO",
			errorData: `Usuário de id = ${req.params.id} não encontrado! Por favor, informe um usuário existente.`,
		});
	}

	res.status(200).json(user);
}

function addUser(user, res) {
	User.create({
		username: user.username,
		password: user.password,
		userType: user.userType,
	}).then((result) => res.status(200).json(result));
}

async function updateUser(user, res) {
	await User.update(
		{
			username: user.username,
			password: user.password,
			userType: user.userType,
		},
		{
			where: {
				id: req.params.id,
			},
		}
	);

	return res.status(200).send({ msg: `Usuário atualizado com sucesso!` });
}

async function deleteUser(req, res) {
	const user = await User.findByPk(req.params.id);

	if (user == null) {
		return res.status(400).json({
			errorCode: "ERRO_USUARIO_NAO_ENCONTRADO",
			errorData: `Usuário de id = ${req.params.id} não encontrado! Por favor, informe um usuário existente.`,
		});
	}

	await user.destroy();

	return res.status(200).send({ msg: "Usuário deletado com sucesso!" });
}

export default { findAll, findUserById, addUser, updateUser, deleteUser };
