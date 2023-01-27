import { Router, Request, Response } from "express";
import User from "../models/User";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
import { check, validationResult } from "express-validator";
import Message from "../models/Message";
const router = Router();

// /messages
router.get(
	"",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;

			const messages = await Message.find({
				$or: [{ from: authID }, { to: authID }],
			}).sort({
				_id: -1,
			});

			const usersSet: Set<string> = new Set();
			let usersArray: string[] = [];

			messages.forEach((m) => {
				if (m.from!.toString() !== authID) {
					usersSet.add(m.from!.toString());
				}
				if (m.to!.toString() !== authID) {
					usersSet.add(m.to!.toString());
				}
			});

			usersSet.forEach((v) => usersArray.push(v));

			const users = await Promise.all(
				usersArray.map(async (id) => {
					return await User.findById(id, {
						nickname: 1,
						firstName: 1,
						lastName: 1,
						avatar: 1,
					});
				})
			);

			const usersData = users.map((u) => {
				return {
					id: u?.nickname,
					lastName: u?.lastName,
					firstName: u?.firstName,
					image: u?.avatar,
					lastMessage: messages
						.filter((m) => {
							return (
								m.to?.toString() === u?._id.toString() ||
								m.from?.toString() === u?._id.toString()
							);
						})
						.map((m) => {
							return {
								id: m.id,
								date: m.date,
								message: m.message,
								out: m.from?.toString() === authID,
								read: m.read,
							};
						})[0],
				};
			});

			res.status(200).json({
				success: true,
				statusText: "Chats sent successfully",
				usersData,
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

router.post(
	"",
	[
		check("fromUserID", "From user ID required").exists(),
		check("toUserNickname", "To user nickname required").exists(),
		check("message", "Message required").exists(),
		check("message", "Message too long").isLength({ max: 5000 }),
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(200).json({
					success: false,
					statusText: errors.array(),
				});
			}

			const { fromUserID, toUserNickname, message } = req.body;

			const fromUser = await User.findById(fromUserID, {
				_id: 1,
				firstName: 1,
				lastName: 1,
				avatar: 1,
			});

			const toUser = await User.findOne(
				{ nickname: toUserNickname },
				{ _id: 1 }
			);
			if (!fromUser || !toUser) {
				return res.status(200).json({
					success: false,
					statusText: "User not found",
				});
			}
			const toUserID = toUser._id;

			const newMessage = new Message({
				date: new Date().toString().split(" ").slice(1, 5).join(" "),
				message: message,
				from: fromUserID,
				to: toUserID,
			});

			await newMessage.save();

			res.status(201).json({
				success: true,
				statusText: "Message add successfully",
				message: newMessage,
				fromUser,
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// /messages/:nickname
router.get(
	"/:nickname",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const nickname = req.params.nickname;
			const user = await User.findOne({ nickname });
			if (!user) {
				return res.status(200).json({
					success: false,
					statusText: "User not found",
				});
			}
			const userID = user._id;

			const authID = req.user!.userID as string;

			const messagesTo = await Message.find({ from: authID, to: userID }).sort({
				_id: 1,
			});
			const messagesFrom = await Message.find({
				from: userID,
				to: authID,
			}).sort({
				_id: 1,
			});

			const messages = messagesFrom.concat(messagesTo);

			const messagesSort = messages.sort((a, b) => {
				if (a._id < b._id) {
					return -1;
				}
				if (a._id > b._id) {
					return 1;
				}
				return 0;
			});

			const messagesData = messagesSort.map((m) => {
				return {
					id: m._id,
					date: m.date,
					message: m.message,
					out: m.from?.toString() === authID,
					read: m.read,
				};
			});

			const chatWith = {
				id: user.nickname,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.avatar,
			};

			res.status(200).json({
				success: true,
				statusText: "Chat sent successfully",
				chatWith,
				messagesData,
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

// /messages/read
router.put(
	"/read",
	[
		check("whoUserID", "Who user ID required").exists(),
		check("whomUserNickname", "Whom user nickname required").exists(),
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(200).json({
					success: false,
					statusText: errors.array(),
				});
			}

			const { whoUserID, whomUserNickname } = req.body;

			const whoUser = await User.findById(whoUserID, { _id: 1 });
			const whomUser = await User.findOne({ nickname: whomUserNickname });
			if (!whoUser || !whomUser) {
				return res.status(200).json({
					success: false,
					statusText: "User not found",
				});
			}
			const whomUserID = whomUser._id;

			await Message.updateMany(
				{ from: whomUserID, to: whoUserID, read: false },
				{ read: true }
			);

			res.status(200).json({
				success: true,
				statusText: "Messages read successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
