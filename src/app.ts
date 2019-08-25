import * as express from "express";
import { Application } from "express";
import { NextFunction } from "connect";
import * as passport from "passport";
import * as keys from "../keys/conf.json";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import SocketIO = require("socket.io");
import * as session from "express-session";
// routes
import userRouter from "./routes/user";
import friendRouter from "./routes/friend";
import messageRouter = require("./routes/message");

const SessionStore = require("connect-mongodb-session")(session);
const store = new SessionStore({
  uri: keys.mongodb_con_string,
  collection: "sessions"
});

class App {
  public app: Application;
  public dbURI: string;
  public PORT: number | string;
  public server: any;
  public express_session: any;
  public io: any;
  public Server: any;

  constructor() {
    this.app = express();
    this.dbURI = keys.mongodb_con_string;
    this.PORT = process.env["PORT"] || 8000;
    this.express_session = session({
      secret: keys.mongodb_session_secret,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
      store: store,
      resave: false,
      saveUninitialized: true
    });
    this.app.use(this.express_session);
    this._init();
  }

  private initDatabase() {
    mongoose
      .connect(this.dbURI, { useNewUrlParser: true })
      .then(
        (): void => {
          console.log("DB connection status: Success");
        }
      )
      .catch(
        (): void => {
          console.log("DB connection status: Failed");
        }
      );
    mongoose.set("useFindAndModify", false);
  }

  public createServer() {
    const server = this.app.listen(
      this.PORT,
      (): void => {
        console.log(`listening to port ${this.PORT} . . . `);
      }
    );
    this.io = SocketIO(server);
    this.initWebSocket();
  }

  private initWebSocket() {
    let connected_clients: Array<any> = [];
    this.app.set("io", this.io);
    this.app.set("io_clients", connected_clients);
    this.io.use((socket: any, next: any) => {
      this.express_session(socket.request, {}, next);
    });
    this.io.set("authorization", (data: any, callback: any) => {
      if (data.session.passport.user) {
        callback(null, true);
      }
    });

    this.io.use((socket: any, next: NextFunction) => {
      this.express_session(socket.request, {}, next);
    });

    this.io.sockets.on("connection", (socket: any) => {
      connected_clients.push({
        connection_id: socket.id,
        client_id: socket.request.session.passport.user
      });
      console.log("%s socket/s connected", connected_clients.length);

      socket.on("disconnect", (data: any) => {
        connected_clients.splice(connected_clients.indexOf(data.id), 1);
      });

      require("./sockets/friend")(this.io, socket);
    });
    console.log(connected_clients)
  }

  private _init() {
    this.initDatabase();
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // passport strategies
    require("./config/passport-config");

    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use("/api/user", userRouter.preparedRoutes());
    this.app.use("/api/friend", friendRouter.preparedRoutes());
    // this.app.use("/api/message", messageRouter)
  }
}

const main = new App();
main.createServer()
