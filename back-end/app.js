import express from "express";
import { urlencoded, json } from "body-parser";
import db from "./database/db";
import dotenv from "dotenv";
import cors from "cors";
import cookies from "cookie-parser";

import mediaRoutes from "./routes/mediaRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import userRoutes from "./routes/userRoutes";
import uploadRoute from "./routes/uploadRoute";
import authenticationRoutes from "./routes/authenticationRoutes";

const port = 8000;
const app = express();

async function start() {
	dotenv.config();

	await db.sync();

	app.use(urlencoded({ extended: true }));
	app.use(json());
	const corsOptions = {
		origin: "http://localhost:3000",
		credentials: true,
		optionSuccessStatus: 200,
	};
	app.use(cors(corsOptions));
	app.use(cookies());

	app.use("/medias", mediaRoutes);
	app.use("/reviews", reviewRoutes);
	app.use("/users", userRoutes);
	app.use("/auth", authenticationRoutes);
	app.use("/upload", uploadRoute);

	app.use(express.static("public"));

	app.listen(port, function () {
		console.log(`servidor operando na porta ${port}`);
	});
}

start();
