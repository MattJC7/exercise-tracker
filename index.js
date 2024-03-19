const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
require('dotenv').config()
let mongoose = require('mongoose');
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTOpology: true});

const userSchema = new mongoose.Schema({
  username: String
})
let Username = mongoose.model('user', userSchema)

const exerciseSchema = new mongoose.Schema({
  user_id: String,
  description: String,
  duration: Number,
  dateObject: Number,
  date: String
})
let Exercise = mongoose.model('exercise', exerciseSchema)


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Post to /api/users

app.post('/api/users', urlencodedParser, (req, res) => {
  const username = req.body.username
  let newUser = new Username ({
    username: username
  })
  newUser.save().then((savedDoc) => {
    res.json(savedDoc)
  })
})

//GET from /api/users

app.get('/api/users', (req, res) => {
  Username.find().then((found) => res.json(found))
})

//POST to /api/users/:_id/exercises 

app.post('/api/users/:_id/exercises', urlencodedParser, async (req, res) => {

  let date = req.body.date ? new Date(req.body.date) : new Date()
  
  const userId = req.params["_id"]
  const userObject = await Username.findById(userId)

  let newExercise = new Exercise ({
    description: req.body.description,
    duration: req.body.duration,
    dateObject: Date.parse(date),
    date: date.toDateString(),
    user_id: userId
  })
  newExercise.save().then((savedDoc) => {
    res.json({
      username: userObject.username,
      description: savedDoc.description,
      duration: savedDoc.duration,
      date: savedDoc.date,
      _id: userId
    })
  })
})

//GET from /api/users/:_id/logs 

app.get('/api/users/:_id/logs', urlencodedParser, async (req, res) => {
  const userId = req.params["_id"]
  const userObject = await Username.findById(userId)

  if(req.query.from || req.query.to){
    const dateFrom = Date.parse(req.query.from)
    const dateTo = Date.parse(req.query.to)
    
    let exerciseLogs = 
      await Exercise.find({user_id: userId, dateObject: {$gte: dateFrom, $lte: dateTo}})
                    .select('-_id -user_id -__v -dateObject')
                    .limit(req.query.limit)

    res.json({
      username: userObject.username,
      count: exerciseLogs.length,
      _id: userId,
      log: exerciseLogs
    })
  }else{
    let exerciseLogs = 
      await Exercise.find({user_id: userId})
                    .select('-_id -user_id -__v')
                    .limit(req.query.limit)
    res.json({
      username: userObject.username,
      count: exerciseLogs.length,
      _id: userId,
      log: exerciseLogs
    })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})