const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://strole:Split123@cluster0.a19xz.mongodb.net/drumre", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var movieSchema = mongoose.Schema({
    uid: String,
    title: String,
    user_vote: String,
    overview: String,
    relaseDate: String,
    image: String
});

module.exports = mongoose.model('Movie', movieSchema);