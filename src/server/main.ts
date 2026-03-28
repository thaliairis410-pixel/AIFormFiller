import express from "express";
import ViteExpress from "vite-express";
import apiRouter from "./routes/api.route.js";
import "dotenv/config";
import { QueuingService } from "./services/queue.service.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.get("/healthz", (_, res) => {
  res.send("Server is healthy");
});

ViteExpress.listen(app, 3000, () => {
  console.log("Server is listening on port 3000...");
  QueuingService.start();
});
