import express from "express";
import http from "http";
import path from "path";
import combinedRoutes from "./routes/combinedRoutes";
// app declarations and constants //
const app: express.Application = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8080;
const server: http.Server = http.createServer(app);
const Router: express.Router = express.Router();

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '/../client/build')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, "/../client/src")));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/public/index.html'));
  });
}
// static files and images //
app.use(express.static(path.join(__dirname, "/../public")));

// setup routes and initialize router //
combinedRoutes(Router);
app.use(Router);
// end routes setup //

server.listen(PORT, () => {
  console.info(`Listening at PORT: ${PORT}`);
});