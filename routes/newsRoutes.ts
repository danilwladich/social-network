import { Router, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
const router = Router();

// /news?page=:page&count=:count&lastPostID=:lastPostID`
router.get(
	"/",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const page = parseInt((req.query.page as string) || "");
			const count = parseInt((req.query.count as string) || "");
			const lastPostID = req.query.lastPostID;
			if (!page || !count || page < 1 || count > 100) {
				return res.status(400).json({
					success: false,
					statusText: "Invalid query parameters",
				});
			}

			const authID = req.user!.userID;

			const authUser = await User.findById(authID);
			if (!authUser) {
				return res.status(200).json({
					success: false,
					statusText: "Auth error",
				});
			}
			const authFollowing = authUser.following;

			// find posts based on last post id
			const filter = !lastPostID
				? { owner: { $in: authFollowing } }
				: { owner: { $in: authFollowing }, _id: { $lt: lastPostID } };
			const posts = await Post.find(filter).sort({ _id: -1 }).limit(count);

			// mapping posts and find owner
			const postsData = await Promise.all(
				posts.map(async (p) => {
					const user = await User.findById(p.owner, {
						nickname: 1,
						firstName: 1,
						lastName: 1,
						avatar: 1,
					});

					return {
						owner: {
							nickname: user?.nickname,
							firstName: user?.firstName,
							lastName: user?.lastName,
							image: user?.avatar,
						},
						id: p._id,
						date: p.date,
						post: p.post,
						likes: p.likes.length,
						likedMe: p.likes.some((id) => id === authID),
					};
				})
			);

			// add total count to response
			if (page === 1) {
				const totalCount = await Post.find({
					owner: { $in: authFollowing },
				}).count();

				return res.status(200).json({
					success: true,
					statusText: "News send successfully",
					items: {
						postsData,
						totalCount,
					},
				});
			}

			res.status(200).json({
				success: true,
				statusText: "News send successfully",
				items: {
					postsData,
				},
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
