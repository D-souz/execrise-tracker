const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const {USER, INFO, LOG} = require('./models/username');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'))

// //  db connection function
    // db connection 
    // const conn = process.env.MONGO_URL;
    // const conn = "mongodb://localhost:27017/execrise-tracker";
    mongoose.set('strictQuery', false)
    const conn = "mongodb+srv://blog123:blog123@cluster0.x6chg7g.mongodb.net/execrise-tracker?retryWrites=true&w=majority";
    mongoose.connect(conn, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then(() => {
        const listener = app.listen(process.env.PORT || 3000, () => {
            console.log('Your app is listening on port ' + listener.address().port + " & db connected")
          })
    })
    .catch((err) => {
        console.log(err);
    })

// displaying the html file with the forms
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// getting all the users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await USER.find();
    res.send(allUsers)
  } catch (error) {
    console.log(error);
    res.send("No users found!");
  }
  })
   

// creating the new user with post end point /api/users 
app.post('/api/users',async (req, res) => {
  try {
    const userName = req.body.username;
    // console.log(userName)
    const newUserName = new USER({
      username: userName
    })
    // saving the user
    const userSaved = await newUserName.save()
    console.log(userSaved)
      res.json({ username: userName, _id: userSaved._id})
  } catch (error) {
    console.log(error);
    res.json({message: "could not save user name"})
  }
  
})


/
// post request for the exercise form
app.post('/api/users/:_id/exercises', async (req, res) => {
  // grabbing the id from the url/paramter
  const id = req.params._id;
  // grabbing inputs from the form
  const { description, duration, date } = req.body;

  try {
    // finding the user
    const findUser = await USER.findById(id)
    if (!findUser) {
      res.json({message: "cound not find user"});
    } else {
      const userInfo = new INFO({
          userId: findUser._id,
          description: description,
          duration: duration,
          date: date ? new Date(date) : new Date()
      })

        // saving the data
        const userExecrise = await userInfo.save()
        console.log(userExecrise);
        res.json({
          _id: userExecrise.userId, 
          username: findUser.username, 
          date: new Date (userExecrise.date).toDateString(),
          duration: userExecrise.duration,
          description: userExecrise.description
        })
    }
  
  } catch (error) {
    console.log(error);
    res.json({message: "counld not save user exercise"});
  }
})

// retrieving a execrise log of the user
app.get('/api/users/:_id/logs', async (req,res) => {

  // grabbing the query parameters
  const { from, to, limit } = req.query;
  const id = req.params._id;
  try {
    const findUser = await USER.findById(id);
    if (!findUser) {
      res.json({message: "cound not find user"});
    } else {
      // filtering using the dates from the request query
      let dateObj = {}
      if (from) {
        dateObj["$gte"] = new Date(from)
      }
      if (to) {
        dateObj["$lte"] = new Date(to)
      }
      let filter = {
        userId: id
      }
      if (from || to) {
        filter.date = dateObj
      }

      const userExecriseInfo = await INFO.find(filter).limit(+limit ?? 20)

      // mapping over each user's execrise info
      const log = userExecriseInfo.map(execrise => ({
        description: execrise.description,
        duration: execrise.duration,
        date: execrise.date.toDateString()
      }))
      res.json({
        username: findUser.username,
        count: userExecriseInfo.length,
        _id: userExecriseInfo.userId,
        log
      })
    }
  } catch (error) {
    console.log(error);
  }
  

})