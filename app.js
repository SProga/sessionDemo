require("dotenv").config();

const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const ejsMate = require("ejs-mate");

const sessionConfig = {
  secret: "thisisnotagoodsecret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
};

app.engine("ejs", ejsMate);
app.use(session(sessionConfig));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//whenever you have this middle ware set up on every request object
//incoming request will have a session property available
//resave is a value that defaults to true , don't use default set manually
//set resave to false
//CONST
const cart = new Array();
PRODUCT_PRICES = { Banana: 7, Apple: 3, WaterMelon: 1, Kiwi: 3, Grapes: 5 };
app.use((req, res, next) => {
  res.locals.cart = req.session.cart;
  next();
});

const allProducts = [
  { name: "Banana", type: "fruit", price: 7, img: "bananas.svg" },
  { name: "Apple", type: "fruit", price: 3, img: "apple.svg" },
  { name: "WaterMelon", type: "fruit", price: 1, img: "watermelon.svg" },
  { name: "Kiwi", type: "fruit", price: 3, img: "kiwi.svg" },
  { name: "Grapes", type: "fruit", price: 5, img: "grapes.svg" },
];

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/products", (req, res) => {
  console.log(product);
  res.send(req.session.cart);
});

app.get("/products/all", (req, res) => {
  res.status(200).send(allProducts);
});

app.post("/cart", (req, res) => {
  const product = req.body.cart.product;
  const filter = allProducts.filter((item) => item["name"] === product);
  const item = filter[0];
  const isAdded = cart.includes(item);
  if (!isAdded) {
    item.qty = 1;
    cart.push(item);
  } else {
    item.qty++;
    item.price = item.price + PRODUCT_PRICES[item["name"]];
  }
  req.session.cart = cart;
  res.send(item);
});

app.get("/cart/all", (req, res) => {
  const products = req.session.cart;
  res.send(products);
});

app.post("/cart/removeItem", (req, res) => {
  const product = req.body.cart.product;
  const filter = cart.filter((item) => item["name"] === product);
  const item = filter[0];

  if (cart && cart.length > 0) {
    if (item.qty > 0) {
      item.qty--;
      item.price = item.price - PRODUCT_PRICES[item["name"]];
    }
    if (item.qty == 0) {
      const index = cart.findIndex((item) => item["name"] === product);
      cart.splice(index, 1);
      item.price = PRODUCT_PRICES[item["name"]];
    }
    req.session.cart = cart;
  } else {
    req.session.cart = null;
  }
  res.send(item);
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});

// app.get("/viewcount", (req, res) => {
//     if (req.session.count) {
//       req.session.count += 1;
//     } else {
//       req.session.count = 1;
//     }
//     res.send(`you have viewed this page ${req.session.count} times`);
//   });

//   app.get("/register", (req, res) => {
//     const { username = "Anonymous" } = req.query;
//     req.session.username = username;
//     res.redirect("/greet");
//   });

//   app.get("/greet", (req, res) => {
//     const { username } = req.session;
//     res.send(`Welcome back, ${username}`);
//   });
