const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }catch (err) {
        res.status(400).send(err);
    }
});

//login route
router.post('/login', async(req, res) => {
    //validate data 
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    //checking if doesn't email exists
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('Account doesnt exist!');
    }
    //check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send('Invalid password');
    }

    res.send('Logged in!');
});

module.exports = router ;