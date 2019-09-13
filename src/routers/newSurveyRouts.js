const express = require('express')
const router = new express.Router()
const passport = require('passport')
const surveyList = require('../models/SurveyList')
//const passConfirm = require('../passport')
const { JWT_SECRET } = require('../JwtSecret/jwtSecret');
const JWT = require('jsonwebtoken')
const googleOAuthJWT = require('../googleToken/googleToken')

//!!!ispraviti na pravilno survry sve
//End point for Adding new Survey -------------------------
router.post('/surveys',async(req,res)=>{
    const survey = new surveyList.NewSurvey({
        titleForNewSurvey:req.body.titleForNewSurvey,
        descriptionForNewSurvey:req.body.descriptionForNewSurvey
    })
    try{
        await survey.save()
        res.status(201).send(survey)
        
    }catch(e){
        res.status(400).send(e)
    }
})

//Endpoint for getting all surveys -----------
router.get('/surveys',async(req,res)=>{
    try{
        const surveys = await surveyList.NewSurvey.find({}).populate({
            path:'questions',
            populate:{
                path:'answers'
            }
        }).exec()
       // res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(surveys)
    }catch(e){
        res.status(500).send(e)
    }
})
//Endpoint for getting one Survey by Id --------------
router.get('/surveys/:id',async(req,res)=>{
    const _id = req.params.id
    
    try {
        const survey = await surveyList.NewSurvey.findById(_id).populate({
            path: 'questions',
            populate:{
                path:'answers'
            }
        }).exec()
        if(!survey){
            return res.status(404).send()
        }
       // survey.questions.forEach((question) => question.answers.forEach((answer)=>console.log(answer)))
        
        res.send(survey)
    
    }catch(e){
        res.status(500).send()
    }
})

//Endpoint for Updating Survey-s  Title and Descriptio by Id -------------
router.patch('/surveys/:id',async(req,res)=>{
   
    const _id = req.params.id
    const keysForSurveys = Object.keys(req.body)
    const valueParForSurveys = {};
    keysForSurveys.forEach((key)=>valueParForSurveys[key]=req.body[key])    

    try{
        const survey = await surveyList.NewSurvey.findByIdAndUpdate(_id,{...valueParForSurveys},
            {new:true,runValidators:true})
            
        if(!survey){
            return res.status(404).send()
        }
        res.send(survey)
    }catch(e){
        res.status(400).send()
    }
})

//Endpoint for getting all answers from questions from Survey by Id --------------
router.get('/survey/questions/allanswers/:id',async(req,res)=>{
    const _id = req.params.id
    try{
       const allAnswers = await surveyList.NewSurvey.findById(_id).populate({
        path:'questions',
        populate:{
            path:'answers'
        }
    }).exec()
    
    if (!allAnswers){
        return res.status(404).send()
    }
    let allAnswersDecisions =allAnswers.questions.map((question)=>{
      return question.answers.filter((answer)=>{
          return answer.answerDecision === true 
      })
    })
    res.send(allAnswersDecisions)
    }catch(e){
        res.status(400).send(e)
    }
})


//Endpoint for deleting Survay bi ID , questions and answerst from that Survay -------
router.delete('/surveys/:id', async(req,res,next)=>{
    surveyList.NewSurvey.findById(req.params.id,function(err,survey){
        if(err) 
        return next(err)
        survey.remove()
        res.send('Uspjelo')
    }) 
})

//==================== Enpoints For Survay Question =============================//

//Endpoint for adding new question for survay  ------------------ 
router.post('/surveys/question/:id',async(req,res)=>{
    const _id = req.params.id
    const newQuestion = new surveyList.NewQuestion({
        questionTitle:req.body.questionTitle
    })
    try {      
        newQuestion.save()  
        const question = await surveyList.NewSurvey.findByIdAndUpdate(_id,
            {$addToSet:{questions:newQuestion}},{new:true,runValidators:true}).populate('questions')
           
        if(!question){
            return res.status(404).send()
        }
        res.send(question)
        
    }catch(e){
        res.status(400).send(e) 
    }
})
//Endpoint for updating QuestionTitle ----------
router.patch('/surveys/question/:id',async(req,res)=>{
    const _id = req.params.id
   
    try {
        const question = await surveyList.NewQuestion.findByIdAndUpdate(_id,
            {questionTitle:req.body.newQuestionTitle},{new:true,runValidators:true})
        if(!question){
            return res.status(404).send()
        }
        res.send(question)
    }catch(e){
        res.status(500).send()
    }
})

//Endpoint for geeting all Answers from Question by Question id ------
router.get('/survey/question/:id',async(req,res)=>{
    const _id = req.params.id 

    try {
        const question = await surveyList.NewQuestion.findById(_id).populate('answers').exec()
        if (!question){
            return res.status(404).send()
        }
        res.send(question)

    }catch(e){
        res.status(500).send()
    }
})
//Endpoint for finding anweredQuestion by Question and his Id  ---------
router.get('/survey/question/questionaswered/:id',async(req,res)=>{
    const _id = req.params.id 

    try {
        const question = await surveyList.NewQuestion.findById(_id).populate('answers').exec()
        if (!question){
            return res.status(404).send()
        }
       
        let trueQuestionAnswerd = question.answers.filter((answer)=>{
            return answer.answerDecision === true
        })
        res.send(trueQuestionAnswerd)

    }catch(e){
        res.status(500).send()
    }
})

//Endpoint for deleting Question from Survay by Id and deling all answers from that question --------
router.delete('/surveys/question/:id', async(req,res,next)=>{
    surveyList.NewQuestion.findById(req.params.id,function(err,survey){
        if(err) 
        return next(err)
        survey.remove()
        res.send('Uspjesno brisanje')
    }) 
})

//======= Endpoinst For Answers from Survay Question ======//

//Endpoint adding new Answer to Qustion from Survay ---------
router.post('/surveys/question/answer/:id',async(req,res)=>{
    const _id = req.params.id
    const newAnswer = surveyList.newAnswer({
        answerTitle:req.body.answerTitle
    })
    try {
        newAnswer.save()
        const answer = await surveyList.NewQuestion.findByIdAndUpdate(_id,
            {$addToSet:{answers:newAnswer}},{new:true,runValidators:true}).populate('answers')
        if(!answer){
            return res.status(404).send()
        }
        res.send(answer)
    }catch(e){
       res.status(400).send(e)
    }
})
//Endpoint for updating anwerTitle from Anwer by Id ----------------
router.patch('/surveys/question/answertitle/:id',async(req,res)=>{
    const _id = req.params.id
   
    try {
        const answer = await surveyList.newAnswer.findByIdAndUpdate(_id,
            {answerTitle:req.body.newAnswerTitle},{new:true,runValidators:true})
        if(!answer){
            return res.status(404).send()
        }
        res.send(answer)
    }catch(e){
        res.status(500).send()
    }
})

//Endpoint for deleting Answer by Id from Question from Survay
router.delete('/surveys/question/answer/:id',async(req,res)=>{
    const _id = req.params.id   
    const id = req.body.questionForDeleting

    try {
        const question = await surveyList.newAnswer.findByIdAndDelete(id)
        const answer = await surveyList.NewQuestion.findByIdAndUpdate(_id,
            {$pull:{answers:id}},{new:true,runValidators:true})
        if(!answer){
            return res.status(404).send()
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(answer)
    }catch(e){
        res.status(400).send()
    }
})

//Endpoint for updating Answers Decision to true or false 
router.patch('/surveys/question/answer/status/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const answer = await surveyList.newAnswer.findByIdAndUpdate(_id,{answerDecision:req.body.newAnwerDecision},
            {new:true,runValidators:true})
        if (!answer){
            return res.status(404).send()
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(answer)

    }catch(e){
        res.status(400).send(e)
    }
})

//Endpoint for singing in users to survey by Google
signToken = user => {
    return JWT.sign({
      iss: 'CodeWorker',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
  }
  console.log(JWT_SECRET)
 
router.route('/survey/oauth/google')
.post(passport.authenticate('googleToken',{session:false}),googleOAuthJWT.googleOAuth)

//-------------------Whole Survey------------------//

router.post('/survey/wholenewsurvey/',async(req,res)=>{
    const survey = new surveyList.NewSurvey({
        titleForNewSurvey:req.body.titleForNewSurvey,
        descriptionForNewSurvey:req.body.descriptionForNewSurvey
    })
        let newSurvey = await survey.save()
        let questions =  req.body.questions;

        questions.forEach(async (question) => {

            const newQuestion = new surveyList.NewQuestion({
                questionTitle: question.questionTitle
            });

            newQuestion.save();

            await surveyList.NewSurvey.findByIdAndUpdate(newSurvey._id, {
                $addToSet:{questions:newQuestion}},{new:true,runValidators:true
            })

            question.answers.forEach( async (answer) => {
                const newAnswer = new surveyList.newAnswer({
                    answerTitle : answer.answerTitle,
                    answerDecision : answer.answerValue
                })
                newAnswer.save()

                await surveyList.NewQuestion.findByIdAndUpdate(newQuestion._id, {
                    $addToSet:{answers:newAnswer}},{new:true,runValidators:true
                })
            });
        });
    
})

module.exports = router

