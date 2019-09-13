const express = require('express')
const surveyList = require('../models/SurveyList')
const router = new express.Router()

/*
//End point for adding new question to SurveyID
router.post('/tods/questions',async(res,req)=>{
    const question = new survayList.NewQuestion({
        questionTittle:req.body.questionTittle
    })
    try {
        await question.save()
        res.statu(201).send(question)
    }catch(e){
        res.statu(400).send(e)
    }
})*/


module.exports = router