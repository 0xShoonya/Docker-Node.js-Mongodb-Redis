const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis").default;

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

let redisClient = redis.createClient({
  socket: {
    host: "redis",
    port: 6379,
  },
});

(async () => {
  await redisClient.connect();
})();

let store = new RedisStore({
  client: redisClient,
  session: session,
});

redisClient.on("error", function (error) {
  console.error("Redis client error:", error);
});

redisClient.on("connect", function () {
  console.log("Redis client connected");
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable("trust proxy");

app.use(
  session({
    store: store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi There</h2>");
  console.log("yeah it ran!");
});

//localhost:3000/api/v1/posts/
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
