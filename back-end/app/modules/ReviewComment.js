import Sequelize from "sequelize";

import db from "../../database/db.js";
import User from "./User.js";
import Review from "./Review.js";

const ReviewComment = db.define("review_comment", {
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

User.hasMany(ReviewComment, {
	constraints: true,
	foreignKey: "userId",
	onDelete: "CASCADE",
	hooks: true,
});

ReviewComment.belongsTo(User, {
	foreignKey: "userId",
	as: "user",
});

Review.hasMany(ReviewComment, {
	constraints: true,
	foreignKey: "reviewId",
	onDelete: "CASCADE",
	hooks: true,
});

ReviewComment.belongsTo(Review, {
	foreignKey: "reviewId",
	as: "review",
});

export default ReviewComment;
