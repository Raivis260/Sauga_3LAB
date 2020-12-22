const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    }});

const User = mongoose.model('User', userSchema);

exports.User = User;