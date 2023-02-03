import express, { Application } from "express";
import config from "config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import newsRoutes from "./routes/newsRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import friendsRoutes from "./routes/friendsRoutes";
import usersRoutes from "./routes/usersRoutes";
import followRoutes from "./routes/followRoutes";
import donationsRoutes from "./routes/donationsRoutes";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import socket from "./socket";
import cors from "cors";
import path from "path";

const app: Application = express();

if (process.env.NODE_ENV === "development") {
	app.use(cors({ credentials: true, origin: true }));
}

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/donations", donationsRoutes);

if (process.env.NODE_ENV === "production") {
	app.use("/", express.static(path.join(__dirname, "../client/production")));
	app.use((req, res, next) => {
		res.sendFile(path.join(__dirname, "../client/production/index.html"));
	});
}

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: true,
		methods: ["GET", "POST"],
	},
});
socket(io);

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
