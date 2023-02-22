import config from "config";
import { Server } from "socket.io";
import axios from "axios";
import jwt from "jsonwebtoken";
import Post from "./models/Post";
import Message from "./models/Message";
import User from "./models/User";
import fs from "fs";

let baseURL: string;
if (process.env.NODE_ENV === "production") {
	baseURL = "http://46.41.137.197/api/";
} else {
	baseURL = "http://localhost:80/api/";
}

const fileName = "connectedSockets.txt";

// create txt
if (!fs.existsSync(fileName)) {
	fs.writeFileSync(fileName, "{}");
}

// read txt
const connectedSocketsTxt = fs.readFileSync(fileName).toString();

interface IConnectedSockets {
	[key: string]: {
		socketID: string;
		userID: string;
		online: string | boolean;
	};
}

// parse json
export const connectedSockets = JSON.parse(
	connectedSocketsTxt || "{}"
) as IConnectedSockets;

export default (io: Server) => {
	io.sockets.on("connection", (socket) => {
		// connected
		socket.on("connected", (data) => {
			try {
				const decoded = jwt.verify(
					data.token,
					config.get("jwtSecret")
				) as jwt.JwtPayload;

				// set user to json
				connectedSockets[data.nickname] = {
					socketID: socket.id,
					userID: decoded.userID,
					online: true,
				};

				// write txt
				fs.writeFileSync(fileName, JSON.stringify(connectedSockets));
			} catch (e) {}
		});

		// send message
		socket.on("sendMessage", async (data) => {
			if (connectedSockets[data.from]) {
				const res = await axios.post(baseURL + "messages", {
					fromUserID: connectedSockets[data.from].userID,
					toUserNickname: data.to,
					message: data.message,
				});

				const { success, statusText, message, fromUser } = res.data;

				if (success) {
					if (connectedSockets[data.to]?.socketID) {
						io.sockets
							.to(connectedSockets[data.to].socketID)
							.emit("receiveMessage", {
								messageData: {
									id: message._id,
									date: message.date,
									message: message.message,
									out: false,
								},
								fromUser: {
									nickname: data.from,
									firstName: fromUser.firstName,
									lastName: fromUser.lastName,
									image: fromUser.avatar,
								},
							});
					}

					io.sockets
						.to(connectedSockets[data.from].socketID)
						.emit("messageSent", {
							oldID: data.id,
							newID: message._id,
						});
				} else {
					io.sockets.to(connectedSockets[data.from].socketID).emit("error", {
						statusText: "Send message: " + statusText,
					});
				}
			}
		});

		// read message
		socket.on("readMessages", async (data) => {
			if (connectedSockets[data.who]) {
				const res = await axios.put(baseURL + "messages/read", {
					whoUserID: connectedSockets[data.who].userID,
					whomUserNickname: data.whom,
				});

				const { success, statusText } = res.data;

				if (success) {
					if (connectedSockets[data.whom]?.socketID) {
						io.sockets
							.to(connectedSockets[data.whom].socketID)
							.emit("messagesRead", { userNickname: data.who });
					}
				} else {
					io.sockets.to(connectedSockets[data.who].socketID).emit("error", {
						statusText: "Read messages: " + statusText,
					});
				}
			}
		});

		// send message
		socket.on("deleteMessage", async (data) => {
			if (connectedSockets[data.from]) {
				if (connectedSockets[data.to]?.socketID) {
					io.sockets
						.to(connectedSockets[data.to].socketID)
						.emit("messageDelete", {
							from: data.from,
							messageID: data.messageID,
							penultimateMessageData: data.penultimateMessageData,
						});
				}
			}
		});

		// nickname changed
		socket.on("nicknameChanged", (data) => {
			if (connectedSockets[data.nickname]) {
				delete connectedSockets[data.nickname];

				// write txt
				fs.writeFileSync(fileName, JSON.stringify(connectedSockets));
			}
		});

		// logout
		socket.on("logout", (data) => {
			if (connectedSockets[data.nickname]) {
				connectedSockets[data.nickname].online = new Date()
					.toString()
					.split(" ")
					.slice(1, 5)
					.join(" ");

				connectedSockets[data.nickname].socketID = "";

				// write txt
				fs.writeFileSync(fileName, JSON.stringify(connectedSockets));
			}
		});

		// logout
		socket.on("deleteAccount", (data) => {
			if (connectedSockets[data.nickname]) {
				delete connectedSockets[data.nickname];

				// write txt
				fs.writeFileSync(fileName, JSON.stringify(connectedSockets));
			}
		});

		// disconnect
		socket.on("disconnect", (data) => {
			for (let key in connectedSockets) {
				if (connectedSockets[key].socketID === socket.id) {
					connectedSockets[key].online = new Date()
						.toString()
						.split(" ")
						.slice(1, 5)
						.join(" ");

					connectedSockets[key].socketID = "";

					// write txt
					fs.writeFileSync(fileName, JSON.stringify(connectedSockets));
				}
			}
		});
	});
};

// deleting non active users
const exceptions = [
	"63da5c970bb0d00c8cb47e14",
	"63da6f93b02443e6f67fc7a3",
	"63da8dbbb02443e6f67fceff",
	"63dc51586c2af2d76b387d86",
	"63da6bf4a9f9b3d6aad0a5ff",
	"63f3d7990ae0cab7532b4508",
	"63da69dda9f9b3d6aad0a44b",
];

const secondsToCheck = 86400;

setInterval(async () => {
	for (let key in connectedSockets) {
		const online = connectedSockets[key].online;
		if (
			typeof online === "string" &&
			!exceptions.includes(connectedSockets[key].userID)
		) {
			const day = new Date(Date.parse(online)).getDate();
			const dayNow = new Date().getDate();
			const daysInMonth = new Date(
				new Date(Date.parse(online)).getFullYear(),
				new Date(Date.parse(online)).getMonth() + 1,
				0
			).getDate();
			const month = new Date(Date.parse(online)).getMonth() + 1;
			const monthNow = new Date(Date.parse(online)).getMonth() + 1;
			if (
				dayNow - day >= 28 ||
				(month !== monthNow && daysInMonth - day + dayNow >= 28)
			) {
				const userID = connectedSockets[key].userID;

				const user = await User.findById(userID);
				if (!user) {
					return;
				}

				// delete all images
				let path: string;
				if (process.env.NODE_ENV === "production") {
					path = "client/production/images/" + userID;
				} else {
					path = "client/public/images/" + userID;
				}

				fs.rmSync(path, {
					recursive: true,
					force: true,
				});

				await Post.deleteMany({ owner: userID });

				await Post.updateMany({ likes: userID }, { $pull: { likes: userID } });

				await Message.deleteMany({ $or: [{ from: userID }, { to: userID }] });

				await User.updateMany(
					{ _id: { $in: user.following } },
					{ $pull: { followers: userID } }
				);

				await User.updateMany(
					{ _id: { $in: user.followers } },
					{ $pull: { following: userID } }
				);

				await Message.deleteMany({ $or: [{ from: userID }, { to: userID }] });

				await user.deleteOne();

				delete connectedSockets[key];

				// write txt
				fs.writeFileSync(fileName, JSON.stringify(connectedSockets));
			}
		}
	}
}, secondsToCheck);

// async function deleteAllUsers() {
// 	const users = await User.find().sort({ _id: 1 });

// 	users.forEach(async (user) => {
// 		if (!user || exceptions.includes(user._id.toString())) {
// 			return;
// 		}
// 		const userID = user._id.toString();

// 		let path: string;
// 		if (process.env.NODE_ENV === "production") {
// 			path = "client/production/images/" + userID;
// 		} else {
// 			path = "client/public/images/" + userID;
// 		}

// 		fs.rmSync(path, {
// 			recursive: true,
// 			force: true,
// 		});

// 		await Post.deleteMany({ owner: userID });

// 		await Post.updateMany({ likes: userID }, { $pull: { likes: userID } });

// 		await Message.deleteMany({ $or: [{ from: userID }, { to: userID }] });

// 		await User.updateMany(
// 			{ _id: { $in: user.following } },
// 			{ $pull: { followers: userID } }
// 		);

// 		await User.updateMany(
// 			{ _id: { $in: user.followers } },
// 			{ $pull: { following: userID } }
// 		);

// 		await Message.deleteMany({ $or: [{ from: userID }, { to: userID }] });

// 		await user.deleteOne();
// 	});
// }
// deleteAllUsers();
