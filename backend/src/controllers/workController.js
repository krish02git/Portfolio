const Work = require('../models/work');
const Profile = require('../models/profile');
const bcrypt = require('bcryptjs');

exports.getWork = async (req, res) => {
    try {
        let workDoc = await Work.findOne();
        if (!workDoc) {
            return res.status(200).json({ experience: [] });
        }

        const formattedExperience = workDoc.experience.map(exp => ({
            id: exp._id, // The frontend will use this as expId
            company: exp.company,
            jobType: exp.jobType,
            role: exp.role,
            startDate: exp.startDate,
            endDate: exp.endDate,
            location: exp.location,
            technologies: exp.technologies,
            responsibilities: exp.responsibilities
        }));

        res.status(200).json({ experience: formattedExperience });
    } catch (error) {
        res.status(500).json({ message: "Error fetching work", error: error.message });
    }
};

exports.newWork = async (req, res) => {
    try {
        const experienceData = req.body;
        const { company, jobType, role, startDate, endDate, location } = experienceData;

        if (!company || !jobType || !role || !startDate || !endDate || !location) {
             return res.status(400).json({ message: "All fields (company, jobType, role, startDate, endDate, location) are required" });
        }
        
        let workDoc = await Work.findOne();
        if (!workDoc) {
            workDoc = new Work({ experience: [] });
        }

        workDoc.experience.push(experienceData);
        await workDoc.save();

        res.status(201).json({ message: "Work experience added successfully", workDoc });
    } catch (error) {
        res.status(500).json({ message: "Error adding work", error: error.message });
    }
};

exports.previousEdit = async (req, res) => {
    try {
        const { expId } = req.params;
        const updateData = req.body;
        const { company, jobType, role, startDate, endDate, location } = updateData;

        if (!company || !jobType || !role || !startDate || !endDate || !location) {
             return res.status(400).json({ message: "All fields (company, jobType, role, startDate, endDate, location) are required for update" });
        }

        const workDoc = await Work.findOne();
        if (!workDoc) {
            return res.status(404).json({ message: "Work document not found" });
        }

        const expIndex = workDoc.experience.findIndex(exp => exp._id.toString() === expId);
        if (expIndex === -1) {
            return res.status(404).json({ message: "Experience not found" });
        }

        // Update the specific fields
        workDoc.experience[expIndex] = { ...workDoc.experience[expIndex].toObject(), ...updateData };
        await workDoc.save();

        res.status(200).json({ message: "Work experience updated successfully", workDoc });
    } catch (error) {
        res.status(500).json({ message: "Error updating work", error: error.message });
    }
};

exports.deleteWork = async (req, res) => {
    try {
        const { expId } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Admin password is required to delete work" });
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

        const workDoc = await Work.findOne();
        if (!workDoc) {
            return res.status(404).json({ message: "Work document not found" });
        }

        workDoc.experience = workDoc.experience.filter(exp => exp._id.toString() !== expId);
        await workDoc.save();

        res.status(200).json({ message: "Work experience deleted successfully", workDoc });
    } catch (error) {
        res.status(500).json({ message: "Error deleting work", error: error.message });
    }
};

exports.getWorkId = async (req, res) => {
    try {
        let workDoc = await Work.findOne();
        if (!workDoc) {
            return res.status(200).json({ ids: [] });
        }
        const ids = workDoc.experience.map(exp => exp._id);
        res.status(200).json({ ids });
    } catch (error) {
        res.status(500).json({ message: "Error fetching work IDs", error: error.message });
    }
};
