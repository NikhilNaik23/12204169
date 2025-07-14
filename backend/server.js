import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shortUrlRoutes from "./routes/shortUrl.route.js";
import logger from "./middlewares/logger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/shorturls", shortUrlRoutes);

app.use((req, res) => {
  const msg = `Route ${req.originalUrl} not found`;
  req.logError(msg);
  res.status(404).json({ message: msg });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
