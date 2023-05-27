const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);
app.use(express.json());

app.post("/", async (req, res, next) => {
  let { url, format } = req.body;
  try {
    if (!ytdl.validateURL(url)) throw new Error("Wrong URL");

    let file;

    switch (format) {
      case "mp4":
        file = ytdl(url, {
          quality: "highest",
          filter: "audioandvideo",
        });
        break;
      case "mp3":
        file = ytdl(url, {
          quality: "highestaudio",
          filter: "audioonly",
        });
        break;
      default:
        throw new Error("Unsupported format");
    }
    let info = await ytdl.getBasicInfo(url);
    file.pipe(fs.createWriteStream(`${info.videoDetails.title}.${format}`));

    let filePath = path.join(__dirname, `${info.videoDetails.title}.${format}`);

    var readStream = fs.createReadStream(filePath);

    readStream.pipe(res);

    res.send(info.videoDetails).status(200);
  } catch (err) {
    next(err);
  }
});

app.use((error, req, res, next) => {
  if (error.status) res.status(error.status);
  else res.status(500);

  res.json({ message: error.message, stack: error.stack });
});

const port = 5000;
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
