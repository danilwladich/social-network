import { Router, Request, Response } from "express";
import User from "../models/User";
const router = Router();

// /users?page=:page&count=:count&lastUserID=:lastUserID
router.get("", async (req: Request, res: Response) => {
	try {
		const page = parseInt((req.query.page as string) || "");
		const count = parseInt((req.query.count as string) || "");
		const lastUserNickname = req.query.lastUserID;
		if (!page || !count || page < 1 || count > 100) {
			return res.status(400).json({
				success: false,
				statusText: "Invalid query parameters",
			});
		}

		const authNickname = req.cookies.nickname;
		const authUser = await User.findOne({ nickname: authNickname }, { _id: 1 });
		const authID = authUser?._id.toString();

		const filter = !lastUserNickname
			? { _id: { $ne: authID } }
			: {
					_id: {
						$ne: authID,
						$gt: (await User.findOne({ nickname: lastUserNickname }, { _id: 1 }))
							?._id,
					},
			  };
		const users = await User.find(filter).sort({ _id: 1 }).limit(count);

		const usersData = users.map((u) => {
			return {
				id: u.nickname,
				firstName: u.firstName,
				lastName: u.lastName,
				image: u.avatar,
				location: {
					country: u.location?.country,
					city: u.location?.city,
				},
				follower: u.following.some((id) => id === authID),
				followed: u.followers.some((id) => id === authID),
			};
		});

		const totalCount = await User.find({ _id: { $ne: authID } }).count();

		res.status(200).json({
			success: true,
			statusText: "Users sent successfully",
			usersData,
			totalCount,
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

export default router;
