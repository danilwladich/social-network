import { Router, Request, Response } from "express";
import User from "../models/User";
import { connectedSockets } from "../socket";
const router = Router();

// /users?page=:page&count=:count&lastUserNickname=:lastUserNickname&search=:search
router.get("", async (req: Request, res: Response) => {
	try {
		const page = parseInt((req.query.page as string) || "");
		const count = parseInt((req.query.count as string) || "");
		const lastUserNickname = req.query.lastUserNickname;
		const search = req.query.search;
		if (!page || !count || page < 1 || count > 100) {
			return res.status(400).json({
				success: false,
				statusText: "Invalid query parameters",
			});
		}

		const authNickname = req.cookies.nickname;
		const authUser = await User.findOne({ nickname: authNickname }, { _id: 1 });
		const authID = authUser?._id;

		// users filter with pagination
		let filter;
		if (!search) {
			if (!lastUserNickname) {
				filter = {
					_id: { $ne: authID },
				};
			} else {
				filter = {
					_id: {
						$ne: authID,
						$gt: (
							await User.findOne({ nickname: lastUserNickname }, { _id: 1 })
						)?._id,
					},
				};
			}
		} else {
			if (!lastUserNickname) {
				filter = {
					$and: [
						{ _id: { $ne: authID } },
						{
							$expr: {
								$regexMatch: {
									input: { $concat: ["$firstName", " ", "$lastName"] },
									regex: search,
									options: "i",
								},
							},
						},
					],
				};
			} else {
				filter = {
					$and: [
						{
							_id: {
								$ne: authID,
								$gt: (
									await User.findOne({ nickname: lastUserNickname }, { _id: 1 })
								)?._id,
							},
						},
						{
							$expr: {
								$regexMatch: {
									input: { $concat: ["$firstName", " ", "$lastName"] },
									regex: search,
									options: "i",
								},
							},
						},
					],
				};
			}
		}

		const users = await User.find(filter).sort({ _id: 1 }).limit(count);

		// mapping users
		const usersData = users.map((u) => {
			return {
				nickname: u.nickname,
				firstName: u.firstName,
				lastName: u.lastName,
				image: u.avatar,
				location: {
					country: u.location?.country,
					city: u.location?.city,
				},
				follower: u.following.some((id) => id === authID?.toString()),
				followed: u.followers.some((id) => id === authID?.toString()),
				online: u.nickname in connectedSockets,
			};
		});

		// total count filter
		let totalCountFilter;
		if (!search) {
			totalCountFilter = {
				_id: {
					$ne: authID,
				},
			};
		} else {
			totalCountFilter = {
				$and: [
					{ _id: { $ne: authID } },
					{
						$expr: {
							$regexMatch: {
								input: { $concat: ["$firstName", " ", "$lastName"] },
								regex: search,
								options: "i",
							},
						},
					},
				],
			};
		}

		const totalCount = await User.find(totalCountFilter).count();

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
