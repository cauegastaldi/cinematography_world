import jwt from "jsonwebtoken";
import fs from "fs";
import { resolve } from "path";

export default function verifyToken(req, res, next) {
	const token = req.cookies?.token;

	if (!token) return res.status(401).json({ auth: false, msg: "Token não informado" });

	const publicKey = fs.readFileSync(resolve(__dirname, "../keys_jwt/public.key"), "utf-8");

	jwt.verify(token, publicKey, { algorithm: "RS256" }, function (err, decodificatedToken) {
		if (err) {
			return res.status(401).json({ auth: false, msg: "Token inválido" });
		}

		req.userId = decodificatedToken.userId;
		req.username = decodificatedToken.username;
		req.userType = decodificatedToken.userType;

		next();
	});
}
