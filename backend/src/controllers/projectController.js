const Project = require('../models/projects');
const Profile = require('../models/profile');
const bcrypt = require('bcryptjs');

exports.getProject = async (req, res) => {
    try {
        let projectDoc = await Project.findOne();
        if (!projectDoc) {
            return res.status(200).json({ projects: [] });
        }

        const formattedProjects = projectDoc.projects.map(proj => ({
            id: proj._id, // The frontend will use this as projId
            title: proj.title,
            type: proj.type,
            description: proj.description,
            githubLink: Array.isArray(proj.githubLink) ? proj.githubLink : (proj.githubLink ? [proj.githubLink] : []),
            liveLink: proj.liveLink,
            technologies: proj.technologies,
            features: proj.features,
            responsibilities: proj.responsibilities,
            startDate: proj.startDate,
            endDate: proj.endDate
        }));

        res.status(200).json({ projects: formattedProjects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
};

exports.getProjectId = async (req, res) => {
    try {
        let projectDoc = await Project.findOne();
        if (!projectDoc) {
            return res.status(200).json({ ids: [] });
        }
        const ids = projectDoc.projects.map(proj => proj._id);
        res.status(200).json({ ids });
    } catch (error) {
        res.status(500).json({ message: "Error fetching project IDs", error: error.message });
    }
};

exports.newProject = async (req, res) => {
    try {
        const projectData = req.body;
        const { title, type, description, githubLink, technologies, startDate, endDate } = projectData;

        // Basic validation for required fields
        if (!title || !type || !description || !githubLink || (Array.isArray(githubLink) && githubLink.length === 0) || !technologies || !startDate || !endDate) {
             return res.status(400).json({ message: "Required fields missing (title, type, description, githubLink, technologies, startDate, endDate)" });
        }
        
        let projectDoc = await Project.findOne();
        if (!projectDoc) {
            projectDoc = new Project({ projects: [] });
        }

        projectDoc.projects.push(projectData);
        await projectDoc.save();

        res.status(201).json({ message: "Project added successfully", projectDoc });
    } catch (error) {
        res.status(500).json({ message: "Error adding project", error: error.message });
    }
};

exports.previousEdit = async (req, res) => {
    try {
        const { projId } = req.params;
        const updateData = req.body;
        const { title, type, description, githubLink, technologies, startDate, endDate } = updateData;

        if (!title || !type || !description || !githubLink || (Array.isArray(githubLink) && githubLink.length === 0) || !technologies || !startDate || !endDate) {
             return res.status(400).json({ message: "Required fields missing for update" });
        }

        const projectDoc = await Project.findOne();
        if (!projectDoc) {
            return res.status(404).json({ message: "Project document not found" });
        }

        const projIndex = projectDoc.projects.findIndex(proj => proj._id.toString() === projId);
        if (projIndex === -1) {
            return res.status(404).json({ message: "Project not found" });
        }

        projectDoc.projects[projIndex] = { ...projectDoc.projects[projIndex].toObject(), ...updateData };
        await projectDoc.save();

        res.status(200).json({ message: "Project updated successfully", projectDoc });
    } catch (error) {
        res.status(500).json({ message: "Error updating project", error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { projId } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Admin password is required to delete project" });
        }

        // Verify admin password
        const adminProfile = await Profile.findById(req.user._id);
        if (!adminProfile) {
            return res.status(404).json({ message: "Admin profile not found" });
        }

        const isMatch = await bcrypt.compare(password, adminProfile.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect admin password" });
        }

        const projectDoc = await Project.findOne();
        if (!projectDoc) {
            return res.status(404).json({ message: "Project document not found" });
        }

        projectDoc.projects = projectDoc.projects.filter(proj => proj._id.toString() !== projId);
        await projectDoc.save();

        res.status(200).json({ message: "Project deleted successfully", projectDoc });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error: error.message });
    }
};
