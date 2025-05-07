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
        password:hashedPassword,
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
    try {
        console.log('Login request body: ', req.body);
        const {email, password} = req.body;
    if (!email  || !password){
        console.log('All fields are required');
        return res.status(400).json({message:'all fields are required'});
        
    }
    console.log('Email and password: ', email, password);
    const user =await User.findOne({email});
    console.log('User found: ', user);
    if(!user){
        return res.status(400).json({message:'User not found'});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message: "Invalid credentials"});
    }
    const token = jwt.sign({id:user._id} , process.env.JWT_SECRET,{
        expiresIn:'1d'
    });
    res.status(200).json({
        message:'User Logged In',
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            token,
        }

    })
    } catch (error) {
        return res.status(500).json({message:'Server side error'})
    }
}

module.exports = {registerUser, loginUser}