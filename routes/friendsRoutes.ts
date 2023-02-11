import { Router, Request, Response } from "express";
import User from "../models/User";
import { connectedSockets } from "../socket";
const router = Router();

// /friends/:nickname?category=:category&page=:page&count=:count&lastUserNickname=:lastUserNickname&search=:search
router.get("/:nickname", async (req: Request, res: Response) => {
	try {
		const nickname = req.params.nickname;
		const category = req.query.category;
		const page = req.query.page as number | undefined;
		const count = req.query.count as number | undefined;
		const lastUserNickname = req.query.lastUserNickname;
		const search = req.query.search;
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
			nickname: user.nickname,
			firstName: user.firstName,
			lastName: user.lastName,
			image: user.avatar,
		};

		const authNickname = req.cookies.nickname;
		const authUser = await User.findOne({ nickname: authNickname }, { _id: 1 });
		const authID = authUser?._id.toString();

		let totalCount: number;
		let users;
		let filter;
		let totalCountFilter;

		// set users and total count based on category
		if (category === "all") {
			const friends = user.following.filter((id) =>
				user.followers.includes(id)
			);

			// users filter with pagination
			if (!search) {
				if (!lastUserNickname) {
					filter = {
						_id: { $in: friends },
					};
				} else {
					filter = {
						_id: {
							$in: friends,
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
							{ _id: { $in: friends } },
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
									$in: friends,
									$gt: (
										await User.findOne(
											{ nickname: lastUserNickname },
											{ _id: 1 }
										)
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

			users = await User.find(filter).sort({ _id: 1 }).limit(count);

			// total count filter
			if (!search) {
				totalCountFilter = {
					_id: {
						$in: friends,
					},
				};
			} else {
				totalCountFilter = {
					$and: [
						{ _id: { $in: friends } },
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

			totalCount = await User.find(totalCountFilter).count();
		} else if (category === "followers") {
			const followers = user.followers.filter(
				(id) => !user.following.includes(id)
			);

			// users filter with pagination
			if (!search) {
				if (!lastUserNickname) {
					filter = {
						_id: { $in: followers },
					};
				} else {
					filter = {
						_id: {
							$in: followers,
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
							{ _id: { $in: followers } },
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
									$in: followers,
									$gt: (
										await User.findOne(
											{ nickname: lastUserNickname },
											{ _id: 1 }
										)
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

			users = await User.find(filter).sort({ _id: 1 }).limit(count);

			// total count filter
			if (!search) {
				totalCountFilter = {
					_id: {
						$in: followers,
					},
				};
			} else {
				totalCountFilter = {
					$and: [
						{ _id: { $in: followers } },
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

			totalCount = await User.find(totalCountFilter).count();
		} else {
			const following = user.following.filter(
				(id) => !user.followers.includes(id)
			);

			// users filter with pagination
			if (!search) {
				if (!lastUserNickname) {
					filter = {
						_id: { $in: following },
					};
				} else {
					filter = {
						_id: {
							$in: following,
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
							{ _id: { $in: following } },
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
									$in: following,
									$gt: (
										await User.findOne(
											{ nickname: lastUserNickname },
											{ _id: 1 }
										)
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

			users = await User.find(filter).sort({ _id: 1 }).limit(count);

			// total count filter
			if (!search) {
				totalCountFilter = {
					_id: {
						$in: following,
					},
				};
			} else {
				totalCountFilter = {
					$and: [
						{ _id: { $in: following } },
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

			totalCount = await User.find(totalCountFilter).count();
		}

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
				follower:
					!!authID && authNickname !== u.nickname
						? u.following.some((id) => id === authID)
						: undefined,
				followed:
					!!authID && authNickname !== u.nickname
						? u.followers.some((id) => id === authID)
						: undefined,
				online: u.nickname in connectedSockets,
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
