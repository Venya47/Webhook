import express from "express";
import { login ,register} from "../controllers/authController";
import { refresh } from "../controllers/refreshController";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.get("/profile", authenticate, (req: AuthRequest, res) => {
  res.json({
    message: "Protected data",
    user: req.user
  });
});
router.post("/register", register);


export default router;