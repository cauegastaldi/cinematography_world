import Sequelize from "sequelize";

import db from "../../database/db.js";

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
		type: Sequelize.INTEGER,
		allowNull: false,
	},
});

export default Review;
