import express from "express";
import { urlencoded, json } from "body-parser";
import db from "./database/db";
import dotenv from "dotenv";
import cors from "cors";

import mediaRoutes from "./routes/mediaRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import userRoutes from "./routes/userRoutes";

const port = 8000;
const app = express();

async function start() {
	dotenv.config();

	await db.sync({ force: true });

	app.use(urlencoded({ extended: true }));
	app.use(json());
	app.use(cors());

	app.use("/medias", mediaRoutes);
	app.use("/reviews", reviewRoutes);
	app.use("/users", userRoutes);

	app.listen(port, function () {
		console.log(`servidor operando na porta ${port}`);
	});
}

start();
