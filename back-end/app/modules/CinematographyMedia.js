import Sequelize from "sequelize";

import db from "../../database/db";
import Review from "./Review.js";

const Media = db.define("cinematography_media", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	releaseYear: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	genre: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	director: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

Media.hasMany(Review, {
	foreignKey: "mediaId",
});

Review.belongsTo(Media, {
	constraint: true,
	foreignKey: "mediaId",
	onDelete: "CASCADE",
	as: "media",
});

export default Media;
