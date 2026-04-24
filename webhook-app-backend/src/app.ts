import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { sequelize } from "./config/db";

const app = express();
app.use(cors());
app.use(express.json());

sequelize.sync() // creates table
  .then(() => console.log("DB connected "))
  .catch(err => console.log(err));


app.use("/auth", authRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));