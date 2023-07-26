import { Router, Request, Response } from "express";
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
			cover: user.cover,
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
			online: connectedSockets[user.nickname]?.online || false,
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
				online: connectedSockets[u.nickname]?.online || false,
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
			items: {
				userData,
				followData,
			},
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

// /profile/edit
router.put(
	"/edit",
	authMiddleware,
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
					statusText: errors.array().join("; "),
				});
			}

			const authID = req.user!.userID as string;

			const { nickname, country, city } = req.body;

			const user = await User.findById(authID);
			if (!user) {
				return res.status(400).json({
					success: false,
					statusText: "Auth error",
				});
			}

			// set new country
			if (country) {
				await user.updateOne({ "location.country": country.trim() });
			}

			// set new city
			if (city) {
				await user.updateOne({ "location.city": city.trim() });
			}

			// set new nickname
			if (nickname) {
				const nicknameAlreadyExist = await User.findOne({
					nickname: nickname.trim(),
				});

				if (nicknameAlreadyExist) {
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

// /profile/edit/avatar
router.put(
	"/edit/avatar",
	authMiddleware,
	upload.single("image"),
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;

			const image = req.file;

			const user = await User.findById(authID);
			if (!user) {
				return res.status(400).json({
					success: false,
					statusText: "Auth error",
				});
			}

			// set new avatar
			if (image) {
				// check mimetype
				console.log(image.mimetype)
				if (image.mimetype.split("/")[0] !== "image") {
					return res.status(200).json({
						success: false,
						statusText: "Only image allowed",
					});
				}

				// check size
				if (image.size > 10 * 1024 * 1024) {
					return res.status(200).json({
						success: false,
						statusText: "File size cannot be more than 10mb!",
					});
				}

				let path: string;
				if (process.env.NODE_ENV === "production") {
					path = `client/production/images/${authID}/avatar`;
				} else {
					path = `client/public/images/${authID}/avatar`;
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
					.resize({ width: 900, height: 900 })
					.jpeg({ quality: 50 })
					.toFile(`${path}/avatar&date=${dateNow}.jpg`);

				// small size
				await sharp(image.buffer)
					.withMetadata()
					.resize({ width: 150, height: 150 })
					.jpeg({ quality: 50 })
					.toFile(`${path}/avatar&date=${dateNow}&size=small.jpg`);

				await user.updateOne({
					avatar: `/images/${authID}/avatar/avatar&date=${dateNow}.jpg`,
				});
			} else {
				return res.status(200).json({
					success: false,
					statusText: "Image upload error",
				});
			}

			res.status(201).json({
				success: true,
				statusText: "Profile avatar edit successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// /profile/edit/cover
router.put(
	"/edit/cover",
	authMiddleware,
	upload.single("cover"),
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;

			const cover = req.file;

			const user = await User.findById(authID);
			if (!user) {
				return res.status(400).json({
					success: false,
					statusText: "Auth error",
				});
			}

			// set new cover
			if (cover) {
				// check mimetype
				if (cover.mimetype.split("/")[0] !== "image") {
					return res.status(200).json({
						success: false,
						statusText: "Only image allowed",
					});
				}

				// check size
				if (cover.size > 10 * 1024 * 1024) {
					return res.status(200).json({
						success: false,
						statusText: "File size cannot be more than 10mb!",
					});
				}

				let path: string;
				if (process.env.NODE_ENV === "production") {
					path = `client/production/images/${authID}/cover`;
				} else {
					path = `client/public/images/${authID}/cover`;
				}

				// create dir
				fs.access(path, (err) => {
					if (err) {
						fs.mkdirSync(path, { recursive: true });
					}
				});

				// remove old cover
				fs.readdir(path, (err, files) => {
					if (files) {
						for (const file of files) {
							if (file.includes("cover")) {
								fs.unlink(path + "/" + file, (err) => {});
							}
						}
					}
				});

				const dateNow = Date.now();

				// sharp image
				await sharp(cover.buffer)
					.withMetadata()
					.resize({ width: 750, height: 750 })
					.jpeg({ quality: 50 })
					.toFile(`${path}/cover&date=${dateNow}.jpg`);

				await user.updateOne({
					cover: `/images/${authID}/cover/cover&date=${dateNow}.jpg`,
				});
			} else {
				return res.status(200).json({
					success: false,
					statusText: "Image upload error",
				});
			}

			res.status(201).json({
				success: true,
				statusText: "Profile cover edit successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
