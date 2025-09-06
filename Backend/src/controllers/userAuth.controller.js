const User = require('../models/userAuth.model')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id},process.env.SECRET,{expiresIn: '7d'})
}

const loginUser = async (req, res) => {
  const {email,password} = req.body

  try {
    const user = await User.login(email,password)

    const token = createToken(user._id)

    res.status(200).json({email,token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};


//sigup user
const signupUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.signup(email,password)

    const token = createToken(user._id)

    res.status(200).json({email,token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { loginUser, signupUser, getProfile };