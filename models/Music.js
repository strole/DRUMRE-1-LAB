const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://strole:Split123@cluster0.a19xz.mongodb.net/drumre", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var musicSchema = mongoose.Schema({
    uid: String,
    name: String,
    url: String,
    artist: String,
    image: String
});

module.exports = mongoose.model('Music', musicSchema);