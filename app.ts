import express, { Application } from "express";
import config from "config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import friendsRoutes from "./routes/friendsRoutes";
import usersRoutes from "./routes/usersRoutes";
import followRoutes from "./routes/followRoutes";
import bodyParser from "body-parser";

const app: Application = express();

// dev
import cors from "cors";
app.use(cors({ credentials: true, origin: true }));
// /dev

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/follow", followRoutes);

const PORT = config.get("port") || 80;

async function start() {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(config.get("mongoUri"));
		app.listen(PORT, () => console.log("Server running, port: ", PORT));
	} catch (e: unknown) {
		console.log("Server error: ", e);
		process.exit(1);
	}
}

start();
