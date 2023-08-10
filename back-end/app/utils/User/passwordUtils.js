import bcryptjs from "bcryptjs";

async function hashPassword(password) {
	const numSaltRounds = 8;

	return await bcryptjs.hash(password, numSaltRounds);
}

async function comparePasswords(typedPassword, hashedPassword) {
	return await bcryptjs.compare(typedPassword, hashedPassword);
}

export default { hashPassword, comparePasswords };
