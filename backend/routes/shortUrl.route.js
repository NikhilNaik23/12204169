import express from "express";
import {
  createShortUrl,
  redirectShortUrl,
  getShortUrlStats,
} from "../controllers/shortUrl.controller.js";

const router = express.Router();

router.post("/", createShortUrl);
router.get("/:shortcode", redirectShortUrl);
router.get("/:shortcode/stats", getShortUrlStats);

export default router;
