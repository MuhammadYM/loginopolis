const express = require("express");
const app = express();
const { User } = require("./db");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  try {
    res.send(
      "<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>"
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = new User(req.body);
    let hashedPassword = await bcrypt.hash(password, 9);
    const user = await User.create({ username, password: hashedPassword });
    res.send(`successfully created user ${username}`);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.send("User doesn't exist");
    }

    const matcher = await bcrypt.compare(password, user.password);
    // console.log(password);
    // console.log(hashedPassword);
    if (matcher) {
      res.send(`successfully logged in user ${username}`);
    } else {
      res.send(`incorrect username or password`);
    }
  } catch (error) {
    res.status(200).json();
    console.log(error);
  }
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

// we export the app, not listening in here, so that we can run tests
module.exports = app;
