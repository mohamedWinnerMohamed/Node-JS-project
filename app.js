const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/Article");
const app = express();
require("dotenv").config();
// userName : MohamedOmar
// Password : Omar123
// mongodb+srv://MohamedOmar:<db_password>@cluster0.u5zne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected successfully");
  })
  .catch((error) => {
    console.log("Connection failed", error);
  });

app.use(express.json());

// to send response as a string
app.get("/hello", (req, res) => {
  res.send("Hello Omar");
});

// to send welcome response
app.get("/", (req, res) => {
  res.send("Hello in Node JS project");
});

// Path Params
app.get("/sendNumbers/:num1/:num2", (req, res) => {
  const num1 = req.params.num1;
  const num2 = req.params.num2;
  const total = parseInt(num1) + parseInt(num2);
  res.send(`The sum of ${num1} and ${num2} is ${total}`);
});

// Body Params
app.get("/sayHello", (req, res) => {
  const name = req.body.name;
  res.send(`Hello ${name}`);
});

// Query Params
app.get("/printAge", (req, res) => {
  const age = req.query.age;
  res.send(`Your age is ${age}`);
});

// to send response as a JSON object
app.get("/sendJSON", (req, res) => {
  res.json({ name: req.body.name, age: req.body.age });
});

// to send response as a file
app.get("/sendFile", (req, res) => {
  res.sendFile(__dirname + "/views/test.html");
});

// EJS
app.get("/renderNumbers", (req, res) => {
  let numbers = "";
  for (let i = 0; i <= 100; i++) {
    numbers += i + " - ";
  }
  res.render("index.ejs", {
    name: "Omar",
    numbers: numbers,
  });
});

// Article Endpoints
// send Article
app.post("/articles", async (req, res) => {
  const newArticle = new Article();
  newArticle.title = req.body.title;
  newArticle.body = req.body.description;
  newArticle.numberOfLikes = 0;
  await newArticle.save();
  res.json(newArticle);
});

// get all Articles
app.get("/articles", async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// get a specific Article
app.get("/articles/:articleId", async (req, res) => {
  const id = req.params.articleId;
  try {
    const article = await Article.findById(id);
    res.json(article);
    return;
  } catch (error) {
    console.log("error while reading article of id ", id);
    return res.json(error);
  }
});

// delete a specific Article
app.delete("/articles/:articleId", async (req, res) => {
  const id = req.params.articleId;
  try {
    const article = await Article.findByIdAndDelete(id);
    res.json(article);
    return;
  } catch (error) {
    console.log("error while reading article of id ", id);
    return res.json(error);
  }
});

// to show Articles in HTML
app.get("/showArticles", async (req, res) => {
  const articles = await Article.find();
  res.render("articles.ejs", {
    allArticles: articles,
  });
});

// to run the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
