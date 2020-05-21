import express from "express";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import CombineRoutes from "./routes/CombineRoutes";
import config from "./config/config";
// app declarations and constants //
const app: express.Application = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8080;
const server: http.Server = http.createServer(app);
const Router: express.Router = express.Router();

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  user: config.dbSettings.username,
  pass: config.dbSettings.password
}
mongoose.connect(config.dbSettings.mongoURI, mongoOptions, (err) => {
  if (err) { console.error(err)};
});
mongoose.connection.once("open", () => {
  console.info("DB Connected");
  app.emit("dbReady");
});

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
new CombineRoutes(Router);
app.use(Router);
// end routes setup //

app.on("dbReady", () => {
  server.listen(PORT, () => {
    console.info(`Listening at PORT: ${PORT}`);
    console.log(config)
  });
});
