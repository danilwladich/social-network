import { Router, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
import { check, validationResult } from "express-validator";
import multer from "multer";
import fs from "fs";
const router = Router();

const store = multer.diskStorage({
	destination(req: IGetUserAuthRequest, file, cb) {
		const path = "./client/public/images/" + req.user!.userID;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename(req, file, cb) {
		return cb(null, file.originalname);
	},
});
const upload = multer({ storage: store }).single("image");

// /profile/:nickname
router.get("/:nickname", async (req: Request, res: Response) => {
	try {
		const authNickname = req.cookies.nickname;
		const authUser = await User.findOne({ nickname: authNickname }, { _id: 1 });
		const authID = authUser?._id.toString();

		const nickname = req.params.nickname;

		const user = await User.findOne({ nickname });
		if (!user) {
			return res.status(200).json({
				success: false,
				statusText: "User not found",
			});
		}

		const userData = {
			id: user.nickname,
			firstName: user.firstName,
			lastName: user.lastName,
			image: user.avatar,
			follower:
				!!authID && authNickname !== nickname
					? user.following.some((id) => id === authID)
					: undefined,
			followed:
				!!authID && authNickname !== nickname
					? user.followers.some((id) => id === authID)
					: undefined,
		};

		const friends: number =
			user.following.filter((id) => user.followers.includes(id)).length || 0;

		const aboutData = {
			friends,
			follow: {
				followers: user.followers.length - friends,
				following: user.following.length - friends,
			},
			location: {
				country: user.location?.country,
				city: user.location?.city,
			},
		};

		res.status(200).json({
			success: true,
			statusText: "Profile sent successfully",
			userData,
			aboutData,
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

// /profile/posts
router.get("/posts/:nickname", async (req: Request, res: Response) => {
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

		const nickname = req.params.nickname;
		const user = await User.findOne({ nickname }, { _id: 1 });
		if (!user) {
			return res.status(200).json({
				success: false,
				statusText: "User not found",
			});
		}
		const userID = user._id.toString();

		const authNickname = req.cookies.nickname;
		const authUser = await User.findOne({ nickname: authNickname }, { _id: 1 });
		const authID = authUser?._id.toString();

		const filter = !lastPostID
			? { owner: userID }
			: { owner: userID, _id: { $lt: lastPostID } };
		const posts = await Post.find(filter).sort({ _id: -1 }).limit(count);

		const postsData = posts.map((p) => {
			return {
				id: p._id,
				date: p.date,
				post: p.post,
				likes: p.likes.length,
				likedMe: p.likes.some((id) => id === authID),
			};
		});

		if (page === 1) {
			const totalCount = await Post.find({ owner: userID }).count();

			return res.status(200).json({
				success: true,
				statusText: "Posts send successfully",
				postsData,
				totalCount,
			});
		}

		res.status(200).json({
			success: true,
			statusText: "Posts send successfully",
			postsData,
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

router.post(
	"/posts",
	authMiddleware,
	[
		check("post", "Post required").exists(),
		check("post", "Post too long").isLength({ max: 15000 }),
	],
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: false,
					statusText: errors.array(),
				});
			}

			const authID = req.user!.userID as string;
			const { post } = req.body;

			const newPost = new Post({
				post,
				owner: authID,
			});
			await newPost.save();

			const postID = newPost._id;

			res.status(201).json({
				success: true,
				statusText: "Post add successfully",
				postID,
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

router.delete(
	"/posts/:id",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const postID = req.params.id;

			const post = await Post.findById(postID);
			if (!post) {
				return res.status(200).json({
					success: false,
					statusText: "Post not found",
				});
			}

			if (post.owner!.toString() !== authID) {
				return res.status(200).json({
					success: false,
					statusText: "Auth error",
				});
			}

			await post.deleteOne();

			res.status(200).json({
				success: true,
				statusText: "Post delete successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// /profile/posts/like
router.post(
	"/posts/like/:postID",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const postID = req.params.postID;

			const post = await Post.findById(postID);
			if (!post) {
				return res.status(400).json({
					success: false,
					statusText: "Post nof found",
				});
			}

			await post.updateOne({ $addToSet: { likes: authID } });

			res.status(201).json({
				success: true,
				statusText: "Post like successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

router.delete(
	"/posts/like/:postID",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const postID = req.params.postID;

			const post = await Post.findById(postID);
			if (!post) {
				return res.status(400).json({
					success: false,
					statusText: "Post nof found",
				});
			}

			await post.updateOne({ $pull: { likes: authID } });

			res.status(200).json({
				success: true,
				statusText: "Post unlike successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// /profile/edit
router.put(
	"/edit",
	authMiddleware,
	upload,
	[
		check("id", "Invalid new id length")
			.isLength({ min: 4, max: 15 })
			.optional({ nullable: true, checkFalsy: true }),
		check("id", "Id must be alphanumeric")
			.matches(/[\w]/g)
			.optional({ nullable: true, checkFalsy: true }),
		check("id", "Not allowed new id").not().equals("login"),
		check("id", "Not allowed new id").not().equals("register"),
		check("id", "Not allowed new id").not().equals("messages"),
		check("id", "Not allowed new id").not().equals("friends"),
		check("id", "Not allowed new id").not().equals("users"),
		check("id", "Not allowed new id").not().equals("settings"),
		check("id", "Not allowed new id").not().equals("images"),
		check("id", "Not allowed new id").not().equals("news"),
		check("country", "Country must be alpha")
			.matches(/[a-zA-Z-]+/g)
			.isLength({ min: 2, max: 25 })
			.optional({ nullable: true, checkFalsy: true }),
		check("city", "City must be alpha")
			.matches(/[a-zA-Z-]+/g)
			.isLength({ min: 2, max: 25 })
			.optional({ nullable: true, checkFalsy: true }),
	],
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: false,
					statusText: errors.array(),
				});
			}

			const authID = req.user!.userID as string;
			const { id, country, city } = req.body;
			const image = req.file;

			const user = await User.findById(authID);
			if (!user) {
				return res.status(400).json({
					success: false,
					statusText: "Auth error",
				});
			}

			if (!!image) {
				await user.updateOne({ avatar: "/images/" + authID + "/avatar.jpg" });
			}

			if (!!country) {
				await user.updateOne({ "location.country": country });
			}

			if (!!city) {
				await user.updateOne({ "location.city": city });
			}

			if (!!id) {
				const nicknameAlreadyExist = await User.findOne({ nickname: id });

				if (!!nicknameAlreadyExist) {
					return res.status(200).json({
						success: false,
						statusText: "Nickname already taken",
					});
				}

				await user.updateOne({ nickname: id });

				return res
					.status(201)
					.cookie("nickname", id, {
						maxAge: 2419000000,
						httpOnly: true,
						path: "/api",
					})
					.json({
						success: true,
						statusText: "Profile edit successfully",
					});
			}

			res.status(201).json({
				success: true,
				statusText: "Profile edit successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// TODO make another router only for update avatar
// TODO make another router only for update avatar
// TODO make another router only for update avatar
// TODO make another router only for update avatar

export default router;
