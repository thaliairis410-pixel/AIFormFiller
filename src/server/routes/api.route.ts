import { Router } from "express";
import ApiController from "../controllers/api.controller.js";

const router = Router();

router.post("/upload", ApiController.handleUpload);
router.post("/status", ApiController.getSubmissionStatus);

export default router;
