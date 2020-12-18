const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdm: {
    type: String,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: true
  },
  // Secundary
  birth: {
    type: Date
  },
  gender: {
    type: String
  },
  profession: {
    type: String
  }
});

mongoose.model("users", User);
