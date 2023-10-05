import Sequelize from "sequelize";

import db from "../../database/db";
import Review from "./Review.js";
import User from "./User";
import UsersFavoriteMedias from "./UserFavoriteMedias";

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
	posterPath: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	trailerUrl: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

Media.hasMany(Review, {
	constraints: true,
	foreignKey: "mediaId",
	onDelete: "CASCADE",
	hooks: true,
});

Review.belongsTo(Media, {
	foreignKey: "mediaId",
	as: "media",
});

Media.beforeDestroy(async (media) => {
	await Review.destroy({ where: { mediaId: media.id } });
});

User.belongsToMany(Media, {
	through: UsersFavoriteMedias,
	as: "favoriteMedias",
	foreignKey: "userId",
});
Media.belongsToMany(User, {
	through: UsersFavoriteMedias,
	as: "usersWhoLiked",
	foreignKey: "mediaId",
});
User.hasMany(UsersFavoriteMedias, { foreignKey: "userId" });
UsersFavoriteMedias.belongsTo(User, { foreignKey: "userId" });
Media.hasMany(UsersFavoriteMedias, { foreignKey: "mediaId", as: "favoriteMedia" });
UsersFavoriteMedias.belongsTo(Media, { foreignKey: "mediaId", as: "favoriteMedia" });

export default Media;
