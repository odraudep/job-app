const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  isAdm: {
    type: String,
    default: 0
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Secundary
  beHired: {
    type: String
  },
  birth: {
    type: String
  },
  contact: {
    type: String
  },
  gender: {
    type: String
  },
  nacionality: {
    type: String
  },
  profession: {
    type: String
  }
});

mongoose.model("users", User);
