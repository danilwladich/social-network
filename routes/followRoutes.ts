import { Router, Response } from "express";
import User from "../models/User";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
const router = Router();

// /follow/:nickname
router.post(
	"/:nickname",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const nickname = req.params.nickname;

			const user = await User.findOne({ nickname }).sort({ _id: 1 });
			if (!user) {
				return res.status(400).json({
					success: false,
					statusText: "User not found",
				});
			}
			const userID = user._id.toString();

			if (authID === userID) {
				return res.status(400).json({
					success: false,
					statusText: "User can't follow yourself",
				});
			}

			await user.updateOne({
				$addToSet: { followers: authID },
			});

			await User.findByIdAndUpdate(authID, {
				$addToSet: { following: userID },
			});

			res.status(201).json({
				success: true,
				statusText: "Follow user successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

router.delete(
	"/:nickname",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const nickname = req.params.nickname;

			const user = await User.findOne({ nickname }).sort({ _id: 1 });
			if (!user) {
				return res.status(400).json({
					success: false,
					statusText: "User not found",
				});
			}
			const userID = user._id.toString();

			if (authID === userID) {
				return res.status(400).json({
					success: false,
					statusText: "User can't unfollow yourself",
				});
			}

			await user.updateOne({
				$pull: { followers: authID },
			});

			await User.findByIdAndUpdate(authID, {
				$pull: { following: userID },
			});

			res.status(200).json({
				success: true,
				statusText: "Unfollow user successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
