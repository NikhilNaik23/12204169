import crypto from "crypto";

const urls = new Map();
const clickStats = new Map();

const generateShortCode = () => crypto.randomBytes(3).toString("hex");

export const createShortUrl = (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== "string") {
    req.logError("Invalid or missing URL in request body");
    return res.status(400).json({ error: "URL is required" });
  }

  let code = shortcode || generateShortCode();

  if (urls.has(code)) {
    if (!shortcode) {
      code = generateShortCode();
    } else {
      req.log("error", "controller", `Shortcode '${code}' already exists`);
      return res.status(409).json({ error: "Shortcode already taken" });
    }
  }

  const createdAt = new Date();
  const expiryDate = new Date(createdAt.getTime() + validity * 60_000);

  urls.set(code, {
    url,
    createdAt,
    expiry: expiryDate,
    shortcode: code,
  });

  req.logInfo(`Shortened URL: '${url}' → /shorturls/${code}`);

  return res.status(201).json({
    shortlink: `http://localhost:5000/shorturls/${code}`,
    expiry: expiryDate.toISOString(),
  });
};

export const redirectShortUrl = (req, res) => {
  const { shortcode } = req.params;
  const data = urls.get(shortcode);

  if (!data) {
    req.logError(`Redirection failed. Shortcode '${shortcode}' not found`);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const now = new Date();
  if (now > data.expiry) {
    req.log("warn", "controller", `Attempted access to expired shortcode '${shortcode}'`);
    return res.status(410).json({ error: "Shortcode expired" });
  }

  const click = {
    timestamp: now.toISOString(),
    source: req.headers["user-agent"] || "unknown",
  };

  if (!clickStats.has(shortcode)) {
    clickStats.set(shortcode, []);
  }

  clickStats.get(shortcode).push(click);
  req.logInfo(`Redirected to '${data.url}' from shortcode '${shortcode}'`);

  return res.redirect(data.url);
};

export const getShortUrlStats = (req, res) => {
  const { shortcode } = req.params;
  const data = urls.get(shortcode);

  if (!data) {
    req.logError(`Stats requested for unknown shortcode '${shortcode}'`);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const clicks = clickStats.get(shortcode) || [];

  req.logInfo(`Stats returned for shortcode '${shortcode}'`);

  return res.json({
    url: data.url,
    createdAt: data.createdAt.toISOString(),
    expiry: data.expiry.toISOString(),
    totalClicks: clicks.length,
    clickDetails: clicks,
  });
};
