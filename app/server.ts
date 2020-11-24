import express, { NextFunction } from "express";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import CombineRoutes from "./routes/CombineRoutes";
import config from "./config/config";
import bodyParser from "body-parser";
import { MulterError } from "multer";
import passport from "passport";
import jwtPass from "./auth/passport";

// app declarations and constants //
const app: express.Application = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8080;
const server: http.Server = http.createServer(app);
const Router: express.Router = express.Router();
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  user: config.dbSettings.username,
  pass: config.dbSettings.password
};

mongoose.connect(config.dbSettings.mongoURI, mongoOptions, (err) => {
  if (err) { console.error(err); }
});
mongoose.connection.once("open", () => {
  app.emit("dbReady");
});

app.use(jsonParser);
app.use(urlEncodedParser);
// passport authentication //
app.use(passport.initialize());
jwtPass(passport);



// 

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
app.use(function (err: MulterError, req: Express.Request, res: Express.Response, next: NextFunction ) {
  console.log('This is the invalid field ->', err.field);
  next(err);
});


app.on("dbReady", () => {
  server.listen(PORT, () => {
    console.info(`Listening at PORT: ${PORT}`);
    //createImages("Product")
  });
});

export default app;
