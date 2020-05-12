import express from "express";
import http from "http";
// import path from "path";

const app: express.Application = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8080;
const server: http.Server = http.createServer(app);

server.listen(PORT, () => {
  console.info(`Listening at PORT: ${PORT}`);
});