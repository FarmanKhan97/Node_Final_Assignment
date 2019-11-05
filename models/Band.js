const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const BandSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('bands', BandSchema);