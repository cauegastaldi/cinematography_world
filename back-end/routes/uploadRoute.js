import express from "express";
import uploadController from "../app/controllers/UploadController";

const router = express.Router();

router.post("/", uploadController);

export default router;
