import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let token_from_auth = null;

const getAuthToken = async () => {
  if (token_from_auth) return token_from_auth;

  try {
    const response = await axios.post(process.env.AUTH_API, {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    token_from_auth = response.data.token;
    console.log("✅ Auth token fetched");
    return token_from_auth;
  } catch (err) {
    console.error("❌ Failed to fetch token:", err.response?.data || err.message);
    return null;
  }
};

const MAX_LENGTH = 48;
const truncate = (str) => (str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH) : str);

const sendLog = async (stack, level, pkg, message) => {
  const token = await getAuthToken();
  const logApi = process.env.LOG_API?.trim();

  if (!token || !logApi) {
    console.error("❌ Missing LOG_API or TOKEN");
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
    console.error("❌ Logging failed:", err.response?.status, err.response?.data || err.message);
  }
};

export default (req, res, next) => {
  req.log = (level, pkg, msg) => sendLog("backend", level, pkg, msg);
  req.logError = (msg) => sendLog("backend", "error", "middleware", msg);
  req.logFatal = (msg) => sendLog("backend", "fatal", "middleware", msg);
  req.logInfo = (msg) => sendLog("backend", "info", "middleware", msg);
  next();
};
