import { Router } from "express";
import { 
    getDonations, 
    getDonation, 
    createDonation, 
    createFlowDonation, 
    confirmFlowDonation 
} from "../controllers/donation.controller";



const router = Router();

router.get("/", getDonations);
router.get("/:flowOrder", getDonation);
router.post("/", createDonation);
router.post("/flow", createFlowDonation);
router.post("/confirm", confirmFlowDonation);

export default router;
