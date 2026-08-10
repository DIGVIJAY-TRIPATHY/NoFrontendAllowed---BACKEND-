import { Router } from 'express';
import {
    approveVideo,
    getPendingVideos,
    rejectVideo,
} from "../controllers/admin.controller.js"
import { verifyJWT, verifyHighCommand } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT, verifyHighCommand); // Apply verifyJWT and verifyHighCommand middleware to all routes in this file

router.route("/pending-videos").get(getPendingVideos);
router.route("/videos/:videoId/approve").patch(approveVideo);
router.route("/videos/:videoId/reject").delete(rejectVideo);

export default router