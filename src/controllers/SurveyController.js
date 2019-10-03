const express = require('express')
const surveyList = require('../models/SurveyList')


class SurveyController {
    
    static async createNewSurvey (req, res)  {
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
    }

    static async getAllSurveys (req, res)  {
        try{
            const surveys = await surveyList.NewSurvey.find({},{titleForNewSurvey:1,descriptionForNewSurvey:1})
            res.send(surveys)
        }catch(e){
            res.status(500).send(e)
        }
    }

    static async getSurveyById (req,res){
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
        res.send(survey)
    
    }catch(e){
        res.status(500).send()
        }
    }

    static async updateTitleDescription (req,res){
   
        const _id = req.params.id
        const keysForSurveys = Object.keys(req.body)
        const valueParForSurveys = {};
        keysForSurveys.map((key)=>valueParForSurveys[key]=req.body[key])    
    
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
    }
    static async deleteSurvey(req,res,next){
        surveyList.NewSurvey.findById(req.params.id,function(err,survey){
            if(err) 
            return next(err)
            survey.remove()
            res.send('Uspjelo')
        }) 
    }


    static async surveyAnswers(req,res){
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
    }

    static async postWholeSurvey(req,res){
        
        const survey = new surveyList.NewSurvey({
            titleForNewSurvey:req.body.newSurvay.survay.titleForNewSurvey,
            descriptionForNewSurvey:req.body.newSurvay.survay.descriptionForNewSurvey
        })
            let newSurvey = await survey.save()

            let questions =  req.body.newSurvay.survay.questions;
            let newQuestion = ''
            let newAnswer = ''
            Object.keys(questions).map(async (question) => {
                if (typeof questions[question] === 'object')
              
                newQuestion= new surveyList.NewQuestion({
                    questionTitle: questions[question].title
                    
                });
              
            let newQuestionSaved =await newQuestion.save();
                await surveyList.NewSurvey.findByIdAndUpdate(newSurvey.id, {
                    $addToSet:{questions:newQuestionSaved}},{new:true,runValidators:true
                })             
                  
               Object.keys(questions[question].answers).map( async (answer) => {                      
                    if(typeof questions[question].answers[answer]==='object' )
                        
                        newAnswer = new surveyList.newAnswer({
                        answerTitle :questions[question].answers[answer].titleAnswer
                      })
                         newAnswer.save()
                         await surveyList.NewQuestion.findByIdAndUpdate(newQuestionSaved._id, {
                            $addToSet:{answers:newAnswer}},{new:true,runValidators:true
                        })
                    
                  });  
            });
            res.json('Uspjelo');
    }
}

module.exports = SurveyController