const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {registerValidation, loginValidation} = require('../middleware/validation');

//register route
router.post('/register', async (req, res) => {

    //Validate data before creating new user
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //checking if user is already in database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist){
        return res.status(400).send('Email already exists!');
    }

    //ctreate salt and Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    }catch (err) {
        res.status(400).send(err);
    }
});

//login route
router.post('/login', async(req, res) => {
    try { //wrap in try and catch block to handle PromiseRejection
        //validate data 
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const {email, password } = req.body; // extract email and password from body

        //checking if doesn't email exists and selecgt password if it does
        const user = await User.findOne({email: email}).select('password').exec();
        if(!user){
            return res.status(400).send('Invalid email or password!');
        }
        //check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).send('Invalid password');
        }

        //create and assign a token
        const token = jwt.sign({_id: email}, process.env.TOKEN_SECRET);
        //create httpOnly cookie
        res.cookie("jwt_token", token, {
            maxAge: 3600, // 1 hour
            httpOnly: true // only accessed by server
        });

        /**
         *  send back user id and email
         *  NEED TO REMOVE LATER. Just there to check code in postman
         */
        res.status(200).send({
            "userID": user._id,
            "email": email,
        });
    }catch(err){
        res.status(400).send({
            "error": err.message
        });
    }
});

module.exports = router ;