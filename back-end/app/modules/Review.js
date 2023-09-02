import Sequelize from "sequelize";

import db from "../../database/db.js";
import UserLikeReview from "./UserLikeReview.js";

const Review = db.define("review", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	comment: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	mediaScore: {
		type: Sequelize.DOUBLE,
		allowNull: false,
	},
	publishDate: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	likes: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
});

Review.beforeDestroy(async (review) => {
	await UserLikeReview.destroy({ where: { reviewId: review.id } });
});

export default Review;
