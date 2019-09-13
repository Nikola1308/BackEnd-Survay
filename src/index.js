const express = require('express')
require('./mongodb/mongoose')
const surveyList = require('./routers/newSurveyRouts')
const questionList = require('./routers/newQuestionRout')


const app = express()

const port = process.env.PORT || 3004
app.use((req,res,next)=>{
    next();
})
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,'Autorization");
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods",'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json()
    }
    next();
  });

app.use(surveyList,questionList)

app.listen(port,()=>{
    console.log('Serve is up on port: ' + port)
})


