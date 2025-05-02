const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:'all fields are required'});
    }
    const userExists = await User.findOne({email});
    if (userExists){
        return res.status(400).json({message:'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name, 
        email,
        hashedPassword,
    });
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{
        expiresIn:'30d'
    });
    res.status(201).json({
        message:'User registerd',
        user: {
        id:user._id,
        name:user.name,
        email:user.email,
        token,}
    });
};

const loginUser = async (req, res)=>{
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json({message:'all fields are required'});
    }
    const user = User.findOne({email});
    if(!user){
        return res.status(400).json({message:'User not found'});
    }
    const isMatch = await bcrypt.compare(password,(await user).password);
    if(!isMatch){
        return res.status(400).json({message: "Invalid credentials"});
    }
    const token = jwt.sign({id:user._id} , process.env.JWT_SECRET,{
        expiresIn:'1d'
    });
    res.status(200).json({
        message:'User logged in',
        user:{
            id:(await user)._id,
            name:(await user).name,
            email:(await user).email,
            token,
        }

    })
}

module.exports = {registerUser, loginUser}