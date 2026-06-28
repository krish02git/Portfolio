const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: String,           // manual
  jobType: String,           // "Working", "Internship", "Freelance" etc
  role: String,              // manual
  startDate: String,         // "date/month/year"
  endDate: String,           // date/month/year else option of "Present" // still working 
  location: String,          // "Hyderabad, India (On-Site)"
  technologies: [String],    
  responsibilities: [String] 
});

const workSchema = new mongoose.Schema({
  experience: [experienceSchema]
});

module.exports = mongoose.model('Work', workSchema);
