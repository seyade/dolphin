import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import getRepoContent from "./getRepoContent";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/api/dolphin/v1/", getRepoContent);

app.listen(PORT, () =>
	console.log(`Dolphin project server running on dev environment port: ${PORT}`)
);
