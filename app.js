//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://admin-shivanshu:shivanshu-98@cluster0.duuterm.mongodb.net/blogDB"
  );
}

const homeStartingContent =
  "Welcome to my digital abode! This is a place where technology, creativity, and passion converge to create a world of boundless possibilities. Here, you'll find articles, stories, and resources that cater to both the technical and non-technical aspects of life. Whether you're a technophile or an adventurous soul, I invite you to explore, learn, and connect.";
const aboutContent =
  "Welcome to my blog! I'm a software engineer with a passion for technology, creativity, and exploration. In this blog, I'll share my thoughts on a variety of topics, from technical insights to wildlife encounters. I hope you'll join me on this journey as we explore the boundaries of technology, creativity, and the natural world.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

let blogs;

app.get("/", async function (req, res) {
  await Blog.find()
    .then(function (result) {
      blogs = result;
    })
    .catch(function (err) {
      console.log(err);
    });
  res.render("home", {
    startingContent: homeStartingContent,
    posts: blogs,
  });
  console.log(blogs);
});

app.get("/about", function (req, res) {
  res.render("about", { startingContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { startingContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const title = req.body.postTitle;
  const content = req.body.postBody;

  const blog = new Blog({
    title: title,
    content: content,
  });

  blog
    .save()
    .then(function (result) {
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/:postId", function (req, res) {
  const requqestedBlogId = req.params.postId;
  Blog.findOne({ _id: requqestedBlogId })
    .then(function (blog) {
      res.render("post", {
        title: blog.title,
        content: blog.content,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
