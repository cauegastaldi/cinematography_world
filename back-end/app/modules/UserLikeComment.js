import Sequelize from "sequelize";

import db from "../../database/db.js";

const UserLikeComment = db.define("users_like_comments", {
	userId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	reviewCommentId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
});

export default UserLikeComment;
