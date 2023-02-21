import { Router, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
import { check, validationResult } from "express-validator";
import multer from "multer";
import fs from "fs";
import { connectedSockets } from "../socket";
import sharp from "sharp";
const router = Router();

const store = multer.memoryStorage();
const upload = multer({ storage: store });

// /profile/user/:nickname
router.get("/user/:nickname", async (req: Request, res: Response) => {
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
			nickname: user.nickname,
			firstName: user.firstName,
			lastName: user.lastName,
			image: user.avatar,
			location: {
				country: user.location?.country,
				city: user.location?.city,
			},
			follower:
				!!authID && authNickname !== nickname
					? user.following.some((id) => id === authID)
					: undefined,
			followed:
				!!authID && authNickname !== nickname
					? user.followers.some((id) => id === authID)
					: undefined,
			online: nickname in connectedSockets,
		};

		// friends
		const friends = user.following.filter((id) => user.followers.includes(id));

		const usersInFriends = await User.find(
			{ _id: { $in: friends } },
			{ nickname: 1, firstName: 1, lastName: 1, avatar: 1 }
		)
			.sort({ _id: 1 })
			.limit(9);

		const friendsUsersData = usersInFriends.map((u) => {
			return {
				nickname: u.nickname,
				firstName: u.firstName,
				lastName: u.lastName,
				image: u.avatar,
				online: u.nickname in connectedSockets,
			};
		});

		// followers
		const followers = user.followers.filter(
			(id) => !user.following.includes(id)
		);

		// following
		const following = user.following.filter(
			(id) => !user.followers.includes(id)
		);

		const followData = {
			friends: {
				usersData: friendsUsersData,
				totalCount: friends.length,
			},
			followers: followers.length,
			following: following.length,
		};

		res.status(200).json({
			success: true,
			statusText: "Profile sent successfully",
			userData,
			followData,
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

		// filter for posts
		const filter = !lastPostID
			? { owner: userID }
			: { owner: userID, _id: { $lt: lastPostID } };
		const posts = await Post.find(filter).sort({ _id: -1 }).limit(count);

		// mapping posts
		const postsData = posts.map((p) => {
			return {
				id: p._id,
				date: p.date,
				post: p.post,
				likes: p.likes.length,
				likedMe: p.likes.some((id) => id === authID),
			};
		});

		// add total count to response
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

			// ! limit
			const countOfPosts = await Post.find({ owner: authID }).count();
			if (countOfPosts >= 10) {
				return res.status(200).json({
					success: false,
					statusText:
						"I'm sorry but due to the fact that at the moment I'm using a free database, you can't add more than 10 posts",
				});
			}
			// !

			const { post } = req.body;

			const newPost = new Post({
				date: new Date().toString().split(" ").slice(1, 5).join(" "),
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
				return res.status(200).json({
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
				return res.status(200).json({
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
	upload.single("image"),
	[
		check("nickname", "Invalid nickname length")
			.trim()
			.isLength({ min: 4, max: 15 })
			.optional({ nullable: true, checkFalsy: true }),
		check("nickname", "Id must be alphanumeric")
			.trim()
			.matches(/[\w]/g)
			.optional({ nullable: true, checkFalsy: true }),
		check("nickname", "Not allowed nickname").trim().not().equals("login"),
		check("nickname", "Not allowed nickname").trim().not().equals("register"),
		check("nickname", "Not allowed nickname").trim().not().equals("messages"),
		check("nickname", "Not allowed nickname").trim().not().equals("friends"),
		check("nickname", "Not allowed nickname").trim().not().equals("users"),
		check("nickname", "Not allowed nickname").trim().not().equals("settings"),
		check("nickname", "Not allowed nickname").trim().not().equals("images"),
		check("nickname", "Not allowed nickname").trim().not().equals("news"),
		check("country", "Country must be alpha")
			.trim()
			.matches(/[a-zA-Z-]+/g)
			.isLength({ min: 2, max: 25 })
			.optional({ nullable: true, checkFalsy: true }),
		check("city", "City must be alpha")
			.trim()
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

			const { nickname, country, city } = req.body;
			const image = req.file;

			const user = await User.findById(authID);
			if (!user) {
				return res.status(400).json({
					success: false,
					statusText: "Auth error",
				});
			}

			// set new avatar
			if (!!image) {
				let path: string;
				if (process.env.NODE_ENV === "production") {
					path = "client/production/images/" + authID;
				} else {
					path = "client/public/images/" + authID;
				}

				// create dir
				fs.access(path, (err) => {
					if (err) {
						fs.mkdirSync(path, { recursive: true });
					}
				});

				// remove old avatar
				fs.readdir(path, (err, files) => {
					if (files) {
						for (const file of files) {
							if (file.includes("avatar")) {
								fs.unlink(path + "/" + file, (err) => {});
							}
						}
					}
				});

				const dateNow = Date.now();

				// sharp image
				await sharp(image.buffer)
					.withMetadata()
					.resize({ width: 750, height: 750 })
					.jpeg({ quality: 50 })
					.toFile(`${path}/avatar&date=${dateNow}.jpg`);

				await sharp(image.buffer)
					.withMetadata()
					.resize({ width: 150, height: 150 })
					.jpeg({ quality: 50 })
					.toFile(`${path}/avatar&date=${dateNow}&size=small.jpg`);

				await user.updateOne({
					avatar: `/images/${authID}/avatar&date=${dateNow}.jpg`,
				});
			}

			// set new country
			if (!!country) {
				await user.updateOne({ "location.country": country.trim() });
			}

			// set new city
			if (!!city) {
				await user.updateOne({ "location.city": city.trim() });
			}

			// set new nickname
			if (!!nickname) {
				const nicknameAlreadyExist = await User.findOne({
					nickname: nickname.trim(),
				});

				if (!!nicknameAlreadyExist) {
					return res.status(200).json({
						success: false,
						statusText: "Nickname already taken",
					});
				}

				await user.updateOne({ nickname: nickname.trim() });

				return res
					.status(201)
					.cookie("nickname", nickname.trim(), {
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
