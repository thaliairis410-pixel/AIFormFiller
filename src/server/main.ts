import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/healthz", (_, res) => {
	res.send("Server is healthy");
});

ViteExpress.listen(app, 3000, () =>
	console.log("Server is listening on port 3000..."),
);
