import Sequelize from "sequelize";

import db from "../../database/db";
import Review from "./Review.js";
import UserLikeReview from "./UserLikeReview";

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
	imagePath: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

User.hasMany(Review, {
	constraints: true,
	foreignKey: "userId",
	onDelete: "CASCADE",
	hooks: true,
});

Review.belongsTo(User, {
	foreignKey: "userId",
	as: "user",
});

User.beforeDestroy(async (user) => {
	await UserLikeReview.destroy({ where: { userId: user.id } });
});

export default User;
