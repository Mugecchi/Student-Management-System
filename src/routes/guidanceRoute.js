import express from "express";
import {
	addGuidanceRecord,
	addGuidanceSetting,
	deleteGuidanceRecord,
	deleteGuidanceSetting,
	getGuidanceRecords,
	getGuidanceSelection,
} from "../controllers/guidanceController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();
router.use(protectRoute, arcjetProtection);
router.post("/submit/:id", addGuidanceRecord);
router.post("/add", addGuidanceSetting);
router.delete("/delete", deleteGuidanceSetting);
router.delete("/deleteRecord", deleteGuidanceRecord);

router.get("/records", getGuidanceRecords);
router.get("/getSelection", getGuidanceSelection);

export default router;
