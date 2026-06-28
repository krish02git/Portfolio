const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,           
  content: String,         
  tags: [String],          
  likes: {
    type: Number,
    default: 0             
  },
  likedIPs: {
    type: [String],
    default: []
  },
  links: [String],         
  createdAt: {
    type: Date,
    default: Date.now      
  }
});

module.exports = mongoose.model('Blog', blogSchema);
