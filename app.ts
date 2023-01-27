import express, { Application } from "express";
import config from "config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import friendsRoutes from "./routes/friendsRoutes";
import usersRoutes from "./routes/usersRoutes";
import followRoutes from "./routes/followRoutes";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import axios from "axios";

const app: Application = express();

// dev
import cors from "cors";
app.use(cors({ credentials: true, origin: true }));
// /dev

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/follow", followRoutes);

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: true,
		methods: ["GET", "POST"],
	},
});

let connectedSockets: string[] = [];

io.sockets.on("connection", (socket) => {
	socket.on("connected", (data) => {
		connectedSockets[data] = socket.id;
	});

	socket.on("sendMessage", async (data) => {
		const res = await axios.post("http://localhost:80/api/messages", {
			from: data.from,
			to: data.to,
			message: data.message,
		});

		const { success, message, fromUser } = res.data;

		if (success) {
			io.sockets.to(connectedSockets[data.to]).emit("receiveMessage", {
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

			io.sockets.to(connectedSockets[data.from]).emit("messageSent", {
				oldID: data.id,
				newID: message._id,
			});
		}
	});

	socket.on("readMessages", async (data) => {
		const res = await axios.put("http://localhost:80/api/messages/read", {
			whom: data.whom,
		});

		const { success } = res.data;

		if (success) {
			io.sockets
				.to(connectedSockets[data.whom])
				.emit("messagesRead", { userID: data.who });
		}
	});
});

const PORT = config.get("port") || 80;

async function start() {
	try {
		mongoose.set("strictQuery", false);

		mongoose.connect(config.get("mongoUri"));

		server.listen(PORT, () => console.log("Server running, port: ", PORT));
	} catch (e: unknown) {
		console.log("Server error: ", e);
		process.exit(1);
	}
}

start();
