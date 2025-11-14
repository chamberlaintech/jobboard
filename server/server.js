import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import authenticateUser from "./middleware/auth.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import errorHandlerMiddleware from "./middleware/error-handler.js";
import helmet from "helmet";

dotenv.config();

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet());

app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", authenticateUser, applicationRoutes)
app.use("/api/dashboard", authenticateUser, dashboardRoutes)

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`Server is listening on port ${PORT}...`))        
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

start()