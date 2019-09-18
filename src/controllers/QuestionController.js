const express = require('express')
const surveyList = require('../models/SurveyList')

class QuestionController {

    static async addQuestion(req,res){
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
    }

    static async allQuestions(req,res){
        const _id = req.params.id 

    try {
        const question = await surveyList.NewSurvey.findById(_id).populate('questions').exec()
        if (!question){
            return res.status(404).send()
        }
        res.send(question)

    }catch(e){
        res.status(500).send()
         }
    }
    static async updateQuestionTitle(req,res){
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
    }
    static async deleteQuestion(req,res,next){
        surveyList.NewQuestion.findById(req.params.id,function(err,survey){
            if(err) 
            return next(err)
            survey.remove()
            res.send('Uspjesno brisanje')
        }) 
    }
}

module.exports = QuestionController