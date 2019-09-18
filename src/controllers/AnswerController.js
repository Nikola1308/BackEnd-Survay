const express = require('express')
const surveyList = require('../models/SurveyList')


class AnswerController {


    static async addAnswer(req,res){
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
    }

    static async getAllAnswers(req,res){
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
    }
    static async answeredQuestion(req,res){
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
    }
    static async updateAnswerTitle(req,res){
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
    }
    static async deleteAnswer(req,res){
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
    }
    static async answerDecisionChange(req,res){
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
    }
}

module.exports = AnswerController