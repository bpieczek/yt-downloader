const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const ytdl = require("ytdl-core");

const app = express();

app.use(cors());
app.use(morgan("tiny"));

app.use(express.json());

app.get("/", async (req, res, next) => {
  const url = req.query.url;
  const format = req.query.format;

  try {
    if (!ytdl.validateURL(url)) throw new Error("Unvalid URL");
    switch (format) {
      case "mp4":
        file = ytdl(url, {
          quality: "highest",
          filter: "audioandvideo",
        }).pipe(res);
        break;
      case "mp3":
        file = ytdl(url, {
          quality: "highestaudio",
          filter: "audioonly",
        }).pipe(res);
        break;
      default:
        throw new Error("Unsupported format");
    }
  } catch (err) {
    next(err);
  }
});

app.use((error, req, res, next) => {
  if (error.status) res.status(error.status);
  else res.status(500);

  res.json({ message: error.message });
});

const port = 5000;
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
