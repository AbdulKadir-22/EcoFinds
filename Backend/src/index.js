const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
const userAuthRoute = require('./routes/userAuth.routes');

app.use('/api/user',userAuthRoute);


// app.use(express.json());



module.exports = app;