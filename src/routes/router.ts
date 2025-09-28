import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import authRouter from "./auth.routes";
import donationRouter from "./donation.routes";
import userRouter from "./user.routes";


const router = Router();


router.use("/auth", authRouter);
router.use("/users", authMiddleware, userRouter); // 🔒 protegido
router.use("/donations", donationRouter); // público


export default router;
