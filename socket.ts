import config from "config";
import { Server } from "socket.io";
import axios from "axios";
import jwt from "jsonwebtoken";
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
	[nickname: string]: {
		socketID: string;
		userID: string;
		online: number | boolean;
	};
}

// parse json
export let connectedSockets = JSON.parse(
	connectedSocketsTxt || "{}"
) as IConnectedSockets;

function writeConnectedSockets() {
	fs.writeFileSync(fileName, JSON.stringify(connectedSockets));
}

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

				writeConnectedSockets();
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

				const { success, statusText, items } = res.data;
				const { message, fromUser } = items;

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

				writeConnectedSockets();
			}
		});

		// logout
		socket.on("logout", (data) => {
			if (connectedSockets[data.nickname]) {
				connectedSockets[data.nickname].online = Date.now();

				connectedSockets[data.nickname].socketID = "";

				writeConnectedSockets();
			}
		});

		// logout
		socket.on("deleteAccount", (data) => {
			if (connectedSockets[data.nickname]) {
				delete connectedSockets[data.nickname];

				writeConnectedSockets();
			}
		});

		// disconnect
		socket.on("disconnect", (data) => {
			for (let nickname in connectedSockets) {
				if (connectedSockets[nickname].socketID === socket.id) {
					connectedSockets[nickname].online = Date.now();

					connectedSockets[nickname].socketID = "";

					writeConnectedSockets();
					break;
				}
			}
		});
	});
};

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
