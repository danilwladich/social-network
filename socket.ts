import config from "config";
import { Server } from "socket.io";
import axios from "axios";
import jwt from "jsonwebtoken";

export default (io: Server) => {
	let connectedSockets: { socketID: string; userID: string }[] = [];

	io.sockets.on("connection", (socket) => {
		// connected
		socket.on("connected", (data) => {
			const decoded = jwt.verify(
				data.token,
				config.get("jwtSecret")
			) as jwt.JwtPayload;

			connectedSockets[data.nickname] = {
				socketID: socket.id,
				userID: decoded.userID,
			};
			console.log(connectedSockets);
		});

		// send message
		socket.on("sendMessage", async (data) => {
			if (connectedSockets[data.from]) {
				const res = await axios.post("http://localhost:80/api/messages", {
					fromUserID: connectedSockets[data.from].userID,
					toUserNickname: data.to,
					message: data.message,
				});

				const { success, statusText, message, fromUser } = res.data;

				if (success) {
					if (connectedSockets[data.to]) {
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
									id: data.from,
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
						statusText,
					});
				}
			}
		});

		// read message
		socket.on("readMessages", async (data) => {
			if (connectedSockets[data.who]) {
				const res = await axios.put("http://localhost:80/api/messages/read", {
					whoUserID: connectedSockets[data.who].userID,
					whomUserNickname: data.whom,
				});

				const { success, statusText } = res.data;

				if (success) {
					if (connectedSockets[data.whom]) {
						io.sockets
							.to(connectedSockets[data.whom].socketID)
							.emit("messagesRead", { userID: data.who });
					}
				} else {
					io.sockets.to(connectedSockets[data.who].socketID).emit("error", {
						statusText,
					});
				}
			}
		});
	});
};
