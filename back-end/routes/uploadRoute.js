import express from "express";
import uploadController from "../app/controllers/UploadController";
import verifyToken from "../app/middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, uploadController);

export default router;
