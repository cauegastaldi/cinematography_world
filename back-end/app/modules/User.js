import Sequelize from "sequelize";

import db from "../../database/db";
import Review from "./Review.js";

const User = db.define("user", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	userType: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isIn: {
				args: [["ADMIN", "NORMAL"]],
				msg: "Tipo de usuário deve ser 'ADMIN' ou 'NORMAL'",
			},
		},
	},
});

User.hasMany(Review, {
	constraint: true,
	foreignKey: "userId",
});

Review.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	as: "user",
});

export default User;
