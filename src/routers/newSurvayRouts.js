const express = require('express')
const passport = require('passport')
const survayList = require('../models/SurvayList')
const router = new express.Router()
const passConfirm = require('../passport')
const { JWT_SECRET } = require('../JwtSecret/jwtSecret');
const JWT = require('jsonwebtoken')
const googleOAuthJWT = require('../googleToken/googleToken')

//!!!ispraviti na pravilno survry sve
//End point for Adding new Survay -------------------------
router.post('/survays',async(req,res)=>{
    const survay = new survayList.NewSurvay({
        titleForNewSurvay:req.body.titleForNewSurvay,
        descriptionForNewSurvay:req.body.descriptionForNewSurvay
    })
    try{
        await survay.save()
        res.status(201).send(survay)
        
    }catch(e){
        res.status(400).send(e)
    }
})

//Endpoint for getting all survays -----------
router.get('/survays',async(req,res)=>{
    try{
        const survays = await survayList.NewSurvay.find({}).populate({
            path:'questions',
            populate:{
                path:'answers'
            }
        }).exec()
       // res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(survays)
    }catch(e){
        res.status(500).send(e)
    }
})
//Endpoint for getting one Survay by Id --------------
router.get('/survays/:id',async(req,res)=>{
    const _id = req.params.id
    
    try {
        const survay = await survayList.NewSurvay.findById(_id).populate({
            path: 'questions',
            populate:{
                path:'answers'
            }
        }).exec()
        if(!survay){
            return res.status(404).send()
        }
       // survay.questions.forEach((question) => question.answers.forEach((answer)=>console.log(answer)))
        
        res.send(survay)
    
    }catch(e){
        res.status(500).send()
    }
})

//Endpoint for Updating Survay-s  Title and Descriptio by Id -------------
router.patch('/survays/:id',async(req,res)=>{
   
    const _id = req.params.id
    const keysForSurvays = Object.keys(req.body)
    const valueParForSurvays = {};
    keysForSurvays.forEach((key)=>valueParForSurvays[key]=req.body[key])    

    try{
        const survay = await survayList.NewSurvay.findByIdAndUpdate(_id,{...valueParForSurvays},
            {new:true,runValidators:true})
            
        if(!survay){
            return res.status(404).send()
        }
        res.send(survay)
    }catch(e){
        res.status(400).send()
    }
})

//Endpoint for getting all answers from questions from Survay by Id --------------
router.get('/survay/questions/allanswers/:id',async(req,res)=>{
    const _id = req.params.id
    try{
       const allAnswers = await survayList.NewSurvay.findById(_id).populate({
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
router.delete('/survays/:id', async(req,res,next)=>{
    survayList.NewSurvay.findById(req.params.id,function(err,survey){
        if(err) 
        return next(err)
        survey.remove()
        res.send('Uspjelo')
    }) 
})

//==================== Enpoints For Survay Question =============================//

//Endpoint for adding new question for survay  ------------------ 
router.post('/survays/question/:id',async(req,res)=>{
    const _id = req.params.id
    const newQuestion = new survayList.NewQuestion({
        questionTittle:req.body.questionTittle
    })
    try {      
        newQuestion.save()  
        const question = await survayList.NewSurvay.findByIdAndUpdate(_id,
            {$addToSet:{questions:newQuestion}},{new:true,runValidators:true}).populate('questions')
           
        if(!question){
            return res.status(404).send()
        }
        res.send(question)
        
    }catch(e){
        res.status(400).send(e) 
    }
})
//Endpoint for updating QuestionTittle ----------
router.patch('/survays/question/:id',async(req,res)=>{
    const _id = req.params.id
   
    try {
        const question = await survayList.NewQuestion.findByIdAndUpdate(_id,
            {questionTittle:req.body.newQuestionTitle},{new:true,runValidators:true})
        if(!question){
            return res.status(404).send()
        }
        res.send(question)
    }catch(e){
        res.status(500).send()
    }
})

//Endpoint for geeting all Answers from Question by Question id ------
router.get('/survay/question/:id',async(req,res)=>{
    const _id = req.params.id 

    try {
        const question = await survayList.NewQuestion.findById(_id).populate('answers').exec()
        if (!question){
            return res.status(404).send()
        }
        res.send(question)

    }catch(e){
        res.status(500).send()
    }
})
//Endpoint for finding anweredQuestion by Question and his Id  ---------
router.get('/survay/question/questionaswered/:id',async(req,res)=>{
    const _id = req.params.id 

    try {
        const question = await survayList.NewQuestion.findById(_id).populate('answers').exec()
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
router.delete('/survays/question/:id', async(req,res,next)=>{
    survayList.NewQuestion.findById(req.params.id,function(err,survey){
        if(err) 
        return next(err)
        survey.remove()
        res.send('Uspjesno brisanje')
    }) 
})

//======= Endpoinst For Answers from Survay Question ======//

//Endpoint adding new Answer to Qustion from Survay ---------
router.post('/survays/question/answer/:id',async(req,res)=>{
    const _id = req.params.id
    const newAnswer = survayList.newAnswer({
        answerTitle:req.body.answerTitle
    })
    try {
        newAnswer.save()
        const answer = await survayList.NewQuestion.findByIdAndUpdate(_id,
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
router.patch('/survays/question/answertitle/:id',async(req,res)=>{
    const _id = req.params.id
   
    try {
        const answer = await survayList.newAnswer.findByIdAndUpdate(_id,
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
router.delete('/survays/question/answer/:id',async(req,res)=>{
    const _id = req.params.id   
    const id = req.body.questionForDeleting

    try {
        const question = await survayList.newAnswer.findByIdAndDelete(id)
        const answer = await survayList.NewQuestion.findByIdAndUpdate(_id,
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
router.patch('/survays/question/answer/status/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const answer = await survayList.newAnswer.findByIdAndUpdate(_id,{answerDecision:req.body.newAnwerDecision},
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
      iss: 'CodeWorkr',
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
  }
  console.log(JWT_SECRET)
 
router.route('/survay/oauth/google')
.post(passport.authenticate('googleToken',{session:false}),googleOAuthJWT.googleOAuth)

module.exports = router