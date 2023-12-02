const { Router } = require("express");
const blogModel = require("../models/blog");
const commentModel = require("../models/comment");
const multer = require("multer");
const path = require("path");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const { title, body } = req.body;

  const newBlogObj = await blogModel.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`/blog/${newBlogObj._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await blogModel.findById(req.params.id).populate("createdBy");
  const comments = await commentModel
    .find({ blogId: req.params.id })
    .populate("createdBy");

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

// comments
router.post("/comment/:blogId", async (req, res) => {
  await commentModel.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
