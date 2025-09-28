import { Router } from "express";
import { getDonations, createDonation } from "../controllers/donation.controller";

const router = Router();

router.get("/", getDonations);
router.post("/", createDonation);

export default router;
