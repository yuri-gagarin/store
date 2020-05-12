import express from "express";
import http from "http";
// import path from "path";
import combinedRoutes from "./routes/combinedRoutes";
// app declarations and constants //
const app: express.Application = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8080;
const server: http.Server = http.createServer(app);
const Router: express.Router = express.Router();
// setup routes and initialize router //
combinedRoutes(Router);
app.use(Router);
// end routes setup //
server.listen(PORT, () => {
  console.info(`Listening at PORT: ${PORT}`);
});