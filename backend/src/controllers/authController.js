const Profile = require('../models/profile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username) throw new Error("Invalid Credential");
        if (!password) throw new Error("Invalid Credential");

        // Get user
        const user = await Profile.findOne({ username });
        if (!user) throw new Error("Invalid Credential");

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid Credential");
        }
        
        // JWT
        const token = jwt.sign(
          { _id: user._id, username: user.username, role: user.role }, 
          process.env.JWT_SECRET, 
          { expiresIn: '48h' }
        );
        const reply = { name: user.name, username: user.username, _id: user._id, role: user.role, gmail: user.gmail };
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 48 * 60 * 60 * 1000 // 48 hours
        });
        
        res.status(200).json({
            user: reply,
            message: `Login Successfully.`
        });

    } catch (err) {
         res.status(401).send("Error : " + err.message);
    }
};

exports.logout = async (req, res) => {
   try {
    const token = req.cookies.token;
    if (!token) throw new Error("No token provided");

    const payload = jwt.decode(token);
    if (payload && payload.exp) {
        // Add in Redis Blacklist
        await redisClient.set(`token:${token}`, "Block");
        await redisClient.expireat(`token:${token}`, payload.exp);
    }
    
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out successfully!");
   } catch (err) {
    res.status(503).send("Error: " + err.message);
   }
};
