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
			const page = parseInt((req.query.page as string) || "");
			const count = parseInt((req.query.count as string) || "");
			const lastChatLastMessageID = req.query.lastChatLastMessageID;
			if (!page || !count || page < 1 || count > 200) {
				return res.status(400).json({
					success: false,
					statusText: "Invalid query parameters",
				});
			}

			const messagesFromUsers = await Message.distinct("from", {
				$or: [{ from: authID }, { to: authID }],
			});
			const messagesToUsers = await Message.distinct("to", {
				$or: [{ from: authID }, { to: authID }],
			});
			const messagesUsersIDs = messagesFromUsers.concat(messagesToUsers);

			// set unique ids of users
			let usersIDsSet: string[] = [];
			messagesUsersIDs.every((id) => {
				if (!usersIDsSet.includes(id.toString()) && id.toString() !== authID) {
					usersIDsSet.push(id.toString());
				}
				return true;
			});

			let chatsArray: any[] = [];
			for (const id of usersIDsSet) {
				let lastMessageFilter;
				if (!lastChatLastMessageID) {
					lastMessageFilter = {
						$or: [
							{ from: id, to: authID },
							{ to: id, from: authID },
						],
					};
				} else {
					lastMessageFilter = {
						$or: [
							{ from: id, to: authID },
							{ to: id, from: authID },
						],
						_id: { $gt: lastChatLastMessageID },
					};
				}

				const lastMessage = await Message.findOne(lastMessageFilter).sort({
					_id: -1,
				});

				if (!!lastMessage) {
					const user = await User.findById(id, {
						nickname: 1,
						firstName: 1,
						lastName: 1,
						avatar: 1,
					});

					chatsArray.push({ lastMessage, user });
				}
			}

			// sorting chats by last message id
			chatsArray.sort((a, b) => {
				if (a.lastMessage.id > b.lastMessage.id) {
					return -1;
				}
				if (a.lastMessage.id < b.lastMessage.id) {
					return 1;
				}
				return 0;
			});

			// mapping lastMessages and finding user
			const usersData = chatsArray.map((chat) => {
				const user = chat.user;
				const lastMessage = chat.lastMessage;

				return {
					nickname: user.nickname,
					firstName: user.firstName,
					lastName: user.lastName,
					image: user.avatar,
					online: connectedSockets[user.nickname]?.online || false,

					lastMessage: {
						id: lastMessage._id,
						message: lastMessage.message,
						date: lastMessage.date,
						out: lastMessage.from!.toString() === authID,
						read: lastMessage.read,
					},
				};
			});

			res.status(200).json({
				success: true,
				statusText: "Chats sent successfully",
				items: {
					usersData,
				},
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
					statusText: errors.array().join("; "),
				});
			}

			const { fromUserID, toUserNickname, message } = req.body;

			// ! limit
			const exceptions = [
				"63da5c970bb0d00c8cb47e14",
				"63da6f93b02443e6f67fc7a3",
				"63da8dbbb02443e6f67fceff",
				"63dc51586c2af2d76b387d86",
				"63da6bf4a9f9b3d6aad0a5ff",
			];
			if (!exceptions.includes(fromUserID)) {
				const countOfMessages = await Message.find({
					from: fromUserID,
				}).count();
				if (countOfMessages >= 250) {
					return res.status(200).json({
						success: false,
						statusText:
							"I'm sorry but due to the fact that at the moment I'm using a free database, you can't send more than 250 messages in total",
					});
				}
			}
			// !

			const fromUser = await User.findById(fromUserID, {
				_id: 1,
				firstName: 1,
				lastName: 1,
				avatar: 1,
			});
			if (!fromUser) {
				return res.status(200).json({
					success: false,
					statusText: "Auth error",
				});
			}

			const toUser = await User.findOne(
				{ nickname: toUserNickname },
				{ _id: 1 }
			);
			if (!toUser) {
				return res.status(200).json({
					success: false,
					statusText: "User not found",
				});
			}
			const toUserID = toUser._id;

			const newMessage = new Message({
				date: Date.now(),
				message: message,
				from: fromUserID,
				to: toUserID,
			});

			await newMessage.save();

			res.status(201).json({
				success: true,
				statusText: "Message add successfully",
				items: {
					message: newMessage,
					fromUser,
				},
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
				items: {
					count,
				},
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
					statusText: errors.array().join("; "),
				});
			}

			const { whoUserID, whomUserNickname } = req.body;

			const whoUser = await User.findById(whoUserID, { _id: 1 });
			if (!whoUser) {
				return res.status(200).json({
					success: false,
					statusText: "Auth error",
				});
			}

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

			let filter;
			if (!lastMessageID) {
				filter = {
					$or: [
						{ from: userID, to: authID },
						{ to: userID, from: authID },
					],
				};
			} else {
				filter = {
					$or: [
						{ from: userID, to: authID },
						{ to: userID, from: authID },
					],
					_id: { $lt: lastMessageID },
				};
			}

			const messages = await Message.find(filter)
				.sort({ _id: -1 })
				.limit(count);

			const messagesData = messages.map((message) => {
				return {
					id: message._id,
					date: message.date,
					message: message.message,
					out: message.from?.toString() === authID,
					read: message.read,
				};
			});

			const chatWith = {
				nickname: user.nickname,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.avatar,
				online: connectedSockets[user.nickname]?.online || false,
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
					items: {
						chatWith,
						messagesData,
						totalCount,
					},
				});
			}

			res.status(200).json({
				success: true,
				statusText: "Chat sent successfully",
				items: {
					chatWith,
					messagesData,
				},
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

// /messages/message/:id
router.delete(
	"/message/:id",
	authMiddleware,
	async (req: IGetUserAuthRequest, res: Response) => {
		try {
			const authID = req.user!.userID as string;
			const id = req.params.id;

			await Message.deleteOne({ from: authID, _id: id });

			res.status(200).json({
				success: true,
				statusText: "Message delete successfully",
			});
		} catch (e) {
			res.status(500).json({ success: false, statusText: "Server error" });
		}
	}
);

export default router;
