import User from "../app/modules/User";
import db from "../database/db.js";

async function createAdmin() {
	await db.sync();

	await User.create({
		username: "caue",
		password: "$2a$08$ueScnF.VR.3KvCZJF2ZljOIKykb352amsPrVF1dlTiIx7jYMEMZyi",
		userType: "ADMIN",
	});
}

createAdmin();
