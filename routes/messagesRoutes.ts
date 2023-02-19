import { Router, Request, Response } from "express";
import User from "../models/User";
import authMiddleware, {
	IGetUserAuthRequest,
} from "../middleware/authMiddleware";
import { check, validationResult } from "express-validator";
import Message from "../models/Message";
import { connectedSockets } from "../socket";
const router = Router();

// /messages/chats
router.get(
	"/chats",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;

			const messagesFromUsers = await Message.distinct("from", {
				$or: [{ from: authID }, { to: authID }],
			});
			const messagesToUsers = await Message.distinct("to", {
				$or: [{ from: authID }, { to: authID }],
			});
			const messagesUsers = messagesFromUsers.concat(messagesToUsers);

			// set unique ids of users
			const usersSet: Set<string> = new Set();
			messagesUsers.forEach((id) => {
				if (id.toString() !== authID) {
					usersSet.add(id.toString());
				}
			});
			let usersArray: string[] = [];
			usersSet.forEach((id) => usersArray.push(id));

			// last messages for each users ids
			const lastMessages = await Promise.all(
				usersArray.map(async (id) => {
					return await Message.findOne({
						$or: [
							{ from: id, to: authID },
							{ to: id, from: authID },
						],
					}).sort({ _id: -1 });
				})
			);

			// sorting last messages by id
			lastMessages.sort((a, b) => {
				if (a?.id > b?.id) {
					return -1;
				}
				if (a?.id < b?.id) {
					return 1;
				}
				return 0;
			});

			// mapping lastMessages and finding user
			const usersData = await Promise.all(
				lastMessages.map(async (m) => {
					if (!!m) {
						const userID = m.from!.toString() === authID ? m.to : m.from;
						const user = await User.findById(userID, {
							nickname: 1,
							firstName: 1,
							lastName: 1,
							avatar: 1,
						});

						if (!!user) {
							return {
								nickname: user.nickname,
								firstName: user.firstName,
								lastName: user.lastName,
								image: user.avatar,
								online: user.nickname in connectedSockets,

								lastMessage: {
									id: m._id,
									message: m.message,
									date: m.date,
									out: m.from!.toString() === authID,
									read: m.read,
								},
							};
						}
					}
				})
			);

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

// /messages
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

// /messages/read
router.get(
	"/read",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;

			const fromUsers = await Message.distinct("from", {
				to: authID,
				read: false,
			});

			const count = await Promise.all(
				fromUsers.map(async (id) => {
					return (await User.findById(id, { _id: 0, nickname: 1 }))?.nickname;
				})
			);

			res.status(200).json({
				success: true,
				statusText: "Count of unread messages sent successfully",
				count,
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

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

// /messages/chat/:nickname
router.get(
	"/chat/:nickname",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const page = parseInt((req.query.page as string) || "");
			const count = parseInt((req.query.count as string) || "");
			const lastMessageID = req.query.lastMessageID;
			if (!page || !count || page < 1 || count > 200) {
				return res.status(400).json({
					success: false,
					statusText: "Invalid query parameters",
				});
			}

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

			const filter = !lastMessageID
				? {
						$or: [
							{ from: userID, to: authID },
							{ to: userID, from: authID },
						],
				  }
				: {
						$or: [
							{ from: userID, to: authID },
							{ to: userID, from: authID },
						],
						_id: { $lt: lastMessageID },
				  };

			const messages = await Message.find(filter)
				.sort({ _id: -1 })
				.limit(count);

			const messagesData = messages.map((m) => {
				return {
					id: m._id,
					date: m.date,
					message: m.message,
					out: m.from?.toString() === authID,
					read: m.read,
				};
			});

			const chatWith = {
				nickname: user.nickname,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.avatar,
				online: user.nickname in connectedSockets,
			};

			// sent total count if page === 1
			if (page === 1) {
				const totalCount = await Message.find({
					$or: [
						{ from: userID, to: authID },
						{ to: userID, from: authID },
					],
				}).count();

				return res.status(200).json({
					success: true,
					statusText: "Chat sent successfully",
					chatWith,
					messagesData,
					totalCount,
				});
			}

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

router.delete(
	"/chat/:nickname",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const nickname = req.params.nickname;

			const user = await User.findOne({ nickname });
			if (!user) {
				return res.status(200).json({
					success: false,
					statusText: "User not found",
				});
			}
			const userID = user._id;

			await Message.deleteMany({
				$or: [
					{ from: userID, to: authID },
					{ to: userID, from: authID },
				],
			});

			res.status(200).json({
				success: true,
				statusText: "Chat delete successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
