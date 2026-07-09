import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/error/error.middleware.js";
import authRouter from "./router/auth.router.js";
import profileRouter from "./router/profile.router.js";
import systemAdminRouter from "./router/systemAdmin.router.js";
import floorRouter from "./router/floor.router.js";
import roomRouter from "./router/room.router.js";
import studentRouter from "./router/student.router.js";
import roomAllocationRouter from "./router/roomAllocation.router.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length
    ? (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      }
    : true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Active", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/v1/auth", authRouter);
// Profile routes
app.use("/api/v1/profile", profileRouter);
// System admin routes
app.use("/api/v1/system-admin", systemAdminRouter);
// Hostel admin routes
app.use("/api/v1/floors", floorRouter);
app.use("/api/v1/rooms", roomRouter);
// Student routes
app.use("/api/v1/students", studentRouter);
// Room allocation routes
app.use("/api/v1/room-allocations", roomAllocationRouter);





app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});
app.use(globalErrorHandler);
export default app;
