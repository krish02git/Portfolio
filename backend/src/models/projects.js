const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  githubLink: [String],
  liveLink: String,
  technologies: [String],
  features: [String],
  responsibilities: [String],
  startDate: String,
  endDate: String,
});

const projectsWrapperSchema = new mongoose.Schema({
  projects: [projectSchema]
});

module.exports = mongoose.model('Project', projectsWrapperSchema);
