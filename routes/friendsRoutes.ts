import { Router, Request, Response } from "express";
import User from "../models/User";
const router = Router();

// /friends/:nickname?category=:category&page=:page&count=:count&lastUserID=:lastUserID
router.get("/:nickname", async (req: Request, res: Response) => {
	try {
		const nickname = req.params.nickname;
		const category = req.query.category;
		const page = req.query.page as number | undefined;
		const count = req.query.count as number | undefined;
		const lastUserID = req.query.lastUserID;
		if (
			!category ||
			(category !== "all"
				? category !== "followers"
					? category !== "following"
					: false
				: false) ||
			!page ||
			!count ||
			page < 1 ||
			count > 100
		) {
			return res.status(400).json({
				success: false,
				statusText: "Invalid query parameters",
			});
		}

		const user = await User.findOne({ nickname });
		if (!user) {
			return res.status(200).json({
				success: false,
				statusText: "User not found",
			});
		}

		const whoseFriends = {
			id: user.nickname,
			firstName: user.firstName,
			lastName: user.lastName,
			image: user.avatar,
		};

		const authNickname = req.cookies.nickname;
		const authUser = await User.findOne({ nickname: authNickname }, { _id: 1 });
		const authID = authUser?._id.toString();

		let totalCount: number;
		let users;

		if (category === "all") {
			const friends = user.following.filter((id) =>
				user.followers.includes(id)
			);

			const filter = !lastUserID
				? { _id: { $in: friends } }
				: { _id: { $in: friends, $gt: lastUserID } };

			users = await User.find(filter).sort({ _id: 1 }).limit(count);

			totalCount = await User.find({ _id: { $in: friends } }).count();
		} else if (category === "followers") {
			const followers = user.followers.filter(
				(id) => !user.following.includes(id)
			);

			const filter = !lastUserID
				? { _id: { $in: followers } }
				: { _id: { $in: followers, $gt: lastUserID } };

			users = await User.find(filter).sort({ _id: 1 }).limit(count);

			totalCount = await User.find({ _id: { $in: followers } }).count();
		} else {
			const following = user.following.filter(
				(id) => !user.followers.includes(id)
			);

			const filter = !lastUserID
				? { _id: { $in: following } }
				: { _id: { $in: following, $gt: lastUserID } };

			users = await User.find(filter).sort({ _id: 1 }).limit(count);

			totalCount = await User.find({ _id: { $in: following } }).count();
		}

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
				follower:
					!!authID && authNickname !== u.nickname
						? u.following.some((id) => id === authID)
						: undefined,
				followed:
					!!authID && authNickname !== u.nickname
						? u.followers.some((id) => id === authID)
						: undefined,
			};
		});

		res.status(200).json({
			success: true,
			statusText: "Friends sent successfully",
			whoseFriends,
			usersData,
			totalCount,
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

export default router;
