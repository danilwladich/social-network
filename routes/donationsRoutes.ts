import { Router, Request, Response } from "express";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
import Donater from "../models/Donater";
import User from "../models/User";
const router = Router();

// /api/donations
router.get("/", async (req: Request, res: Response) => {
	try {
		const donations = await Donater.find().sort({ value: -1 }).limit(3);

		const donationsData = await Promise.all(
			donations.map(async (d) => {
				const user = await User.findById(d.owner);

				return {
					id: user?.nickname,
					firstName: user?.firstName,
					lastName: user?.lastName,
					image: user?.avatar,
					value: d.value,
				};
			})
		);

		res.status(200).json({
			success: true,
			statusText: "Donations send successful",
			donationsData,
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

router.post(
	"/",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;

			const user = await User.findById(authID);
			if (!user) {
				return res.status(200).json({
					success: false,
					statusText: "Auth error",
				});
			}

			const { value } = req.body;

			const donaterAlreadyExist = await Donater.findOne({ owner: authID });
			if (!!donaterAlreadyExist) {
				donaterAlreadyExist.value += value;
				donaterAlreadyExist.save();

				return res.status(201).json({
					success: true,
					statusText: "Donation save successful",
				});
			}

			const donater = new Donater({
				owner: authID,
				value,
			});
			await donater.save();

			res.status(201).json({
				success: true,
				statusText: "Donation save successful",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
