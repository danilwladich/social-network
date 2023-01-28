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

			// find users and last message for each
			const users = await Promise.all(
				usersArray.map(async (id) => {
					const lastMessage = await Message.findOne(
						{
							$or: [
								{ from: id, to: authID },
								{ to: id, from: authID },
							],
						},
						{ _id: 1, date: 1, message: 1, read: 1, from: 1 }
					).sort({ _id: -1 });

					return {
						...(await User.findById(id, {
							_id: 1,
							nickname: 1,
							firstName: 1,
							lastName: 1,
							avatar: 1,
						}))!.toObject(),

						lastMessage: {
							...lastMessage!.toObject(),
							id: lastMessage!._id,
							out: lastMessage!.from!.toString() === authID,
							from: undefined,
							_id: undefined,
						},
					};
				})
			);

			// sorting users by last message id
			users.sort((a, b) => {
				if (a.lastMessage.id > b.lastMessage.id) {
					return -1;
				}
				if (a.lastMessage.id < b.lastMessage.id) {
					return 1;
				}
				return 0;
			});

			// mapping users
			const usersData = users.map((u) => {
				return {
					id: u.nickname,
					lastName: u.lastName,
					firstName: u.firstName,
					image: u.avatar,
					lastMessage: u.lastMessage,
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

			const messages = await Message.find(filter).sort({ _id: -1 }).limit(count);

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
				id: user.nickname,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.avatar,
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