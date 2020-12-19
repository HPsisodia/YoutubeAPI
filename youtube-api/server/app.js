const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const app = express();

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 7 requests,
  });
  app.use(limiter);


///////Importing routes

const playlistRoutes = require("./routes/playlist");

app.use('/api',playlistRoutes);


const PORT = 3030;
const DBURL = "mongodb://localhost:27017/superskool"

mongoose
  .connect(DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Application is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });  