const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { query, body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// Route :: 1 For user Registeration
router.post(

  // Endpoint for the new user login
  "/createUser",

  //If length of name is not greater than 3
  body("name").isLength({ min: 3 }).withMessage("Name must be greater than 3"),

  //If email is not valid
  body("email").isEmail().withMessage("Not a valid e-mail address"),

  //If length of password is not greater than 5
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be greater than 5"),
  
  
  async (req, res) => {

    // Store the above error logs in 'result'
    const result = validationResult(req);

    // If 'result' is not empty, means there's some error found, so don't create new user.
    if (!result.isEmpty()) {
      return res.status(400).json({ result: result.array() });
    }
    
    // If not, check wether, same user already logined with same emai;l
    // Using await function, to fully excecute this line firstly
    let user = await User.findOne({ email: req.body.email });
    
    // If user with same email found, return status 400 with error message
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry Email already registered !!" });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);

    // If not found simple create user and save it in database
    user = await User.create({
      name: req.body.name,
      password: hash,
      email: req.body.email,
    });

    const data = {
      user:{
        id:user.id
      }
    }
    const token = jwt.sign(data, 'shhhhh');

    res.json({token});
  }
);

// Route :: 2 For user Login
router.post(

  '/login',

  //If email is not valid
  body("email").isEmail().withMessage("Not a valid e-mail address"),

  //If length of password is not greater than 5
  body("password")
    .exists()
    .withMessage("Password must be greater than 5"),
  
  async (req, res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ){
      return req.status(500).send("Something Went Wrong. Try Again !!");
    }

    const { email, password } = req.body; 

    try{
      let user = await User.findOne({email: email});

      if (!user){
        return req.status(400).json({error: "Please Try To Login With Correct Credentials !!"});
      }

      const PasswordCompare = await bcrypt.compare(password, user.password);

      if(!PasswordCompare){
        return res.status(400).json({error: "Please Try To Login With Correct Credentials !!"});
      }

      const data = {
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data, 'shhhhh');
  
      res.json({token});
    }catch{
      console.log(errors);
      res.status(500).json({error: 'Internal Error Occured !!'});
    }
  }
)


// Route :: 3 For Get User Details
router.post(

  '/getuser',

  fetchuser,

  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(401).send({error: "Authenticate Well"});
    }
  }

) 


module.exports = router;
