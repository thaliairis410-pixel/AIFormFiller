import { Router } from "express";
import ApiController from "../controllers/api.controller.js";

const router = Router();

router.post("/upload", ApiController.handleUpload);
router.post("/status", ApiController.getSubmissionStatus);
router.get("/status", ApiController.getSubmissionStatus);
router.get("/stats", ApiController.getStats);
router.get("/default-values", ApiController.getDefaultFormValues);

export default router;
