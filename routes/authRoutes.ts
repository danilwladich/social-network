import { Router, Request, Response } from "express";
import bcrytp from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { check, validationResult } from "express-validator";
import User from "../models/User";
import Post from "../models/Post";
import Message from "../models/Message";
import { nanoid } from "nanoid";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
import fs from "fs";
import axios from "axios";
import Donater from "../models/Donater";
const router = Router();

// /api/auth/register
router.post(
	"/register",
	[
		check("phoneNumber", "Phone number required").exists(),
		check("password", "Password required").exists(),
		check("password", "Password too short").isLength({ min: 8 }),
		check("password", "Password cannot contain spaces").not().matches(/\s/),
		check("firstName", "First name required").exists(),
		check("firstName", "First name must be alpha").matches(/[a-zA-Z-]+/g),
		check("lastName", "Last name required").exists(),
		check("lastName", "Last name must be alpha").matches(/[a-zA-Z-]+/g),
		check("recaptcha", "Recaptcha required").exists(),
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: false,
					statusText: errors.array().join("; "),
				});
			}

			const { phoneNumber, password, firstName, lastName, recaptcha } =
				req.body;

			const secretKey = config.get("recaptchaSecretKey");

			const recaptchaResponse = await axios.post(
				`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`
			);

			if (recaptchaResponse.data.success === false) {
				return res.status(200).json({
					success: false,
					statusText: "Antibot system not passed",
				});
			}

			const userAlreadyExist = await User.findOne({ phoneNumber });
			if (!!userAlreadyExist) {
				return res.status(200).json({
					success: false,
					statusText: "User with given phone number already exists",
				});
			}

			const nickname = nanoid(15);
			const hashedPassword = await bcrytp.hash(password, 12);

			const user = new User({
				nickname,
				phoneNumber,
				password: hashedPassword,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
			});
			await user.save();

			const token = jwt.sign({ userID: user.id }, config.get("jwtSecret"), {
				expiresIn: "28d",
			});

			res
				.status(201)
				.cookie("token", token, {
					maxAge: 2419000000,
					httpOnly: true,
					path: "/api",
				})
				.cookie("nickname", user.nickname, {
					maxAge: 2419000000,
					httpOnly: true,
					path: "/api",
				})
				.json({
					success: true,
					statusText: "User registered successful",
				});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// /api/auth/login
router.post(
	"/login",
	[
		check("phoneNumber", "Phone number required").exists(),
		check("password", "Password required").exists(),
		check("recaptcha", "Recaptcha required").exists(),
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(200).json({
					success: false,
					statusText: errors.array().join("; "),
				});
			}

			const { phoneNumber, password, recaptcha } = req.body;

			const secretKey = config.get("recaptchaSecretKey");

			const recaptchaResponse = await axios.post(
				`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`
			);

			if (recaptchaResponse.data.success === false) {
				return res.status(200).json({
					success: false,
					statusText: "Antibot system not passed",
				});
			}

			const user = await User.findOne({ phoneNumber });
			if (!user) {
				return res.status(200).json({
					success: false,
					statusText: "Incorrect phone number or password",
				});
			}

			const passwordCorrect = await bcrytp.compare(password, user.password);
			if (!passwordCorrect) {
				return res.status(200).json({
					success: false,
					statusText: "Incorrect phone number or password",
				});
			}

			const token = jwt.sign({ userID: user.id }, config.get("jwtSecret"), {
				expiresIn: "28d",
			});

			res
				.status(200)
				.cookie("token", token, {
					maxAge: 2419000000,
					httpOnly: true,
					path: "/api",
				})
				.cookie("nickname", user.nickname, {
					maxAge: 2419000000,
					httpOnly: true,
					path: "/api",
				})
				.json({
					success: true,
					statusText: "User logged successful",
				});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// /api/auth/me
router.get("/me", async (req: Request, res: Response) => {
	try {
		const token = req.cookies.token;
		const nickname = req.cookies.nickname;
		if (!token || !nickname) {
			return res.status(200).json({
				success: false,
				statusText: "Auth failed",
			});
		}

		res.status(200).json({
			success: true,
			statusText: "Auth successful",
			items: {
				user: { nickname, token },
			},
		});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

router.delete("/me", async (req: Request, res: Response) => {
	try {
		res
			.status(200)
			.clearCookie("token", { path: "/api" })
			.clearCookie("nickname", { path: "/api" })
			.json({
				success: true,
				statusText: "Log out successful",
			});
	} catch (e) {
		res.status(500).json({ success: false, statusText: "Server error" });
	}
});

// /api/auth/delete
router.delete(
	"/delete",
	authMiddleware,
	[check("password", "Password required").exists()],
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const { password } = req.body;

			const user = await User.findById(authID);
			if (!user) {
				return res.status(200).json({
					success: false,
					statusText: "Auth error",
				});
			}

			const passwordCorrect = await bcrytp.compare(password, user.password);
			if (!passwordCorrect) {
				return res.status(200).json({
					success: false,
					statusText: "Incorrect password",
				});
			}

			// delete all images
			let path: string;
			if (process.env.NODE_ENV === "production") {
				path = "client/production/images/" + authID;
			} else {
				path = "client/public/images/" + authID;
			}

			fs.rmSync(path, {
				recursive: true,
				force: true,
			});

			await Post.deleteMany({ owner: authID });

			await Post.updateMany({ likes: authID }, { $pull: { likes: authID } });

			await Message.deleteMany({ $or: [{ from: authID }, { to: authID }] });

			await User.updateMany(
				{ _id: { $in: user.following } },
				{ $pull: { followers: authID } }
			);

			await User.updateMany(
				{ _id: { $in: user.followers } },
				{ $pull: { following: authID } }
			);

			await Message.deleteMany({ $or: [{ from: authID }, { to: authID }] });

			await Donater.deleteOne({ owner: authID });

			await user.deleteOne();

			res.status(200).json({
				success: true,
				statusText: "Account delete successful",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
