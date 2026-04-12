import express from "express";
import { configDotenv } from "dotenv";
configDotenv({ path: "./config.env" });
import path from "path";
import { fileURLToPath } from "url";
import bookRouter from "./routes/bookRoute.js";
import AppError from "./utils/appError.js";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const staticFilePath = path.join(dirName, "public");

const app = express();

app.use(express.json());
app.use(express.static(staticFilePath));
console.log(staticFilePath);
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use("/api/v1/books", bookRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Does not exist ${req.originalUrl} on this server`));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
