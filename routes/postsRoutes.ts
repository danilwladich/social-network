import { Router, Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
import { check, validationResult } from "express-validator";
import multer from "multer";
import fs from "fs";
import sharp from "sharp";
const router = Router();

const store = multer.memoryStorage();
const upload = multer({ storage: store });

// /posts
router.get("/:nickname", async (req: Request, res: Response) => {
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
				images: p.images,
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
				items: {
					postsData,
					totalCount,
				},
			});
		}

		res.status(200).json({
			success: true,
			statusText: "Posts send successfully",
			items: {
				postsData,
			},
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

router.post(
	"/",
	authMiddleware,
	[check("post", "Post too long").isLength({ max: 15000 })],
	upload.array("images"),
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: false,
					statusText: errors.array().join("; "),
				});
			}

			const authID = req.user!.userID as string;

			// ! limit
			const countOfPosts = await Post.find({ owner: authID }).count();
			if (countOfPosts >= 50) {
				return res.status(200).json({
					success: false,
					statusText:
						"I'm sorry but due to the fact that at the moment I'm using a free database, you can't add more than 50 posts",
				});
			}
			// !

			const { post } = req.body;

			const images = req.files as Express.Multer.File[] | undefined;

			// must be at least one field
			if (!post && !images?.length) {
				return res.status(200).json({
					success: false,
					statusText: "Post cannot be empty",
				});
			}

			// create new post
			const newPost = new Post({
				date: Date.now(),
				owner: authID,
			});
			const postID = newPost._id;

			// save images
			if (images?.length) {
				// check mimetype
				if (!images.every((file) => file.mimetype.split("/")[0] === "image")) {
					return res.status(200).json({
						success: false,
						statusText: "Only images allowed",
					});
				}

				// every image size must be less than 10 mb
				if (!images.every((file) => file.size <= 10 * 1024 * 1024)) {
					return res.status(200).json({
						success: false,
						statusText: "File size cannot be more than 10mb",
					});
				}

				let path: string;
				if (process.env.NODE_ENV === "production") {
					path = `client/production/images/${authID}/posts/${postID}`;
				} else {
					path = `client/public/images/${authID}/posts/${postID}`;
				}

				// create dir
				fs.access(path, (err) => {
					if (err) {
						fs.mkdirSync(path, { recursive: true });
					}
				});

				for (let i = 0; i < images.length; i++) {
					const image = images[i];

					// sharp image
					await sharp(image.buffer)
						.withMetadata()
						.resize({ width: 750, height: 750 })
						.jpeg({ quality: 50 })
						.toFile(`${path}/${i}.jpg`);

					newPost.images.push(`/images/${authID}/posts/${postID}/${i}.jpg`);
				}
			}

			// save post text
			if (post) {
				newPost.post = post;
			}

			await newPost.save();

			res.status(201).json({
				success: true,
				statusText: "Post add successfully",
				items: {
					postID,
				},
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

router.delete(
	"/:id",
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

			// check post owner
			if (post.owner.toString() !== authID) {
				return res.status(200).json({
					success: false,
					statusText: "Auth error",
				});
			}

			// delete images
			if (post.images?.length) {
				let path: string;
				if (process.env.NODE_ENV === "production") {
					path = `client/production/images/${authID}/posts/${postID}`;
				} else {
					path = `client/public/images/${authID}/posts/${postID}`;
				}

				fs.rmSync(path, {
					recursive: true,
					force: true,
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

// /posts/like
router.post(
	"/like/:postID",
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
	"/like/:postID",
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

export default router;
