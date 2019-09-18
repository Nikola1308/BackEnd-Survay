const express = require('express')
const passport = require('passport')
const surveyList = require('../models/SurveyList')
const router = new express.Router()
const passConfirm = require('../passport')
const { JWT_SECRET } = require('../JwtSecret/jwtSecret');
const JWT = require('jsonwebtoken')
const googleOAuthJWT = require('../googleToken/googleToken')
const SurveyController = require('../controllers/SurveyController')
const QuestionController = require('../controllers/QuestionController')
const AnswerController = require('../controllers/AnswerController')


//End point for Adding new Survey -------------------------
router.post("/surveys", SurveyController.createNewSurvey)

//Endpoint for getting all surveys -----------
router.get('/surveys', SurveyController.getAllSurveys)

//Endpoint for getting one Survey by Id --------------
router.get('/surveys/:id',SurveyController.getSurveyById)

//Endpoint for Updating Survey-s  Title and Descriptio by Id -------------
router.patch('/surveys/:id',SurveyController.updateTitleDescription)

//Endpoint for deleting Survay bi ID , questions and answerst from that Survay -------
router.delete('/surveys/:id',SurveyController.deleteSurvey)

//Endpoint for getting all answerd question from Survey
router.get('/survey/questions/allanswers/answered/',SurveyController.surveyAnswers)

//Endpoint for posting whole Survey
router.post('/survey/wholenewsurvey/',SurveyController.postWholeSurvey)

//==================== Enpoints For Survay Question =============================//

//Endpoint for adding new question for survay  ------------------ 
router.post('/surveys/question/:id',QuestionController.addQuestion)

//Endpoint for getting all answers from questions from Survey by Id --------------
router.get('/survey/questions/allanswers/:id',QuestionController.allQuestions)

//Endpoint for updating QuestionTitle ----------
router.patch('/surveys/question/:id',QuestionController.updateQuestionTitle)

//Endpoint for deleting Question from Survay by Id and deling all answers from that question --------
router.delete('/surveys/question/:id',QuestionController.deleteQuestion)

//========================== Endpoinst For Answers from Survay Question ========================//

//Endpoint adding new Answer to Qustion from Survay ---------
router.post('/surveys/question/answer/:id',AnswerController.addAnswer)


//Endpoint for geeting all Answers from Question by Question id ------
router.get('/survey/question/:id',AnswerController.getAllAnswers)


//Endpoint for finding anweredQuestion by Question and his Id  ---------
router.get('/survey/question/questionaswered/:id',AnswerController.answeredQuestion)


//Endpoint for updating anwerTitle from Anwer by Id ----------------
router.patch('/surveys/question/answertitle/:id',AnswerController.updateAnswerTitle)

//Endpoint for deleting Answer by Id from Question from Survay
router.delete('/surveys/question/answer/:id',AnswerController.deleteAnswer)

//Endpoint for updating Answers Decision to true or false 
router.patch('/surveys/question/answer/status/:id',AnswerController.answerDecisionChange)


//Endpoint for singing in users to survey by Google
signToken = user => {
    return JWT.sign({
      iss: 'CodeWorker',
      sub: user.id,
      iat: new Date().getTime(), 
      exp: new Date().setDate(new Date().getDate() + 1) 
    }, JWT_SECRET);
  }
router.route('/survey/oauth/google')
.post(passport.authenticate('googleToken',{session:false}),googleOAuthJWT.googleOAuth)


module.exports = router




