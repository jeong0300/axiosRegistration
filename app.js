const express = require("express");
const multer = require("multer");

const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    cb(null, filename + ext);
  },
});

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "static")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/axiosget", (req, res) => {
  console.log(req.query);
  console.log(req.file);
  res.send(req.query);
});

app.post("/axiospost", (req, res) => {
  let id = req.body.id;
  let storedId = req.body.storedId;
  let num;

  if (storedId.includes(id)) {
    num = 200;
  } else {
    num = 300;
  }

  res.send({ status: num });
});

app.post("/upload", upload.single("files"), (req, res) => {
  res.json({
    img: `/uploads/${req.file.filename}`,
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    detail: req.body.detail,
  });

  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
