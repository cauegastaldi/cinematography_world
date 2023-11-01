import express from "express";
import { uploadPosterImage, uploadUserImage } from "../app/controllers/UploadController";
import verifyToken from "../app/middlewares/verifyToken";

const router = express.Router();

router.post("/uploadPoster", verifyToken, uploadPosterImage);
router.post("/uploadUserImage", uploadUserImage);

export default router;
