import Sequelize from "sequelize";

import db from "../../database/db.js";

const UserLikeReview = db.define("users_like_reviews", {
	userId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	reviewId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
});

export default UserLikeReview;
