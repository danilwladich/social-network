import config from "config";
import { Server } from "socket.io";
import axios from "axios";
import jwt from "jsonwebtoken";

let baseURL: string;
if (process.env.NODE_ENV === "production") {
	baseURL = "http://46.41.137.197/api/";
} else {
	baseURL = "http://localhost:80/api/";
}

export let connectedSockets: { socketID: string; userID: string }[] = [];

export default (io: Server) => {
	io.sockets.on("connection", (socket) => {
		// connected
		socket.on("connected", (data) => {
			try {
				const decoded = jwt.verify(
					data.token,
					config.get("jwtSecret")
				) as jwt.JwtPayload;

				connectedSockets[data.nickname] = {
					socketID: socket.id,
					userID: decoded.userID,
				};

				console.log(" ");
				console.log(" ");
				console.log("Users: " + Object.keys(connectedSockets).join(" , "));
				console.log("Online: " + Object.keys(connectedSockets).length);
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
					if (connectedSockets[data.whom]) {
						io.sockets
							.to(connectedSockets[data.whom].socketID)
							.emit("messagesRead", { userID: data.who });
					}
				} else {
					io.sockets.to(connectedSockets[data.who].socketID).emit("error", {
						statusText: "Read messages: " + statusText,
					});
				}
			}
		});

		// nickname changed
		socket.on("nicknameChanged", (data) => {
			if (connectedSockets[data.nickname]) {
				delete connectedSockets[data.nickname];
			}
		});

		// disconnect
		socket.on("disconnect", (data) => {
			for (let key in connectedSockets) {
				if (connectedSockets[key].socketID === socket.id) {
					delete connectedSockets[key];
				}
			}
		});
	});
};
