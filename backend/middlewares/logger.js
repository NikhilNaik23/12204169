import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendLog = async (stack, level, pkg, message) => {
  try {
    await axios.post(
      process.env.LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.error("Logging to failed:", err.message);
  }
};

export default (req, res, next) => {
  req.log = (level, pkg, msg) => sendLog("backend", level, pkg, msg);
  req.logError = (msg) => sendLog("backend", "error", "middleware", msg);
  req.logFatal = (msg) => sendLog("backend", "fatal", "middleware", msg);
  req.logInfo = (msg) => sendLog("backend", "info", "middleware", msg);

  next();
};
