const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://strole:Split123@cluster0.a19xz.mongodb.net/drumre", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var userSchema = mongoose.Schema({
    uid: String,
    token: String,
    email: String,
    name: String,
    pic: String
});

module.exports = mongoose.model('User', userSchema);