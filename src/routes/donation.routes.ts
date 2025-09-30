import { Router } from "express";
import { getDonations, createDonation, createFlowDonation, confirmFlowDonation } from "../controllers/donation.controller";

const router = Router();

router.get("/", getDonations);
router.post("/", createDonation);
router.post("/flow", createFlowDonation);
router.post("/donations/confirm", confirmFlowDonation);

export default router;
