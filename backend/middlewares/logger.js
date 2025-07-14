import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MAX_LENGTH = 48;

const truncate = (str) => {
  return str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH) : str;
};

const sendLog = async (stack, level, pkg, message) => {
  const token = process.env.TOKEN?.trim();
  const logApi = process.env.LOG_API?.trim();

  if (!token || !logApi) {
    console.error("❌ Missing LOG_API or TOKEN in .env");
    return;
  }

  try {
    const payload = {
      stack: truncate(stack),
      level: truncate(level),
      package: truncate(pkg),
      message: truncate(message),
    };

    const response = await axios.post(logApi, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Log created:", response.data.message);
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error("❌ Logging failed:", status, data || err.message);
  }
};

export default (req, res, next) => {
  req.log = (level, pkg, msg) => sendLog("backend", level, pkg, msg);
  req.logError = (msg) => sendLog("backend", "error", "middleware", msg);
  req.logFatal = (msg) => sendLog("backend", "fatal", "middleware", msg);
  req.logInfo = (msg) => sendLog("backend", "info", "middleware", msg);
  next();
};
