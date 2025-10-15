import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { 
    getDonations, 
    getDonation, 
    createDonation, 
    createFlowDonation, 
    confirmFlowDonation,
    redirectFlowDonation
} from "../controllers/donation.controller";



const router = Router();

router.get("/", authMiddleware, getDonations);
router.get("/:flowOrder", getDonation);
router.post("/", createDonation);
router.post("/flow", createFlowDonation);
router.post("/confirm", confirmFlowDonation);
router.all('/redirect', redirectFlowDonation)

export default router;
